import { POST } from "../app/api/translate/route"

type TranslationResponse = {
  translation?: string
  source?: "dictionary" | "ai"
  error?: string
}

const createTranslationRequest = () =>
  new Request("http://localhost/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: "k",
      sarcasmLevel: 7,
      gruntMode: false,
    }),
  })

const requestTranslation = async (): Promise<TranslationResponse> => {
  const response = await POST(createTranslationRequest())
  const body = (await response.json()) as TranslationResponse

  if (!response.ok) {
    throw new Error(
      body.error ?? `Translation route returned ${response.status}`
    )
  }

  if (!body.translation) {
    throw new Error("Translation route returned no translation")
  }

  return body
}

const main = async () => {
  const previousApiKey = process.env.AI_GATEWAY_API_KEY
  const previousOidcToken = process.env.VERCEL_OIDC_TOKEN

  delete process.env.AI_GATEWAY_API_KEY
  delete process.env.VERCEL_OIDC_TOKEN

  const dictionaryResult = await requestTranslation()

  if (dictionaryResult.source !== "dictionary") {
    throw new Error(
      "Expected dictionary fallback without Gateway authentication"
    )
  }

  console.log(
    "✓ Translation route uses dictionary fallback without Gateway auth"
  )

  if (previousApiKey) {
    process.env.AI_GATEWAY_API_KEY = previousApiKey
  }

  if (previousOidcToken) {
    process.env.VERCEL_OIDC_TOKEN = previousOidcToken
  }

  if (!previousApiKey && !previousOidcToken) {
    console.log(
      "⊘ Skipping live text generation — set AI_GATEWAY_API_KEY to run it"
    )
    return
  }

  const generatedResult = await requestTranslation()

  if (generatedResult.source !== "ai") {
    throw new Error("Gateway text generation fell back to the dictionary")
  }

  console.log("✓ Live AI Gateway text generation succeeded")
  console.log(`  translation: ${generatedResult.translation}`)
}

main().catch((error) => {
  console.error("AI Gateway text test failed:", error)
  process.exitCode = 1
})
