import {
  FALLBACK_TRANSLATIONS,
  GRUNT_ANNOTATIONS,
  LOADING_MESSAGES,
  MALE_TRANSLATIONS,
  type TranslationCategory,
} from "@/lib/translations"

export type TranslationResult = {
  input: string
  translation: string
  category: TranslationCategory | "mystery"
  confidence: number
  matchedPattern?: string
  isFallback: boolean
}

function normalizeInput(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ")
}

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!
}

function maybeAddGrunt(text: string, gruntMode: boolean): string {
  if (!gruntMode) return text
  return text + pickRandom(GRUNT_ANNOTATIONS)
}

export function getRandomLoadingMessage(): string {
  return pickRandom(LOADING_MESSAGES)
}

export function translateMale(
  input: string,
  options: { sarcasmLevel: number; gruntMode: boolean },
): TranslationResult {
  const normalized = normalizeInput(input)

  if (!normalized) {
    return {
      input,
      translation: "… *[silence]* … (He said nothing. This is also a statement.)",
      category: "mystery",
      confidence: 108,
      isFallback: true,
    }
  }

  const match = MALE_TRANSLATIONS.find((entry) => {
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
    translation: maybeAddGrunt(pickRandom(FALLBACK_TRANSLATIONS), options.gruntMode),
    category: "mystery",
    confidence: 101 + options.sarcasmLevel,
    isFallback: true,
  }
}
