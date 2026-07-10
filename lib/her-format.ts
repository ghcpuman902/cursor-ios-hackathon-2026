import type { RiskLevel } from "@/lib/translation-types"

export const HER_RISK_LABELS: Record<RiskLevel, string> = {
  low: "🟢 soft — you're probably overreading",
  medium: "🟡 medium — one gentle question max",
  high: "🔴 pause — don't send the spicy paragraph",
}

const stripSoftPrefix = (text: string): string =>
  text
    .replace(/^soft check:\s*/i, "")
    .replace(/^the cards lean literal:\s*/i, "")
    .replace(/^the stars suggest\s*/i, "")
    .trim()

export const formatHerTimeSensitive = (text: string): string => {
  const cleaned = stripSoftPrefix(text.trim())
  if (!cleaned) return cleaned
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
}

export type HerAdviceFields = {
  alert: string
  theRead: string
  tryThis: string
  softLanding: string
}

/**
 * Male → female card: one validating read, one reply, one soft landing.
 * Style serves "it gets me" — not a second essay of metaphors.
 */
export const toHerAdviceFields = (params: {
  riskLevel: RiskLevel
  possibleActualMeaning: string
  lowestRiskReply: string
  tinyWholesomeNudge: string
}): HerAdviceFields => ({
  alert: HER_RISK_LABELS[params.riskLevel],
  theRead: params.possibleActualMeaning.trim(),
  tryThis: params.lowestRiskReply.trim(),
  softLanding: params.tinyWholesomeNudge.trim(),
})
