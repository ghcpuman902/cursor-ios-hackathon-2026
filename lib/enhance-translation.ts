import { generateText, Output } from "ai"
import { z } from "zod"

import { getTextModel } from "@/lib/ai"
import {
  buildDictionaryAiPayload,
  toDictionaryContext,
  type AiEnhancement,
} from "@/lib/dictionary-context"
import {
  aiFailureFallback,
  buildFootnotePrompt,
  genderToDirection,
  memeIntensityFor,
} from "@/lib/translate-prompts"
import type { TranslationResult, TranslatorGender } from "@/lib/translator"

type EnhancementContext = {
  conversationSummary?: string
  screenshotOwnerMessages?: string[]
  longInput?: string
}

const footnoteSchema = z.object({
  type: z.enum([
    "alternate_reading",
    "timing_check",
    "hunger_or_tiredness",
    "overthinking_check",
    "tone_mismatch",
    "reply_timing",
    "screenshot_context",
  ]),
  text: z.string().trim().min(1).max(220),
  relationshipToDictionary: z.enum([
    "supports",
    "adds_context",
    "softens",
    "conflicts",
  ]),
  contextConflict: z.boolean(),
})

/**
 * Adds a short AI footnote without replacing dictionary fields.
 * Prefer `runTranslatePipeline` for new adaptive flows.
 * Requires the exact deterministic dictionary result as input.
 */
export const enhanceTranslation = async (
  baseline: TranslationResult,
  gender: TranslatorGender,
  sarcasmLevel: number,
  context?: EnhancementContext
): Promise<TranslationResult> => {
  const direction = genderToDirection(gender)
  const dictionary = toDictionaryContext(baseline)

  try {
    const result = await generateText({
      model: getTextModel(),
      output: Output.object({ schema: footnoteSchema }),
      instructions: buildFootnotePrompt({
        direction,
        memeIntensity: memeIntensityFor(sarcasmLevel),
      }),
      prompt: JSON.stringify(
        buildDictionaryAiPayload({
          dictionary,
          direction,
          extra: {
            originalInput: baseline.input,
            satireMode: gender,
            context: context ?? null,
          },
        })
      ),
      maxOutputTokens: 400,
      abortSignal: AbortSignal.timeout(15_000),
      providerOptions: {
        gateway: {
          tags: ["feature:translation"],
        },
      },
    })

    const aiEnhancement: AiEnhancement = result.output

    if (!aiEnhancement.text.trim()) {
      return {
        ...baseline,
        aiInsight: aiFailureFallback(direction),
      }
    }

    return {
      ...baseline,
      aiInsight: aiEnhancement.text,
      aiEnhancement,
    }
  } catch (error) {
    console.error("AI footnote enhancement failed:", error)
    return {
      ...baseline,
      aiInsight: aiFailureFallback(direction),
    }
  }
}
