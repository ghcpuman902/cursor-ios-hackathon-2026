import { z } from "zod"

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("Male Translator™"),
  NEXT_PUBLIC_APP_TAGLINE: z
    .string()
    .default("Decoding grunts, shrugs, and three-word texts since forever"),
  /** 1 = gentle, 10 = brutally honest. Default: 7 (honest but survivable) */
  NEXT_PUBLIC_SARCASM_LEVEL: z.coerce.number().min(1).max(10).default(7),
  /** When true, adds optional grunt annotations to translations */
  NEXT_PUBLIC_GRUNT_MODE: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
  /** How long the fake "consulting council" loading state lasts (ms) */
  NEXT_PUBLIC_TRANSLATION_DELAY_MS: z.coerce.number().min(0).max(5000).default(800),
})

export const env = envSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_TAGLINE: process.env.NEXT_PUBLIC_APP_TAGLINE,
  NEXT_PUBLIC_SARCASM_LEVEL: process.env.NEXT_PUBLIC_SARCASM_LEVEL,
  NEXT_PUBLIC_GRUNT_MODE: process.env.NEXT_PUBLIC_GRUNT_MODE,
  NEXT_PUBLIC_TRANSLATION_DELAY_MS: process.env.NEXT_PUBLIC_TRANSLATION_DELAY_MS,
})
