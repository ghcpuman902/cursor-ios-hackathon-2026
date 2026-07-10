import { POST } from "../app/api/translate/route"
import {
  buildDictionaryAiPayload,
  toDictionaryContext,
} from "../lib/dictionary-context"
import {
  classifyInput,
  extractPhraseHeuristic,
  resolvePipelineMode,
} from "../lib/input-classifier"
import { runTranslatePipeline } from "../lib/translate-pipeline"
import {
  aiFailureFallback,
  buildFootnotePrompt,
  buildLongAnalysisPrompt,
  buildPhraseExtractionPrompt,
  buildScreenshotExtractionPrompt,
  buildScreenshotNotesPrompt,
  DIRECTION_STYLE_GUIDES,
  memeIntensityFor,
  memeIntensityGuide,
} from "../lib/translate-prompts"
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

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message)
}

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

const assertPrimaryFieldsUnchanged = (
  baseline: TranslationResult,
  enhanced: TranslationResult,
  label: string
) => {
  assert(
    enhanced.headline === baseline.headline &&
      enhanced.comicTranslation === baseline.comicTranslation &&
      enhanced.translation === baseline.translation &&
      enhanced.possibleActualMeaning === baseline.possibleActualMeaning &&
      enhanced.riskLevel === baseline.riskLevel &&
      enhanced.lowestRiskReply === baseline.lowestRiskReply &&
      enhanced.tinyWholesomeNudge === baseline.tinyWholesomeNudge &&
      enhanced.matchedPattern === baseline.matchedPattern &&
      enhanced.isFallback === baseline.isFallback &&
      enhanced.category === baseline.category &&
      enhanced.confidence === baseline.confidence,
    `AI enhancement changed primary dictionary fields for "${label}"`
  )
}

const assertClassifier = () => {
  assert(classifyInput("k") === "short", 'Expected "k" to classify as short')
  assert(
    resolvePipelineMode("I'm fine") === "short_translation",
    "Expected short phrase to use short_translation mode"
  )
  assert(
    classifyInput(LONG_RANT) === "long",
    "Expected rant to classify as long"
  )

  const phrase = extractPhraseHeuristic(LONG_RANT)
  assert(
    phrase.toLowerCase().includes("fine"),
    `Expected heuristic to prefer quoted phrase, got: ${phrase}`
  )

  console.log("✓ Input classifier short/long heuristics")
}

const assertDictionaryContextContract = () => {
  const male = translateMale("k", { sarcasmLevel: 7, gruntMode: false })
  const dictionary = toDictionaryContext(male)
  const payload = buildDictionaryAiPayload({
    dictionary,
    direction: "male_to_female",
    extra: { originalInput: "k" },
  })

  assert(
    payload.dictionaryResult.headline === male.headline &&
      payload.dictionaryResult.comicTranslation === male.comicTranslation &&
      payload.dictionaryResult.possibleActualMeaning ===
        male.possibleActualMeaning &&
      payload.dictionaryResult.riskLevel === male.riskLevel &&
      payload.dictionaryResult.lowestRiskReply === male.lowestRiskReply &&
      payload.dictionaryResult.tinyWholesomeNudge === male.tinyWholesomeNudge &&
      payload.dictionaryResult.matchedPattern === male.matchedPattern &&
      payload.dictionaryResult.isFallback === male.isFallback,
    "AI payload must include the exact dictionary result object"
  )

  assert(!male.isFallback, "Expected 'k' to be a non-fallback dictionary hit")
  assert(
    buildFootnotePrompt({
      direction: "male_to_female",
      memeIntensity: "spicy",
    }).includes("If isFallback is false"),
    "Footnote prompt must treat non-fallback dictionary as authoritative"
  )
  assert(
    buildFootnotePrompt({
      direction: "male_to_female",
      memeIntensity: "spicy",
    }).includes("If isFallback is true"),
    "Footnote prompt must allow hedged broader reading for fallbacks"
  )

  const fallback = translateMale(
    "zzzz this is definitely not in the dictionary xyzzy",
    { sarcasmLevel: 5, gruntMode: false }
  )
  assert(fallback.isFallback, "Expected unknown phrase to be fallback")

  console.log("✓ Dictionary context included in every AI payload builder")
}

const assertPromptArchitecture = () => {
  const maleFootnote = buildFootnotePrompt({
    direction: "male_to_female",
    memeIntensity: "playful",
  })
  const femaleFootnote = buildFootnotePrompt({
    direction: "female_to_male",
    memeIntensity: "nuclear",
  })
  const longAnalysis = buildLongAnalysisPrompt({
    direction: "female_to_male",
  })
  const phraseExtraction = buildPhraseExtractionPrompt({
    direction: "male_to_female",
  })
  const screenshotExtraction = buildScreenshotExtractionPrompt()
  const screenshotNotes = buildScreenshotNotesPrompt({
    direction: "male_to_female",
    memeIntensity: "spicy",
  })

  assert(
    DIRECTION_STYLE_GUIDES.male_to_female.includes("astrology"),
    "male_to_female must use astrology-style rhetoric"
  )
  assert(
    DIRECTION_STYLE_GUIDES.male_to_female.includes("Never use gaming"),
    "male_to_female must avoid gaming language"
  )
  assert(
    DIRECTION_STYLE_GUIDES.female_to_male.includes("gaming"),
    "female_to_male must use game/meme rhetoric"
  )
  assert(
    DIRECTION_STYLE_GUIDES.female_to_male.includes("Never use astrology"),
    "female_to_male must avoid astrology"
  )

  assert(
    maleFootnote.includes("alternate_reading") &&
      maleFootnote.includes("Do not rewrite") &&
      maleFootnote.includes("exhausted man"),
    "Footnote prompt must include structured role + consistency + few-shots"
  )
  assert(
    femaleFootnote.includes("Main quest still active"),
    "Footnote prompt must include good female_to_male example"
  )
  assert(
    femaleFootnote.includes("Bad generic therapy-style"),
    "Footnote prompt must include bad therapy-style counterexample"
  )
  assert(
    phraseExtraction.includes("direct quote") &&
      phraseExtraction.includes("Never extract the user's own complaint"),
    "Phrase extraction must use priority rules"
  )
  assert(
    longAnalysis.includes("dictionary result already translated") &&
      longAnalysis.includes("contextConflict"),
    "Long analysis must receive dictionary-first conflict contract"
  )
  assert(
    screenshotExtraction.includes("faithful extraction") &&
      !screenshotExtraction.includes("into men") &&
      !screenshotExtraction.includes("into women"),
    "Screenshot extraction must be faithful and avoid into-men/women framing"
  )
  assert(
    screenshotNotes.includes("Male Translator style") &&
      screenshotNotes.includes("supports") &&
      screenshotNotes.includes("conflicts"),
    "Screenshot notes must support/conflict against dictionary"
  )

  const playful = memeIntensityGuide("playful")
  const nuclear = memeIntensityGuide("nuclear")
  assert(
    memeIntensityFor(5) === "playful" &&
      memeIntensityFor(7) === "spicy" &&
      memeIntensityFor(9) === "nuclear",
    "sarcasmLevel mapping for meme intensity"
  )
  assert(
    playful.includes("theatricality only") &&
      nuclear.includes("never certainty") &&
      nuclear.includes("avoid insults"),
    "Meme intensity must change style but not certainty or risk"
  )

  assert(
    aiFailureFallback("male_to_female").includes("Mercury") &&
      aiFailureFallback("female_to_male").includes("Side-quest"),
    "Direction-appropriate AI failure fallbacks"
  )

  console.log("✓ Prompt architecture: styles, few-shots, intensity, fallbacks")
}

const assertDictionaryBeforeAiOrder = async () => {
  const previousApiKey = process.env.AI_GATEWAY_API_KEY
  const previousOidcToken = process.env.VERCEL_OIDC_TOKEN
  delete process.env.AI_GATEWAY_API_KEY
  delete process.env.VERCEL_OIDC_TOKEN

  const shortBaseline = translateMale("k", {
    sarcasmLevel: 7,
    gruntMode: false,
  })
  const shortResult = await runTranslatePipeline({
    text: "k",
    direction: "male_to_female",
    sarcasmLevel: 7,
    gruntMode: false,
  })

  assertPrimaryFieldsUnchanged(shortBaseline, shortResult, "short k")
  assert(
    shortResult.source === "dictionary",
    "Expected dictionary source without Gateway"
  )
  assert(
    Boolean(shortResult.aiInsight?.trim()),
    "Without Gateway, a local supporting footnote must still follow the dictionary card"
  )
  assert(
    Boolean(
      shortResult.aiInsight?.includes("literal") ||
        shortResult.aiInsight?.includes("timing") ||
        shortResult.aiInsight?.includes("Side note") ||
        shortResult.aiInsight?.includes("Soft check") ||
        shortResult.aiInsight?.includes("Status check") ||
        shortResult.aiInsight?.includes("cards")
    ),
    "Local footnote should be on-brand supporting analysis"
  )

  const longResult = await runTranslatePipeline({
    text: LONG_RANT,
    direction: "female_to_male",
    sarcasmLevel: 7,
    gruntMode: false,
  })

  assert(
    longResult.mode === "long_context_translation",
    "Expected long_context_translation for rant input"
  )
  assert(
    Boolean(longResult.extractedPhrase?.trim()),
    "Expected extractedPhrase for long input"
  )
  assert(
    longResult.extractedPhrase !== LONG_RANT,
    "Long rant must not translate the whole transcription as the phrase"
  )

  const dictOfExtracted = translateFemale(longResult.extractedPhrase!, {
    sarcasmLevel: 7,
    gruntMode: false,
  })
  assert(
    longResult.comicTranslation === dictOfExtracted.comicTranslation &&
      longResult.headline === dictOfExtracted.headline &&
      longResult.riskLevel === dictOfExtracted.riskLevel &&
      longResult.possibleActualMeaning ===
        dictOfExtracted.possibleActualMeaning,
    "Long rant primary card must equal dictionary(extractedPhrase)"
  )

  if (previousApiKey) process.env.AI_GATEWAY_API_KEY = previousApiKey
  if (previousOidcToken) process.env.VERCEL_OIDC_TOKEN = previousOidcToken

  console.log("✓ Dictionary computed before AI; long rant extracts one phrase")
  console.log(`  extracted: "${longResult.extractedPhrase}"`)
}

const assertRouteDictionaryFallback = async () => {
  const previousApiKey = process.env.AI_GATEWAY_API_KEY
  const previousOidcToken = process.env.VERCEL_OIDC_TOKEN
  delete process.env.AI_GATEWAY_API_KEY
  delete process.env.VERCEL_OIDC_TOKEN

  const dictionaryResult = await requestTranslation(PROMPT_CASES[0]!)
  assert(
    dictionaryResult.source === "dictionary",
    "Expected dictionary fallback without Gateway authentication"
  )
  assert(
    dictionaryResult.mode === "short_translation",
    "Expected short_translation mode for short input"
  )
  assert(
    Boolean(dictionaryResult.comicTranslation),
    "AI failure / missing Gateway must still return complete dictionary translation"
  )

  if (previousApiKey) process.env.AI_GATEWAY_API_KEY = previousApiKey
  if (previousOidcToken) process.env.VERCEL_OIDC_TOKEN = previousOidcToken

  console.log(
    "✓ Translation route returns complete dictionary without Gateway auth"
  )
}

const assertLiveGateway = async () => {
  const previousApiKey = process.env.AI_GATEWAY_API_KEY
  const previousOidcToken = process.env.VERCEL_OIDC_TOKEN

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

    assertPrimaryFieldsUnchanged(baseline, generatedResult, promptCase.text)

    assert(
      Boolean(generatedResult.aiInsight?.trim()),
      `Gateway did not attach a supplemental AI note for "${promptCase.text}"`
    )

    if (generatedResult.aiEnhancement) {
      assert(
        generatedResult.aiEnhancement.text === generatedResult.aiInsight,
        "aiEnhancement.text must mirror aiInsight"
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

const main = async () => {
  assertClassifier()
  assertDictionaryContextContract()
  assertPromptArchitecture()
  await assertDictionaryBeforeAiOrder()
  await assertRouteDictionaryFallback()
  await assertLiveGateway()
}

main().catch((error) => {
  console.error("AI Gateway text test failed:", error)
  process.exitCode = 1
})
