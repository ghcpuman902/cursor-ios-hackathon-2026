import { NextResponse } from "next/server"
import { z } from "zod"

import { enforceRateLimit } from "@/lib/server/rate-limit"
import { isGatewayConfigured } from "@/lib/server-env"
import {
  runTranslatePipeline,
  type TranslateInputSource,
} from "@/lib/translate-pipeline"
import { genderToDirection } from "@/lib/translate-prompts"
import type { TranslationDirection } from "@/lib/translation-types"

export const runtime = "nodejs"

const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const SUPPORTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"])

const directionSchema = z.enum(["male_to_female", "female_to_male"])
const genderSchema = z.enum(["male", "female"])
const inputSourceSchema = z.enum(["typed", "voice", "mixed"])

const jsonRequestSchema = z
  .object({
    text: z.string().trim().min(1).max(8_000).optional(),
    /** @deprecated Prefer `text` */
    input: z.string().trim().min(1).max(8_000).optional(),
    direction: directionSchema.optional(),
    /** @deprecated Prefer `direction` — gender = source speaker */
    gender: genderSchema.optional(),
    inputSource: inputSourceSchema.optional(),
    sarcasmLevel: z.number().int().min(1).max(10),
    gruntMode: z.boolean(),
  })
  .refine((value) => Boolean(value.text?.trim() || value.input?.trim()), {
    message: "Provide text to translate.",
  })
  .refine((value) => Boolean(value.direction || value.gender), {
    message: "Provide direction or gender.",
  })

const formMetaSchema = z.object({
  text: z.string().trim().max(8_000).optional(),
  input: z.string().trim().max(8_000).optional(),
  direction: directionSchema.optional(),
  gender: genderSchema.optional(),
  inputSource: inputSourceSchema.optional(),
  sarcasmLevel: z.coerce.number().int().min(1).max(10),
  gruntMode: z
    .union([z.boolean(), z.enum(["true", "false"])])
    .transform((value) => value === true || value === "true"),
})

const hasValidImageSignature = (
  bytes: Uint8Array,
  mediaType: string
): boolean => {
  if (mediaType === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  }

  if (mediaType === "image/png") {
    return (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    )
  }

  if (mediaType === "image/webp") {
    const header = new TextDecoder().decode(bytes.slice(0, 12))
    return header.startsWith("RIFF") && header.endsWith("WEBP")
  }

  return false
}

const resolveDirection = (params: {
  direction?: TranslationDirection
  gender?: "male" | "female"
}): TranslationDirection => {
  if (params.direction) return params.direction
  return genderToDirection(params.gender ?? "male")
}

const parseImageFromForm = async (
  formData: FormData
): Promise<{ bytes: Uint8Array; mediaType: string } | undefined> => {
  const image =
    formData.get("image") ??
    formData.get("screenshot") ??
    formData.get("file")

  if (!(image instanceof Blob) || image.size === 0) {
    return undefined
  }

  if (
    image.size > MAX_IMAGE_BYTES ||
    !SUPPORTED_IMAGE_TYPES.has(image.type)
  ) {
    throw new Error("Upload a PNG, JPEG, or WebP image up to 10 MB.")
  }

  const bytes = new Uint8Array(await image.arrayBuffer())

  if (!hasValidImageSignature(bytes, image.type)) {
    throw new Error("The uploaded file does not appear to be a valid image.")
  }

  return { bytes, mediaType: image.type }
}

export async function POST(request: Request) {
  const rateLimited = await enforceRateLimit(request, {
    routeName: "translate",
    limit: 30,
    windowSeconds: 60,
  })

  if (rateLimited) {
    return rateLimited
  }

  try {
    const contentType = request.headers.get("content-type") ?? ""
    let text: string | undefined
    let direction: TranslationDirection
    let inputSource: TranslateInputSource | undefined
    let sarcasmLevel: number
    let gruntMode: boolean
    let image: { bytes: Uint8Array; mediaType: string } | undefined

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData()
      const meta = formMetaSchema.safeParse({
        text: formData.get("text")?.toString(),
        input: formData.get("input")?.toString(),
        direction: formData.get("direction")?.toString() || undefined,
        gender: formData.get("gender")?.toString() || undefined,
        inputSource: formData.get("inputSource")?.toString() || undefined,
        sarcasmLevel: formData.get("sarcasmLevel"),
        gruntMode: formData.get("gruntMode") ?? "false",
      })

      if (!meta.success) {
        return NextResponse.json(
          {
            error:
              "Invalid request. Provide direction (or gender), sarcasm level, and grunt mode.",
          },
          { status: 400 }
        )
      }

      text = meta.data.text?.trim() || meta.data.input?.trim() || undefined
      direction = resolveDirection(meta.data)
      inputSource = meta.data.inputSource
      sarcasmLevel = meta.data.sarcasmLevel
      gruntMode = meta.data.gruntMode

      try {
        image = await parseImageFromForm(formData)
      } catch (error) {
        return NextResponse.json(
          {
            error:
              error instanceof Error
                ? error.message
                : "Invalid image upload.",
          },
          { status: 400 }
        )
      }

      if (!text && !image) {
        return NextResponse.json(
          { error: "Provide text and/or an image attachment." },
          { status: 400 }
        )
      }
    } else {
      const body = jsonRequestSchema.safeParse(await request.json())

      if (!body.success) {
        return NextResponse.json(
          {
            error:
              "Invalid request. Provide text, direction (or gender), sarcasm level, and grunt mode.",
          },
          { status: 400 }
        )
      }

      text = body.data.text?.trim() || body.data.input?.trim()
      direction = resolveDirection(body.data)
      inputSource = body.data.inputSource
      sarcasmLevel = body.data.sarcasmLevel
      gruntMode = body.data.gruntMode
    }

    if (image && !isGatewayConfigured() && !text) {
      return NextResponse.json(
        {
          error:
            "Screenshot analysis is not configured. Set up AI Gateway authentication, or add text.",
        },
        { status: 503 }
      )
    }

    const result = await runTranslatePipeline({
      text,
      direction,
      inputSource,
      sarcasmLevel,
      gruntMode,
      image,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Translate pipeline failed:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not translate that input.",
      },
      { status: 500 }
    )
  }
}
