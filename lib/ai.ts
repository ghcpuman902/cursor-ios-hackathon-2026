import { createOpenAI, type OpenAIProvider } from "@ai-sdk/openai"

import { getServerEnv } from "@/lib/server-env"

let cachedOpenAI: OpenAIProvider | null = null

export const getOpenAI = (): OpenAIProvider => {
  if (!cachedOpenAI) {
    cachedOpenAI = createOpenAI({
      apiKey: getServerEnv().OPENAI_API_KEY,
    })
  }

  return cachedOpenAI
}
