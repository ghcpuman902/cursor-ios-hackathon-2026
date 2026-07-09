import { generateSpeech } from "ai"
import { NextResponse } from "next/server"
import { z } from "zod"

import { getOpenAI } from "@/lib/ai"
import { getServerEnv, isAudioConfigured } from "@/lib/server-env"

export const runtime = "nodejs"

const speechRequestSchema = z.object({
  text: z.string().trim().min(1).max(1000),
})

export async function POST(request: Request) {
  if (!isAudioConfigured()) {
    return NextResponse.json(
      {
        error:
          "Speech playback is not configured. Set OPENAI_API_KEY on the server.",
      },
      { status: 503 },
    )
  }

  try {
    const body = speechRequestSchema.safeParse(await request.json())

    if (!body.success) {
      return NextResponse.json(
        { error: "Invalid request. Provide a non-empty 'text' field (max 1000 chars)." },
        { status: 400 },
      )
    }

    const { OPENAI_SPEECH_MODEL, OPENAI_SPEECH_VOICE } = getServerEnv()

    const speech = await generateSpeech({
      model: getOpenAI().speech(OPENAI_SPEECH_MODEL),
      text: body.data.text,
      voice: OPENAI_SPEECH_VOICE,
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
