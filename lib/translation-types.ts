export type TranslationCategory =
  | "texting"
  | "relationship"
  | "plans"
  | "apology"
  | "emotions"
  | "classic"

export type RiskLevel = "low" | "medium" | "high"

export type TranslationDirection = "male_to_female" | "female_to_male"

/**
 * Dictionary entry. Style belongs to the RECEIVER.
 * male_to_female → cosy astrology / tarot / soft weather
 * female_to_male → gaming / quests / memes / bro tips
 */
export type TranslationEntry = {
  /** Case-insensitive substring or exact match (short ≤3 chars = token match) */
  pattern: string
  headline: string
  comicTranslation: string
  /** Spicier comic line when sarcasm level >= 8 */
  spicyComicTranslation?: string
  possibleActualMeaning: string
  riskLevel: RiskLevel
  lowestRiskReply: string
  tinyWholesomeNudge: string
  category: TranslationCategory
}

export type MaleTranslation = TranslationEntry
export type FemaleTranslation = TranslationEntry

export const RISK_LABELS: Record<RiskLevel, string> = {
  low: "🟢 Low risk — probably overthinking",
  medium: "🟡 Medium — one gentle question max",
  high: "🔴 High — pause before the spicy paragraph",
}

export const RISK_ACTIONS: Record<RiskLevel, string> = {
  low: "Reply lightly",
  medium: "Ask one gentle question",
  high: "Pause, eat, sleep, or talk later",
}

export const CATEGORY_LABELS: Record<TranslationCategory, string> = {
  texting: "📱 Texting",
  relationship: "💔 Relationship",
  plans: "📅 Plans",
  apology: "🙏 Apology (alleged)",
  emotions: "🎭 Emotions (soft)",
  classic: "🏛️ Classic",
}
