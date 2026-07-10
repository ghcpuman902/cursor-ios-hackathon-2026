import { generateText } from "ai"

import { getTextModel } from "@/lib/ai"
import {
  buildFootnotePrompt,
  genderToDirection,
} from "@/lib/translate-prompts"
import type { TranslationResult, TranslatorGender } from "@/lib/translator"

type EnhancementContext = {
  conversationSummary?: string
  screenshotOwnerMessages?: string[]
  longInput?: string
}

/**
 * Adds a short AI footnote without replacing dictionary fields.
 * Prefer `runTranslatePipeline` for new adaptive flows.
 */
export const enhanceTranslation = async (
  baseline: TranslationResult,
  gender: TranslatorGender,
  sarcasmLevel: number,
  context?: EnhancementContext
): Promise<TranslationResult> => {
  const direction = genderToDirection(gender)
  const memeIntensity =
    sarcasmLevel >= 9 ? "nuclear" : sarcasmLevel >= 7 ? "spicy" : "playful"

  const result = await generateText({
    model: getTextModel(),
    instructions: buildFootnotePrompt({ direction, memeIntensity }),
    prompt: JSON.stringify({
      originalInput: baseline.input,
      direction: baseline.direction,
      dictionaryAnalytics: {
        headline: baseline.headline,
        comicTranslation: baseline.comicTranslation,
        possibleActualMeaning: baseline.possibleActualMeaning,
        riskLevel: baseline.riskLevel,
        lowestRiskReply: baseline.lowestRiskReply,
        tinyWholesomeNudge: baseline.tinyWholesomeNudge,
        matchedPattern: baseline.matchedPattern ?? null,
        isFallback: baseline.isFallback,
      },
      satireMode: gender,
      memeIntensity,
      context: context ?? null,
    }),
    maxOutputTokens: 400,
    abortSignal: AbortSignal.timeout(15_000),
    providerOptions: {
      gateway: {
        tags: ["feature:translation"],
      },
    },
  })

  const aiInsight = result.text.trim()

  if (!aiInsight) {
    return baseline
  }

  return {
    ...baseline,
    aiInsight,
  }
}
