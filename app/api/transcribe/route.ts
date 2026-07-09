import { transcribe } from "ai"
import { NextResponse } from "next/server"

import { getOpenAI } from "@/lib/ai"
import { getServerEnv } from "@/lib/server-env"

export const runtime = "nodejs"

const MAX_AUDIO_BYTES = 25 * 1024 * 1024

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Voice transcription is not configured. Add OPENAI_API_KEY." },
        { status: 503 },
      )
    }

    const formData = await request.formData()
    const audio = formData.get("audio")

    if (!(audio instanceof Blob)) {
      return NextResponse.json(
        { error: "Missing audio file. Send multipart form data with an 'audio' field." },
        { status: 400 },
      )
    }

    if (audio.size === 0) {
      return NextResponse.json({ error: "Audio file is empty." }, { status: 400 })
    }

    if (audio.size > MAX_AUDIO_BYTES) {
      return NextResponse.json(
        { error: "Audio file is too large. Maximum size is 25 MB." },
        { status: 413 },
      )
    }

    const audioBuffer = Buffer.from(await audio.arrayBuffer())

    const transcript = await transcribe({
      model: getOpenAI().transcription(getServerEnv().OPENAI_TRANSCRIPTION_MODEL),
      audio: audioBuffer,
      abortSignal: AbortSignal.timeout(30_000),
    })

    const text = transcript.text.trim()

    if (!text) {
      return NextResponse.json(
        { error: "Could not detect speech in the recording." },
        { status: 422 },
      )
    }

    return NextResponse.json({
      text,
      language: transcript.language ?? null,
      durationInSeconds: transcript.durationInSeconds ?? null,
    })
  } catch (error) {
    console.error("Transcription failed:", error)
    return NextResponse.json(
      { error: "Failed to transcribe audio. Try again or type the grunt manually." },
      { status: 500 },
    )
  }
}
