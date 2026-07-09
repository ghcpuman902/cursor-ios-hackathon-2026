import { generateSpeech } from "ai"
import { NextResponse } from "next/server"
import { z } from "zod"

import { openai } from "@/lib/ai"
import { serverEnv } from "@/lib/server-env"

export const runtime = "nodejs"

const speechRequestSchema = z.object({
  text: z.string().trim().min(1).max(1000),
})

export async function POST(request: Request) {
  try {
    const body = speechRequestSchema.safeParse(await request.json())

    if (!body.success) {
      return NextResponse.json(
        { error: "Invalid request. Provide a non-empty 'text' field (max 1000 chars)." },
        { status: 400 },
      )
    }

    const speech = await generateSpeech({
      model: openai.speech(serverEnv.OPENAI_SPEECH_MODEL),
      text: body.data.text,
      voice: serverEnv.OPENAI_SPEECH_VOICE,
      outputFormat: "mp3",
      abortSignal: AbortSignal.timeout(30_000),
    })

    const audioBytes = Buffer.from(speech.audio.uint8Array)

    return new Response(audioBytes, {
      status: 200,
      headers: {
        "Content-Type": speech.audio.mediaType ?? "audio/mpeg",
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("Speech generation failed:", error)
    return NextResponse.json(
      { error: "Failed to generate speech. Try again in a moment." },
      { status: 500 },
    )
  }
}
