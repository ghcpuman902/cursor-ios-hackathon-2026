import { POST } from "../app/api/translate/route"
import {
  classifyInput,
  extractPhraseHeuristic,
  resolvePipelineMode,
} from "../lib/input-classifier"
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
  text: string
  gender: TranslatorGender
  sarcasmLevel: number
}

const PROMPT_CASES: PromptCase[] = [
  { text: "k", gender: "male", sarcasmLevel: 7 },
  {
    text: "I'm almost there",
    gender: "male",
    sarcasmLevel: 9,
  },
  {
    text: "We need to talk",
    gender: "female",
    sarcasmLevel: 7,
  },
  {
    text: "Per my last email",
    gender: "female",
    sarcasmLevel: 9,
  },
]

const LONG_RANT =
  "Okay so honestly I just need to vent because every time this happens I spiral and then I start rewriting the whole relationship in my head and anyway they said \"I'm fine\" and now I cannot stop thinking about it."

const createTranslationRequest = ({
  text,
  gender,
  sarcasmLevel,
}: PromptCase) =>
  new Request("http://localhost/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      gender,
      sarcasmLevel,
      gruntMode: false,
      inputSource: "typed",
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

  if (!body.translation || !body.mode) {
    throw new Error("Translation route returned an incomplete payload")
  }

  return body as TranslationResult
}

const assertClassifier = () => {
  if (classifyInput("k") !== "short") {
    throw new Error('Expected "k" to classify as short')
  }

  if (resolvePipelineMode("I'm fine") !== "short_translation") {
    throw new Error("Expected short phrase to use short_translation mode")
  }

  if (classifyInput(LONG_RANT) !== "long") {
    throw new Error("Expected rant to classify as long")
  }

  const phrase = extractPhraseHeuristic(LONG_RANT)
  if (!phrase.toLowerCase().includes("fine")) {
    throw new Error(`Expected heuristic to prefer quoted phrase, got: ${phrase}`)
  }

  console.log("✓ Input classifier short/long heuristics")
}

const main = async () => {
  assertClassifier()

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

  if (dictionaryResult.mode !== "short_translation") {
    throw new Error("Expected short_translation mode for short input")
  }

  console.log(
    "✓ Translation route uses dictionary fallback without Gateway auth"
  )

  const longResult = await requestTranslation({
    text: LONG_RANT,
    gender: "female",
    sarcasmLevel: 7,
  })

  if (longResult.mode !== "long_context_translation") {
    throw new Error("Expected long_context_translation for rant input")
  }

  if (!longResult.extractedPhrase?.trim()) {
    throw new Error("Expected extractedPhrase for long input")
  }

  console.log(
    `✓ Long input extracted phrase: "${longResult.extractedPhrase}"`
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
        ? translateFemale(promptCase.text, {
            sarcasmLevel: promptCase.sarcasmLevel,
            gruntMode: false,
          })
        : translateMale(promptCase.text, {
            sarcasmLevel: promptCase.sarcasmLevel,
            gruntMode: false,
          })
    const generatedResult = await requestTranslation(promptCase)

    if (
      generatedResult.translation !== baseline.translation ||
      generatedResult.category !== baseline.category ||
      generatedResult.confidence !== baseline.confidence ||
      generatedResult.matchedPattern !== baseline.matchedPattern
    ) {
      throw new Error(
        `AI enhancement changed the primary dictionary reply for "${promptCase.text}"`
      )
    }

    if (!generatedResult.aiInsight?.trim()) {
      throw new Error(
        `Gateway did not attach a supplemental AI note for "${promptCase.text}"`
      )
    }

    console.log(`✓ ${promptCase.gender} "${promptCase.text}"`)
    console.log(`  dictionary: ${generatedResult.translation}`)
    console.log(`  ai analysis: ${generatedResult.aiInsight}`)
  }

  console.log(
    "✓ Live AI Gateway kept the dictionary reply primary and added AI analysis"
  )
}

main().catch((error) => {
  console.error("AI Gateway text test failed:", error)
  process.exitCode = 1
})
