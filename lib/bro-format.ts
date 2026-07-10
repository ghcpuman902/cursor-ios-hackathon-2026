import type { AiEnhancementType } from "@/lib/dictionary-context"
import type { RiskLevel } from "@/lib/translation-types"

export const BRO_RISK_LABELS: Record<RiskLevel, string> = {
  low: "🟢 low — you're probably overthinking",
  medium: "🟡 medium — one chill question max",
  high: "🔴 high — don't freestyle this one",
}

const TIME_SENSITIVE_TYPES = new Set<AiEnhancementType>([
  "timing_check",
  "hunger_or_tiredness",
  "reply_timing",
])

export const isTimeSensitiveEnhancement = (
  type: AiEnhancementType | undefined
): boolean => (type ? TIME_SENSITIVE_TYPES.has(type) : false)

const toBroCase = (text: string): string => {
  const trimmed = text.trim()
  if (!trimmed) return trimmed
  return trimmed.charAt(0).toLowerCase() + trimmed.slice(1)
}

const stripFormalPrefix = (text: string): string =>
  text
    .replace(/^side note:\s*/i, "")
    .replace(/^status check:\s*/i, "")
    .trim()

export const formatBroTimeSensitive = (text: string): string =>
  toBroCase(stripFormalPrefix(text))

export type BroAdviceFields = {
  alert: string
  realTalk: string
  sendThis: string
  chillMove: string
}

export const toBroAdviceFields = (params: {
  riskLevel: RiskLevel
  possibleActualMeaning: string
  lowestRiskReply: string
  tinyWholesomeNudge: string
}): BroAdviceFields => ({
  alert: BRO_RISK_LABELS[params.riskLevel],
  realTalk: toBroCase(params.possibleActualMeaning),
  sendThis: params.lowestRiskReply,
  chillMove: toBroCase(params.tinyWholesomeNudge),
})
