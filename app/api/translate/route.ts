import { NextResponse } from "next/server"
import { z } from "zod"

import { enhanceTranslation } from "@/lib/enhance-translation"
import { isGatewayConfigured } from "@/lib/server-env"
import { translateFemale, translateMale } from "@/lib/translator"

export const runtime = "nodejs"

const translationRequestSchema = z.object({
  input: z.string().trim().min(1).max(500),
  gender: z.enum(["male", "female"]).default("male"),
  sarcasmLevel: z.number().int().min(1).max(10),
  gruntMode: z.boolean(),
})

export async function POST(request: Request) {
  const body = translationRequestSchema.safeParse(await request.json())

  if (!body.success) {
    return NextResponse.json(
      {
        error:
          "Invalid request. Provide input, a sarcasm level from 1–10, and grunt mode.",
      },
      { status: 400 }
    )
  }

  const { input, gender, sarcasmLevel, gruntMode } = body.data
  const baseline =
    gender === "female"
      ? translateFemale(input, { sarcasmLevel, gruntMode })
      : translateMale(input, { sarcasmLevel, gruntMode })

  if (!isGatewayConfigured()) {
    return NextResponse.json(baseline)
  }

  try {
    const enhanced = await enhanceTranslation(baseline, sarcasmLevel)
    return NextResponse.json(enhanced)
  } catch (error) {
    console.error("AI translation enhancement failed:", error)
    return NextResponse.json(baseline)
  }
}
