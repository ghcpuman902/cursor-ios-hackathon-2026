import { NoTranscriptGeneratedError, transcribe } from "ai"

import { getTranscriptionModel } from "@/lib/ai"

export type TranscribedAudio = {
  text: string
  language: string | null
  durationInSeconds: number | null
}

export const transcribeAudioBuffer = async (
  audio: Uint8Array
): Promise<TranscribedAudio> => {
  const result = await transcribe({
    model: getTranscriptionModel(),
    audio,
    abortSignal: AbortSignal.timeout(30_000),
  })

  const text = result.text?.trim()

  if (!text) {
    throw new NoTranscriptGeneratedError({ responses: result.responses })
  }

  return {
    text,
    language: result.language ?? null,
    durationInSeconds: result.durationInSeconds ?? null,
  }
}
