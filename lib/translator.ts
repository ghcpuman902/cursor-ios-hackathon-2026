import {
  FALLBACK_ENTRIES,
  FEMALE_FALLBACK_ENTRIES,
  FEMALE_LOADING_MESSAGES,
  FEMALE_LONG_INPUT_ENTRIES,
  FEMALE_TRANSLATIONS,
  GRUNT_ANNOTATIONS,
  LOADING_MESSAGES,
  MALE_TRANSLATIONS,
} from "@/lib/translations"
import type { TranslationPipelineMode } from "@/lib/input-classifier"
import type {
  AiEnhancement,
  ContextRelationship,
} from "@/lib/dictionary-context"
import type {
  RiskLevel,
  TranslationCategory,
  TranslationDirection,
  TranslationEntry,
} from "@/lib/translation-types"

export type TranslatorGender = "male" | "female"

export type TranslationOptions = {
  sarcasmLevel: number
  gruntMode: boolean
  /** Optional context tags for light heuristics */
  contextTags?: string[]
}

export type { TranslationPipelineMode }

export type TranslationAnalysis = {
  whyThisPhrase?: string
  contextSignals?: string[]
  screenshotNotes?: string[]
  /** @deprecated Prefer extraStoryAdded */
  whatUserBrainAdded?: string[]
  extraStoryAdded?: string[]
  relationshipToDictionary?: ContextRelationship
  contextConflict?: boolean
  phraseSourceType?:
    | "direct_quote"
    | "paraphrase"
    | "pivotal_phrase"
    | "action"
    | "synthesised"
}

export type TranslationResult = {
  input: string
  direction: TranslationDirection
  /** Adaptive pipeline mode — short phrase vs long-context extract */
  mode: TranslationPipelineMode
  /** For long input: the phrase actually translated */
  extractedPhrase?: string
  headline: string
  /** Primary comic line (also mirrored on `translation` for older callers) */
  comicTranslation: string
  translation: string
  possibleActualMeaning: string
  riskLevel: RiskLevel
  lowestRiskReply: string
  tinyWholesomeNudge: string
  category: TranslationCategory | "mystery"
  /** Kept as playful fake certainty for UI continuity; prefer riskLevel */
  confidence: number
  matchedPattern?: string
  isFallback: boolean
  source: "dictionary" | "ai"
  /** Deterministic timing / hunger / lag warning — never AI-written */
  timingWarning?: string
  /** Why the timing bubble is showing (clock or message trigger) */
  timingFlag?: string
  /** Optional AI-written supplemental footnote text (mirrors aiEnhancement.text) */
  aiInsight?: string
  /** Structured short-input / footnote enhancement */
  aiEnhancement?: AiEnhancement
  /** Optional richer analysis for long / screenshot context */
  analysis?: TranslationAnalysis
}

type TranslationDictionary = {
  direction: TranslationDirection
  entries: readonly TranslationEntry[]
  fallbackEntries: readonly TranslationEntry[]
  emptyEntry: TranslationEntry
}

const normalizeInput = (text: string): string => {
  return text.trim().toLowerCase().replace(/\s+/g, " ")
}

const pickRandom = <T>(items: readonly T[]): T => {
  return items[Math.floor(Math.random() * items.length)]!
}

const countWords = (text: string): number => {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/**
 * Short patterns ("k", "lol", "ok") must not substring-match every sentence
 * that happens to contain those letters. Longer phrases still use includes().
 */
const matchesPattern = (normalized: string, pattern: string): boolean => {
  if (!pattern) return false
  if (normalized === pattern) return true
  if (pattern.length <= 3) {
    const token = escapeRegExp(pattern)
    return new RegExp(
      `(?:^|[\\s.,!?;:'"(\\-])${token}(?:$|[\\s.,!?;:'")\\-])`
    ).test(normalized)
  }
  return normalized.includes(pattern)
}

const FEMALE_LONG_INPUT_WORD_THRESHOLD = 12

const maybeAddMysticalSparkle = (text: string, gruntMode: boolean): string => {
  if (!gruntMode) return text
  return text + pickRandom(GRUNT_ANNOTATIONS)
}

const riskConfidence = (risk: RiskLevel, sarcasmLevel: number): number => {
  const base = risk === "low" ? 118 : risk === "medium" ? 142 : 168
  return base + Math.min(sarcasmLevel, 10)
}

const heuristicExtras = (
  input: string,
  tags: string[] | undefined,
  direction: TranslationDirection
): string[] => {
  const extras: string[] = []
  const normalized = normalizeInput(input)
  const wordCount = countWords(input)
  const tagSet = new Set((tags ?? []).map((t) => t.toLowerCase()))

  const foodish =
    tagSet.has("hungry") ||
    tagSet.has("pre_lunch") ||
    tagSet.has("pre_dinner") ||
    tagSet.has("late_night")

  if (foodish) {
    extras.push("Food may solve 40% of this plot.")
  }

  if (wordCount > 0 && wordCount <= 2) {
    extras.push("Do not infer full emotional novel from two characters.")
  }

  if (
    normalized.includes("what do you want me to do") ||
    normalized.includes("what do you want from me")
  ) {
    extras.push("Likely literal request for clear action.")
  }

  if (
    /\bfine\b/.test(normalized) ||
    /\bnothing\b/.test(normalized)
  ) {
    extras.push("Treat as unresolved until context confirms otherwise.")
  }

  if (/\bsorry\b/.test(normalized) && direction === "male_to_female") {
    extras.push("May be sincere but under-elaborated.")
  }

  if (wordCount >= 40) {
    extras.push("Recommend pause before replying.")
  }

  return extras
}

const applyHeuristics = (
  nudge: string,
  input: string,
  tags: string[] | undefined,
  direction: TranslationDirection
): string => {
  const extras = heuristicExtras(input, tags, direction)
  if (extras.length === 0) return nudge
  const unique = extras.filter((extra) => !nudge.includes(extra))
  if (unique.length === 0) return nudge
  return `${nudge} ${unique[0]}`
}

const entryToResult = (
  input: string,
  entry: TranslationEntry,
  options: TranslationOptions,
  direction: TranslationDirection,
  matchedPattern: string | undefined,
  isFallback: boolean
): TranslationResult => {
  const useSpicy =
    options.sarcasmLevel >= 8 && entry.spicyComicTranslation !== undefined
  const comicBase = useSpicy
    ? entry.spicyComicTranslation!
    : entry.comicTranslation
  const comicTranslation =
    direction === "male_to_female"
      ? maybeAddMysticalSparkle(comicBase, options.gruntMode)
      : comicBase

  const tinyWholesomeNudge = applyHeuristics(
    entry.tinyWholesomeNudge,
    input,
    options.contextTags,
    direction
  )

  return {
    input,
    direction,
    mode: "short_translation",
    headline: entry.headline,
    comicTranslation,
    translation: comicTranslation,
    possibleActualMeaning: entry.possibleActualMeaning,
    riskLevel: entry.riskLevel,
    lowestRiskReply: entry.lowestRiskReply,
    tinyWholesomeNudge,
    category: entry.category,
    confidence: riskConfidence(entry.riskLevel, options.sarcasmLevel),
    matchedPattern,
    isFallback,
    source: "dictionary",
  }
}

const translateFromDictionary = (
  input: string,
  options: TranslationOptions,
  dictionary: TranslationDictionary
): TranslationResult => {
  const normalized = normalizeInput(input)

  if (!normalized) {
    return entryToResult(
      input,
      dictionary.emptyEntry,
      options,
      dictionary.direction,
      undefined,
      true
    )
  }

  const match = dictionary.entries.find((entry) =>
    matchesPattern(normalized, entry.pattern.toLowerCase())
  )

  if (match) {
    return entryToResult(
      input,
      match,
      options,
      dictionary.direction,
      match.pattern,
      false
    )
  }

  return entryToResult(
    input,
    pickRandom(dictionary.fallbackEntries),
    options,
    dictionary.direction,
    undefined,
    true
  )
}

export const getRandomLoadingMessage = (): string => {
  return pickRandom(LOADING_MESSAGES)
}

export const getRandomFemaleLoadingMessage = (): string => {
  return pickRandom(FEMALE_LOADING_MESSAGES)
}

const MALE_EMPTY: TranslationEntry = {
  pattern: "",
  headline: "🤫 Silence Spread",
  comicTranslation:
    "… *[silence]* … He said nothing. This may also be a tiny omen.",
  possibleActualMeaning:
    "Silence can mean many soft things. Do not assume the worst novel.",
  riskLevel: "low",
  lowestRiskReply: "Hey — you still there?",
  tinyWholesomeNudge: "One gentle ping. Then wait.",
  category: "classic",
}

const FEMALE_EMPTY: TranslationEntry = {
  pattern: "",
  headline: "…",
  comicTranslation: "…",
  possibleActualMeaning: "Empty input. No quest yet.",
  riskLevel: "low",
  lowestRiskReply: "?",
  tinyWholesomeNudge: "Wait for a message before theorising.",
  category: "classic",
}

/** Explain what HE said to a female-coded receiver (astrology / tarot voice). */
export const translateMale = (
  input: string,
  options: TranslationOptions
): TranslationResult => {
  return translateFromDictionary(input, options, {
    direction: "male_to_female",
    entries: MALE_TRANSLATIONS,
    fallbackEntries: FALLBACK_ENTRIES,
    emptyEntry: MALE_EMPTY,
  })
}

/** Explain what SHE said to a male-coded receiver (quests / memes voice). */
export const translateFemale = (
  input: string,
  options: TranslationOptions
): TranslationResult => {
  const wordCount = countWords(input)
  const isLongInput = wordCount >= FEMALE_LONG_INPUT_WORD_THRESHOLD
  const fallbackPool = isLongInput
    ? FEMALE_LONG_INPUT_ENTRIES
    : FEMALE_FALLBACK_ENTRIES

  return translateFromDictionary(
    input,
    { ...options, gruntMode: false },
    {
      direction: "female_to_male",
      entries: FEMALE_TRANSLATIONS,
      fallbackEntries: fallbackPool,
      emptyEntry: FEMALE_EMPTY,
    }
  )
}

export type { TranslationDirection, RiskLevel }
