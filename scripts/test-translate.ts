import { POST } from "../app/api/translate/route"
import {
  translateFemale,
  translateMale,
  type TranslationResult,
  type TranslatorGender,
} from "../lib/translator"

type TranslationResponse = Partial<TranslationResult> & {
  error?: string
}

type PromptCase = {
  input: string
  gender: TranslatorGender
  sarcasmLevel: number
}

const PROMPT_CASES: PromptCase[] = [
  { input: "k", gender: "male", sarcasmLevel: 7 },
  {
    input: "I'm almost there",
    gender: "male",
    sarcasmLevel: 9,
  },
  {
    input: "We need to talk",
    gender: "female",
    sarcasmLevel: 7,
  },
  {
    input: "Per my last email",
    gender: "female",
    sarcasmLevel: 9,
  },
]

const createTranslationRequest = ({
  input,
  gender,
  sarcasmLevel,
}: PromptCase) =>
  new Request("http://localhost/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input,
      gender,
      sarcasmLevel,
      gruntMode: false,
    }),
  })

const requestTranslation = async (
  promptCase: PromptCase
): Promise<TranslationResult> => {
  const response = await POST(createTranslationRequest(promptCase))
  const body = (await response.json()) as TranslationResponse

  if (!response.ok) {
    throw new Error(
      body.error ?? `Translation route returned ${response.status}`
    )
  }

  if (!body.translation) {
    throw new Error("Translation route returned no translation")
  }

  return body as TranslationResult
}

const main = async () => {
  const previousApiKey = process.env.AI_GATEWAY_API_KEY
  const previousOidcToken = process.env.VERCEL_OIDC_TOKEN

  delete process.env.AI_GATEWAY_API_KEY
  delete process.env.VERCEL_OIDC_TOKEN

  const dictionaryResult = await requestTranslation(PROMPT_CASES[0]!)

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

  for (const promptCase of PROMPT_CASES) {
    const baseline =
      promptCase.gender === "female"
        ? translateFemale(promptCase.input, {
            sarcasmLevel: promptCase.sarcasmLevel,
            gruntMode: false,
          })
        : translateMale(promptCase.input, {
            sarcasmLevel: promptCase.sarcasmLevel,
            gruntMode: false,
          })
    const generatedResult = await requestTranslation(promptCase)

    if (generatedResult.source !== "ai") {
      throw new Error(
        `Gateway text generation fell back for "${promptCase.input}"`
      )
    }

    if (
      generatedResult.category !== baseline.category ||
      generatedResult.confidence !== baseline.confidence ||
      generatedResult.matchedPattern !== baseline.matchedPattern
    ) {
      throw new Error(
        `AI enhancement changed dictionary analytics for "${promptCase.input}"`
      )
    }

    console.log(
      `✓ ${promptCase.gender} "${promptCase.input}" → ${generatedResult.translation}`
    )
  }

  console.log("✓ Live AI Gateway prompt matrix preserved dictionary analytics")
}

main().catch((error) => {
  console.error("AI Gateway text test failed:", error)
  process.exitCode = 1
})
