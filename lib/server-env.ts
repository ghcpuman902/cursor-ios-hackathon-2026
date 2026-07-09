import { z } from "zod"

const serverEnvSchema = z
  .object({
    AI_GATEWAY_API_KEY: z.string().min(1).optional(),
    VERCEL_OIDC_TOKEN: z.string().min(1).optional(),
    AI_GATEWAY_TRANSCRIPTION_MODEL: z.string().default("openai/whisper-1"),
    AI_GATEWAY_SPEECH_MODEL: z.string().default("openai/tts-1"),
    AI_GATEWAY_SPEECH_VOICE: z.string().default("alloy"),
  })
  .refine(
    ({ AI_GATEWAY_API_KEY, VERCEL_OIDC_TOKEN }) =>
      Boolean(AI_GATEWAY_API_KEY || VERCEL_OIDC_TOKEN),
    {
      message:
        "AI Gateway authentication requires AI_GATEWAY_API_KEY or VERCEL_OIDC_TOKEN",
    }
  )

export type ServerEnv = z.infer<typeof serverEnvSchema>

const readServerEnvInput = () => ({
  AI_GATEWAY_API_KEY: process.env.AI_GATEWAY_API_KEY,
  VERCEL_OIDC_TOKEN: process.env.VERCEL_OIDC_TOKEN,
  AI_GATEWAY_TRANSCRIPTION_MODEL: process.env.AI_GATEWAY_TRANSCRIPTION_MODEL,
  AI_GATEWAY_SPEECH_MODEL: process.env.AI_GATEWAY_SPEECH_MODEL,
  AI_GATEWAY_SPEECH_VOICE: process.env.AI_GATEWAY_SPEECH_VOICE,
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
