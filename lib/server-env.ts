import { z } from "zod"

const serverEnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_TRANSCRIPTION_MODEL: z.string().default("whisper-1"),
  OPENAI_SPEECH_MODEL: z.string().default("tts-1"),
  OPENAI_SPEECH_VOICE: z.string().default("alloy"),
})

let cached: z.infer<typeof serverEnvSchema> | null = null

export function getServerEnv() {
  if (cached) return cached

  const parsed = serverEnvSchema.safeParse({
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_TRANSCRIPTION_MODEL: process.env.OPENAI_TRANSCRIPTION_MODEL,
    OPENAI_SPEECH_MODEL: process.env.OPENAI_SPEECH_MODEL,
    OPENAI_SPEECH_VOICE: process.env.OPENAI_SPEECH_VOICE,
  })

  if (!parsed.success) {
    throw new Error(
      "OPENAI_API_KEY is required for voice note transcription and playback.",
    )
  }

  cached = parsed.data
  return cached
}
