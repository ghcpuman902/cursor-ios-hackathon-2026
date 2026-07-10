import { NextResponse } from "next/server"
import { z } from "zod"

import { enforceRateLimit } from "@/lib/server/rate-limit"
import { isGatewayConfigured } from "@/lib/server-env"
import { runTranslatePipelineForGender } from "@/lib/translate-pipeline"

export const runtime = "nodejs"

/**
 * Compatibility wrapper — prefer POST /api/translate with an image attachment.
 */
const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const SUPPORTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"])

const screenshotRequestSchema = z.object({
  gender: z.enum(["male", "female"]),
  sarcasmLevel: z.coerce.number().int().min(1).max(10),
  gruntMode: z.enum(["true", "false"]).transform((value) => value === "true"),
  text: z.string().trim().max(8_000).optional(),
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

export async function POST(request: Request) {
  const rateLimited = await enforceRateLimit(request, {
    routeName: "analyze-screenshot",
    limit: 20,
    windowSeconds: 60,
  })

  if (rateLimited) {
    return rateLimited
  }

  if (!isGatewayConfigured()) {
    return NextResponse.json(
      {
        error:
          "Screenshot analysis is not configured. Set up AI Gateway authentication on the server.",
      },
      { status: 503 }
    )
  }

  try {
    const formData = await request.formData()
    const screenshot = formData.get("screenshot")
    const requestData = screenshotRequestSchema.safeParse({
      gender: formData.get("gender"),
      sarcasmLevel: formData.get("sarcasmLevel"),
      gruntMode: formData.get("gruntMode"),
      text: formData.get("text")?.toString() || undefined,
    })

    if (!requestData.success) {
      return NextResponse.json(
        { error: "Choose who you are into and provide valid app settings." },
        { status: 400 }
      )
    }

    if (!(screenshot instanceof Blob)) {
      return NextResponse.json(
        { error: "Choose a conversation screenshot first." },
        { status: 400 }
      )
    }

    if (
      screenshot.size === 0 ||
      screenshot.size > MAX_IMAGE_BYTES ||
      !SUPPORTED_IMAGE_TYPES.has(screenshot.type)
    ) {
      return NextResponse.json(
        { error: "Upload a PNG, JPEG, or WebP screenshot up to 10 MB." },
        { status: 400 }
      )
    }

    const imageBytes = new Uint8Array(await screenshot.arrayBuffer())

    if (!hasValidImageSignature(imageBytes, screenshot.type)) {
      return NextResponse.json(
        { error: "The uploaded file does not appear to be a valid image." },
        { status: 400 }
      )
    }

    const { gender, sarcasmLevel, gruntMode, text } = requestData.data
    const result = await runTranslatePipelineForGender({
      gender,
      sarcasmLevel,
      gruntMode,
      text,
      image: {
        bytes: imageBytes,
        mediaType: screenshot.type,
      },
      inputSource: text ? "mixed" : "typed",
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Screenshot analysis failed:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not read that conversation screenshot. Try another image.",
      },
      { status: 500 }
    )
  }
}
