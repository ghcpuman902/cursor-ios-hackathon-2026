import type {
  RiskLevel,
  TranslationDirection,
} from "@/lib/translation-types"

/**
 * Exact deterministic dictionary fields shown on the primary translation card.
 * Every AI prompt must receive this object as source of truth.
 */
export type DictionaryTranslationContext = {
  headline: string
  comicTranslation: string
  possibleActualMeaning: string
  riskLevel: RiskLevel
  lowestRiskReply: string
  tinyWholesomeNudge: string
  matchedPattern?: string
  isFallback: boolean
}

export type ContextRelationship =
  | "supports"
  | "adds_context"
  | "softens"
  | "conflicts"

export type AiEnhancementType =
  | "alternate_reading"
  | "timing_check"
  | "hunger_or_tiredness"
  | "overthinking_check"
  | "tone_mismatch"
  | "reply_timing"
  | "screenshot_context"

export type AiEnhancement = {
  type: AiEnhancementType
  text: string
  relationshipToDictionary: ContextRelationship
  contextConflict: boolean
}

export const toDictionaryContext = (
  result: DictionaryTranslationContext
): DictionaryTranslationContext => ({
  headline: result.headline,
  comicTranslation: result.comicTranslation,
  possibleActualMeaning: result.possibleActualMeaning,
  riskLevel: result.riskLevel,
  lowestRiskReply: result.lowestRiskReply,
  tinyWholesomeNudge: result.tinyWholesomeNudge,
  matchedPattern: result.matchedPattern,
  isFallback: result.isFallback,
})

export const DICTIONARY_CONSISTENCY_RULES = [
  "The dictionary result is the primary translation and will be shown to the user.",
  "Do not rewrite, paraphrase, summarise, or replace it.",
  "Do not generate another competing translation.",
  "Add only information that is compatible with it.",
  "If context supports it, reinforce it with one new angle.",
  "If context softens it, say so explicitly.",
  "If context materially conflicts with it, set contextConflict true and relationshipToDictionary to conflicts; never silently change the meaning.",
  "If isFallback is false, treat the dictionary result as authoritative for comic framing.",
  "If isFallback is true, broader interpretation is allowed, but must remain hedged.",
].join(" ")

/** Exact payload shape sent into AI prompts — always includes dictionaryResult. */
export const buildDictionaryAiPayload = (params: {
  dictionary: DictionaryTranslationContext
  direction: TranslationDirection
  extra?: Record<string, unknown>
}) => ({
  dictionaryResult: params.dictionary,
  direction: params.direction,
  ...params.extra,
})
