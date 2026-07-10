import { APICallError, NoTranscriptGeneratedError } from "ai"
import { NextResponse } from "next/server"

import { enforceRateLimit } from "@/lib/server/rate-limit"
import { isAudioConfigured } from "@/lib/server-env"
import { transcribeAudioBuffer } from "@/lib/transcribe-audio"

export const runtime = "nodejs"

const MAX_AUDIO_BYTES = 25 * 1024 * 1024

const getTranscriptionErrorMessage = (error: unknown) => {
  if (NoTranscriptGeneratedError.isInstance(error)) {
    return "Could not detect speech in the recording."
  }

  if (APICallError.isInstance(error)) {
    const apiError = error

    if (apiError.statusCode === 401) {
      return "AI Gateway authentication failed. Check the server credentials."
    }

    if (apiError.statusCode === 429) {
      return "AI Gateway rate limit reached. Try again in a moment."
    }

    if (apiError.message) {
      return apiError.message
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return "Failed to transcribe audio. Try again or type the grunt manually."
}

export async function POST(request: Request) {
  const rateLimited = await enforceRateLimit(request, {
    routeName: "transcribe",
    limit: 20,
    windowSeconds: 60,
  })

  if (rateLimited) {
    return rateLimited
  }

  if (!isAudioConfigured()) {
    return NextResponse.json(
      {
        error:
          "Voice transcription is not configured. Set up AI Gateway authentication on the server.",
      },
      { status: 503 }
    )
  }

  try {
    const formData = await request.formData()
    const audio = formData.get("audio")

    if (!(audio instanceof Blob)) {
      return NextResponse.json(
        {
          error:
            "Missing audio file. Send multipart form data with an 'audio' field.",
        },
        { status: 400 }
      )
    }

    if (audio.size === 0) {
      return NextResponse.json(
        { error: "Audio file is empty." },
        { status: 400 }
      )
    }

    if (audio.size > MAX_AUDIO_BYTES) {
      return NextResponse.json(
        { error: "Audio file is too large. Maximum size is 25 MB." },
        { status: 413 }
      )
    }

    const audioBuffer = new Uint8Array(await audio.arrayBuffer())
    const transcript = await transcribeAudioBuffer(audioBuffer)

    return NextResponse.json({
      text: transcript.text,
      language: transcript.language,
      durationInSeconds: transcript.durationInSeconds,
    })
  } catch (error) {
    console.error("Transcription failed:", error)

    const message = getTranscriptionErrorMessage(error)
    const status = NoTranscriptGeneratedError.isInstance(error) ? 422 : 500

    return NextResponse.json({ error: message }, { status })
  }
}
