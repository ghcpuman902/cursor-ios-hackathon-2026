import { createOpenAI } from "@ai-sdk/openai"

import { getServerEnv } from "@/lib/server-env"

export function getOpenAI() {
  return createOpenAI({
    apiKey: getServerEnv().OPENAI_API_KEY,
  })
}
