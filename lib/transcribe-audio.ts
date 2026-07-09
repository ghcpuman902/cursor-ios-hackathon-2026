import { detectMediaType } from "@ai-sdk/provider-utils"
import { NoTranscriptGeneratedError } from "ai"

import { getOpenAI } from "@/lib/ai"
import { getServerEnv } from "@/lib/server-env"

const WHISPER_SUPPORTED_TYPES = new Set([
  "audio/flac",
  "audio/m4a",
  "audio/mp3",
  "audio/mp4",
  "audio/mpeg",
  "audio/mpga",
  "audio/oga",
  "audio/ogg",
  "audio/wav",
  "audio/webm",
])

export const resolveAudioMediaType = (
  declaredType: string | undefined,
  audio: Uint8Array,
) => {
  const detected = detectMediaType({
    data: audio,
    topLevelType: "audio",
  })

  if (detected) {
    return detected
  }

  const normalizedDeclaredType = declaredType?.split(";")[0]?.trim()

  if (
    normalizedDeclaredType &&
    WHISPER_SUPPORTED_TYPES.has(normalizedDeclaredType)
  ) {
    return normalizedDeclaredType
  }

  return "audio/webm"
}

export type TranscribedAudio = {
  text: string
  language: string | null
  durationInSeconds: number | null
}

export const transcribeAudioBuffer = async (
  audio: Uint8Array,
  declaredMediaType?: string,
): Promise<TranscribedAudio> => {
  const { OPENAI_TRANSCRIPTION_MODEL } = getServerEnv()
  const mediaType = resolveAudioMediaType(declaredMediaType, audio)

  const result = await getOpenAI().transcription(OPENAI_TRANSCRIPTION_MODEL).doGenerate({
    audio,
    mediaType,
    abortSignal: AbortSignal.timeout(30_000),
  })

  const text = result.text?.trim()

  if (!text) {
    throw new NoTranscriptGeneratedError({ responses: [result.response] })
  }

  return {
    text,
    language: result.language ?? null,
    durationInSeconds: result.durationInSeconds ?? null,
  }
}
