import {
  FALLBACK_TRANSLATIONS,
  FEMALE_FALLBACK_TRANSLATIONS,
  FEMALE_LOADING_MESSAGES,
  FEMALE_TRANSLATIONS,
  GRUNT_ANNOTATIONS,
  LOADING_MESSAGES,
  MALE_TRANSLATIONS,
  type TranslationEntry,
  type TranslationCategory,
} from "@/lib/translations"

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
  return translateFromDictionary(input, options, {
    entries: FEMALE_TRANSLATIONS,
    fallbackTranslations: FEMALE_FALLBACK_TRANSLATIONS,
    emptyTranslation:
      "… *[silence]* … (She said nothing. Ask whether she wants to talk.)",
  })
}
