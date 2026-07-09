import {
  FALLBACK_TRANSLATIONS,
  FEMALE_FALLBACK_TRANSLATIONS,
  FEMALE_LOADING_MESSAGES,
  FEMALE_LONG_INPUT_TRANSLATIONS,
  FEMALE_TRANSLATIONS,
  GRUNT_ANNOTATIONS,
  LOADING_MESSAGES,
  MALE_TRANSLATIONS,
  type TranslationEntry,
  type TranslationCategory,
} from "@/lib/translations"

export type TranslatorGender = "male" | "female"

export type TranslationOptions = {
  sarcasmLevel: number
  gruntMode: boolean
}

export type TranslationResult = {
  input: string
  translation: string
  category: TranslationCategory | "mystery"
  confidence: number
  matchedPattern?: string
  isFallback: boolean
  source: "dictionary" | "ai"
}

type TranslationDictionary = {
  entries: readonly TranslationEntry[]
  fallbackTranslations: readonly string[]
  emptyTranslation: string
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

/** She talked forever — decode to 1–3 words max */
const FEMALE_LONG_INPUT_WORD_THRESHOLD = 12

const maybeAddGrunt = (text: string, gruntMode: boolean): string => {
  if (!gruntMode) return text
  return text + pickRandom(GRUNT_ANNOTATIONS)
}

const translateFromDictionary = (
  input: string,
  options: TranslationOptions,
  dictionary: TranslationDictionary
): TranslationResult => {
  const normalized = normalizeInput(input)

  if (!normalized) {
    return {
      input,
      translation: dictionary.emptyTranslation,
      category: "mystery",
      confidence: 108,
      isFallback: true,
      source: "dictionary",
    }
  }

  const match = dictionary.entries.find((entry) => {
    const pattern = entry.pattern.toLowerCase()
    return normalized === pattern || normalized.includes(pattern)
  })

  if (match) {
    const useSpicy =
      options.sarcasmLevel >= 8 && match.spicyTranslation !== undefined
    const base = useSpicy ? match.spicyTranslation! : match.translation
    const confidenceBoost = Math.min(options.sarcasmLevel * 2, 20)

    return {
      input,
      translation: maybeAddGrunt(base, options.gruntMode),
      category: match.category,
      confidence: match.confidence + confidenceBoost,
      matchedPattern: match.pattern,
      isFallback: false,
      source: "dictionary",
    }
  }

  return {
    input,
    translation: maybeAddGrunt(
      pickRandom(dictionary.fallbackTranslations),
      options.gruntMode
    ),
    category: "mystery",
    confidence: 101 + options.sarcasmLevel,
    isFallback: true,
    source: "dictionary",
  }
}

export const getRandomLoadingMessage = (): string => {
  return pickRandom(LOADING_MESSAGES)
}

export const getRandomFemaleLoadingMessage = (): string => {
  return pickRandom(FEMALE_LOADING_MESSAGES)
}

export const translateMale = (
  input: string,
  options: TranslationOptions
): TranslationResult => {
  return translateFromDictionary(input, options, {
    entries: MALE_TRANSLATIONS,
    fallbackTranslations: FALLBACK_TRANSLATIONS,
    emptyTranslation:
      "… *[silence]* … (He said nothing. This is also a statement.)",
  })
}

export const translateFemale = (
  input: string,
  options: TranslationOptions
): TranslationResult => {
  const wordCount = countWords(input)
  const isLongInput = wordCount >= FEMALE_LONG_INPUT_WORD_THRESHOLD
  const fallbackPool = isLongInput
    ? FEMALE_LONG_INPUT_TRANSLATIONS
    : FEMALE_FALLBACK_TRANSLATIONS

  const result = translateFromDictionary(
    input,
    { ...options, gruntMode: false },
    {
      entries: FEMALE_TRANSLATIONS,
      fallbackTranslations: fallbackPool,
      emptyTranslation: "…",
    }
  )

  if (result.isFallback && isLongInput) {
    return {
      ...result,
      confidence: Math.min(220, 140 + Math.floor(wordCount / 3)),
    }
  }

  return result
}
