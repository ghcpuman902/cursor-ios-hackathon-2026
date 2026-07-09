import { z } from "zod"

const serverEnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required for audio features"),
  OPENAI_TRANSCRIPTION_MODEL: z.string().default("whisper-1"),
  OPENAI_SPEECH_MODEL: z.string().default("tts-1"),
  OPENAI_SPEECH_VOICE: z.string().default("alloy"),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>

const readServerEnvInput = () => ({
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_TRANSCRIPTION_MODEL: process.env.OPENAI_TRANSCRIPTION_MODEL,
  OPENAI_SPEECH_MODEL: process.env.OPENAI_SPEECH_MODEL,
  OPENAI_SPEECH_VOICE: process.env.OPENAI_SPEECH_VOICE,
})

let cachedServerEnv: ServerEnv | null = null

export const isAudioConfigured = () =>
  serverEnvSchema.safeParse(readServerEnvInput()).success

export const getServerEnv = (): ServerEnv => {
  if (!cachedServerEnv) {
    cachedServerEnv = serverEnvSchema.parse(readServerEnvInput())
  }

  return cachedServerEnv
}
