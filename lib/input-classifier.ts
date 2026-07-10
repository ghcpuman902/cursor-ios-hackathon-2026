export type InputLengthClass = "short" | "medium" | "long"

export type TranslationPipelineMode =
  | "short_translation"
  | "long_context_translation"

const SHORT_CHAR_LIMIT = 200
const LONG_CHAR_LIMIT = 300
const SHORT_SENTENCE_LIMIT = 2

const RANT_MARKERS = [
  "always",
  "never",
  "every time",
  "i just",
  "like why",
  "and then",
  "honestly",
  "i'm so",
  "im so",
  "can you believe",
  "what even",
  "for the record",
  "anyway",
  "basically",
]

const countSentences = (text: string): number => {
  const parts = text
    .split(/[.!?]+/)
    .map((part) => part.trim())
    .filter(Boolean)
  return parts.length
}

const looksLikeRant = (normalized: string): boolean => {
  const markerHits = RANT_MARKERS.filter((marker) =>
    normalized.includes(marker)
  ).length
  return markerHits >= 2 || (normalized.length > 180 && markerHits >= 1)
}

const looksLikeStoryContext = (normalized: string): boolean => {
  return (
    normalized.includes("because") ||
    normalized.includes("and then") ||
    normalized.includes("so he") ||
    normalized.includes("so she") ||
    normalized.includes("they said") ||
    normalized.includes("he said") ||
    normalized.includes("she said") ||
    normalized.includes("context:") ||
    normalized.includes("background:")
  )
}

/**
 * Lightweight length/context classifier for the adaptive translate pipeline.
 * Medium is treated as short unless it contains story/context cues.
 */
export const classifyInput = (text: string): InputLengthClass => {
  const trimmed = text.trim()
  if (!trimmed) return "short"

  const normalized = trimmed.toLowerCase().replace(/\s+/g, " ")
  const charCount = normalized.length
  const sentenceCount = countSentences(trimmed)

  if (charCount > LONG_CHAR_LIMIT || looksLikeRant(normalized)) {
    return "long"
  }

  if (charCount <= SHORT_CHAR_LIMIT && sentenceCount <= SHORT_SENTENCE_LIMIT) {
    return "short"
  }

  if (looksLikeStoryContext(normalized) || sentenceCount >= 4) {
    return "long"
  }

  return "medium"
}

export const resolvePipelineMode = (
  text: string
): TranslationPipelineMode => {
  const classification = classifyInput(text)
  return classification === "long"
    ? "long_context_translation"
    : "short_translation"
}

/**
 * Heuristic phrase extraction when AI is unavailable.
 * Prefers quoted text, then the last short sentence, then a truncated head.
 */
export const extractPhraseHeuristic = (text: string): string => {
  const trimmed = text.trim()
  if (!trimmed) return ""

  const quoted = trimmed.match(/["“]([^"”]{2,120})["”]/)
  if (quoted?.[1]) {
    return quoted[1].trim()
  }

  const sentences = trimmed
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean)

  const shortCandidate = [...sentences]
    .reverse()
    .find((sentence) => sentence.length <= 120 && sentence.split(/\s+/).length <= 18)

  if (shortCandidate) {
    return shortCandidate.replace(/^["“]|["”]$/g, "").trim()
  }

  if (trimmed.length <= 140) return trimmed
  return `${trimmed.slice(0, 137).trim()}…`
}
