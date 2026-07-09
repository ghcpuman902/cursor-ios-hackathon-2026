import { gateway } from "@ai-sdk/gateway"

import { getServerEnv } from "@/lib/server-env"

export const getTextModel = () => {
  const { AI_GATEWAY_TEXT_MODEL } = getServerEnv()

  return gateway.languageModel(AI_GATEWAY_TEXT_MODEL)
}

export const getTranscriptionModel = () => {
  const { AI_GATEWAY_TRANSCRIPTION_MODEL } = getServerEnv()

  return gateway.transcriptionModel(AI_GATEWAY_TRANSCRIPTION_MODEL)
}

export const getSpeechModel = () => {
  const { AI_GATEWAY_SPEECH_MODEL } = getServerEnv()

  return gateway.speechModel(AI_GATEWAY_SPEECH_MODEL)
}
