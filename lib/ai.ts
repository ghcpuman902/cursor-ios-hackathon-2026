import { createOpenAI } from "@ai-sdk/openai"

import { serverEnv } from "@/lib/server-env"

export const openai = createOpenAI({
  apiKey: serverEnv.OPENAI_API_KEY,
})
