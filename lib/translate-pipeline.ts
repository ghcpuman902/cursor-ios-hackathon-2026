import { generateText, Output } from "ai"
import { z } from "zod"

import { getTextModel } from "@/lib/ai"
import {
  extractPhraseHeuristic,
  resolvePipelineMode,
  type TranslationPipelineMode,
} from "@/lib/input-classifier"
import { deescalateRant } from "@/lib/rant"
import { isGatewayConfigured } from "@/lib/server-env"
import type { TranslationDirection } from "@/lib/translation-types"
import {
  buildFootnotePrompt,
  buildLongAnalysisPrompt,
  buildPhraseExtractionPrompt,
  buildScreenshotExtractionPrompt,
  buildScreenshotNotesPrompt,
  directionToGender,
  genderToDirection,
} from "@/lib/translate-prompts"
import {
  translateFemale,
  translateMale,
  type TranslationAnalysis,
  type TranslationResult,
  type TranslatorGender,
} from "@/lib/translator"

export type TranslateInputSource = "typed" | "voice" | "mixed"

export type TranslatePipelineRequest = {
  text?: string
  direction: TranslationDirection
  inputSource?: TranslateInputSource
  sarcasmLevel: number
  gruntMode: boolean
  image?: {
    bytes: Uint8Array
    mediaType: string
  }
}

const conversationSchema = z.object({
  otherPersonMessages: z
    .array(z.string().trim().min(1).max(500))
    .min(1)
    .max(30),
  screenshotOwnerMessages: z.array(z.string().trim().min(1).max(500)).max(30),
  conversationSummary: z.string().trim().min(1).max(500),
})

const phraseExtractionSchema = z.object({
  extractedPhrase: z.string().trim().min(1).max(200),
  whyThisPhrase: z.string().trim().min(1).max(220),
  contextSignals: z.array(z.string().trim().min(1).max(120)).max(5),
  whatUserBrainAdded: z.array(z.string().trim().min(1).max(120)).max(4),
})

const longAnalysisSchema = z.object({
  whyThisPhrase: z.string().trim().min(1).max(220),
  contextSignals: z.array(z.string().trim().min(1).max(120)).max(5),
  whatUserBrainAdded: z.array(z.string().trim().min(1).max(120)).max(4),
})

const screenshotNotesSchema = z.object({
  screenshotNotes: z.array(z.string().trim().min(1).max(140)).min(1).max(4),
})

const memeIntensityFor = (sarcasmLevel: number): string =>
  sarcasmLevel >= 9 ? "nuclear" : sarcasmLevel >= 7 ? "spicy" : "playful"

const dictionaryTranslate = (
  phrase: string,
  direction: TranslationDirection,
  sarcasmLevel: number,
  gruntMode: boolean
): TranslationResult => {
  const gender = directionToGender(direction)
  return gender === "female"
    ? translateFemale(phrase, { sarcasmLevel, gruntMode })
    : translateMale(phrase, { sarcasmLevel, gruntMode })
}

const withMode = (
  result: TranslationResult,
  mode: TranslationPipelineMode,
  extras?: {
    extractedPhrase?: string
    analysis?: TranslationAnalysis
    aiInsight?: string
    inputOverride?: string
  }
): TranslationResult => ({
  ...result,
  mode,
  input: extras?.inputOverride ?? result.input,
  extractedPhrase: extras?.extractedPhrase,
  analysis: extras?.analysis,
  aiInsight: extras?.aiInsight ?? result.aiInsight,
})

const localLongAnalysis = (
  vent: string,
  direction: TranslationDirection,
  extractedPhrase: string
): TranslationAnalysis => {
  const rant = deescalateRant({
    vent,
    originalMessage: extractedPhrase,
    direction,
  })

  return {
    whyThisPhrase: rant.whatHappened,
    contextSignals: rant.likelyNonSeriousExplanations.slice(0, 3),
    whatUserBrainAdded: [rant.whatYourBrainAdded],
  }
}

const extractConversationFromImage = async (params: {
  image: NonNullable<TranslatePipelineRequest["image"]>
  direction: TranslationDirection
}) => {
  const targetDescription =
    params.direction === "male_to_female" ? "men" : "women"

  const extraction = await generateText({
    model: getTextModel(),
    output: Output.object({ schema: conversationSchema }),
    instructions: buildScreenshotExtractionPrompt(),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze both sides. The screenshot owner says they are into ${targetDescription}; this describes the other participant and must not be inferred from names or appearance.`,
          },
          {
            type: "file",
            data: params.image.bytes,
            mediaType: params.image.mediaType,
          },
        ],
      },
    ],
    maxOutputTokens: 1_200,
    abortSignal: AbortSignal.timeout(30_000),
    providerOptions: {
      gateway: {
        tags: ["feature:screenshot-analysis"],
      },
    },
  })

  return extraction.output
}

const extractPhraseWithAi = async (params: {
  text: string
  direction: TranslationDirection
}) => {
  const result = await generateText({
    model: getTextModel(),
    output: Output.object({ schema: phraseExtractionSchema }),
    instructions: buildPhraseExtractionPrompt({
      direction: params.direction,
    }),
    prompt: JSON.stringify({
      longInput: params.text,
      direction: params.direction,
    }),
    maxOutputTokens: 600,
    abortSignal: AbortSignal.timeout(20_000),
    providerOptions: {
      gateway: {
        tags: ["feature:phrase-extraction"],
      },
    },
  })

  return result.output
}

const buildAiFootnote = async (params: {
  baseline: TranslationResult
  direction: TranslationDirection
  sarcasmLevel: number
  context?: {
    conversationSummary?: string
    screenshotOwnerMessages?: string[]
    longInput?: string
  }
}): Promise<string | undefined> => {
  const result = await generateText({
    model: getTextModel(),
    instructions: buildFootnotePrompt({
      direction: params.direction,
      memeIntensity: memeIntensityFor(params.sarcasmLevel),
    }),
    prompt: JSON.stringify({
      originalInput: params.baseline.input,
      direction: params.baseline.direction,
      dictionaryAnalytics: {
        headline: params.baseline.headline,
        comicTranslation: params.baseline.comicTranslation,
        possibleActualMeaning: params.baseline.possibleActualMeaning,
        riskLevel: params.baseline.riskLevel,
        lowestRiskReply: params.baseline.lowestRiskReply,
        tinyWholesomeNudge: params.baseline.tinyWholesomeNudge,
        matchedPattern: params.baseline.matchedPattern ?? null,
        isFallback: params.baseline.isFallback,
      },
      context: params.context ?? null,
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
  return aiInsight || undefined
}

const buildLongAnalysisWithAi = async (params: {
  text: string
  extractedPhrase: string
  direction: TranslationDirection
}): Promise<TranslationAnalysis> => {
  const result = await generateText({
    model: getTextModel(),
    output: Output.object({ schema: longAnalysisSchema }),
    instructions: buildLongAnalysisPrompt({ direction: params.direction }),
    prompt: JSON.stringify({
      longInput: params.text,
      extractedPhrase: params.extractedPhrase,
      direction: params.direction,
    }),
    maxOutputTokens: 700,
    abortSignal: AbortSignal.timeout(20_000),
    providerOptions: {
      gateway: {
        tags: ["feature:long-analysis"],
      },
    },
  })

  return result.output
}

const buildScreenshotNotesWithAi = async (params: {
  direction: TranslationDirection
  conversationSummary: string
  screenshotOwnerMessages: string[]
  translatedPhrase: string
}): Promise<string[]> => {
  const result = await generateText({
    model: getTextModel(),
    output: Output.object({ schema: screenshotNotesSchema }),
    instructions: buildScreenshotNotesPrompt({ direction: params.direction }),
    prompt: JSON.stringify({
      conversationSummary: params.conversationSummary,
      screenshotOwnerMessages: params.screenshotOwnerMessages,
      translatedPhrase: params.translatedPhrase,
      direction: params.direction,
    }),
    maxOutputTokens: 400,
    abortSignal: AbortSignal.timeout(15_000),
    providerOptions: {
      gateway: {
        tags: ["feature:screenshot-notes"],
      },
    },
  })

  return result.output.screenshotNotes
}

/**
 * Unified adaptive translate pipeline.
 * Always returns a translation card; long input extracts one phrase first.
 */
export const runTranslatePipeline = async (
  request: TranslatePipelineRequest
): Promise<TranslationResult> => {
  const { direction, sarcasmLevel, gruntMode, image } = request
  let text = request.text?.trim() ?? ""
  let conversationSummary: string | undefined
  let screenshotOwnerMessages: string[] | undefined

  if (image && isGatewayConfigured()) {
    try {
      const conversation = await extractConversationFromImage({
        image,
        direction,
      })
      conversationSummary = conversation.conversationSummary
      screenshotOwnerMessages = conversation.screenshotOwnerMessages

      if (!text) {
        text = conversation.otherPersonMessages.join("\n")
      }
    } catch (error) {
      console.error("Screenshot extraction failed:", error)
      if (!text) {
        throw new Error(
          "Could not read that conversation screenshot. Try another image."
        )
      }
    }
  } else if (image && !text) {
    throw new Error(
      "Screenshot analysis needs AI Gateway authentication, or add text to translate."
    )
  }

  if (!text) {
    throw new Error("Provide text, a voice transcription, or a screenshot.")
  }

  const mode = resolvePipelineMode(text)
  const gatewayReady = isGatewayConfigured()

  if (mode === "short_translation") {
    const baseline = dictionaryTranslate(
      text,
      direction,
      sarcasmLevel,
      gruntMode
    )
    let analysis: TranslationAnalysis | undefined
    let aiInsight: string | undefined

    if (gatewayReady) {
      try {
        aiInsight = await buildAiFootnote({
          baseline,
          direction,
          sarcasmLevel,
          context: {
            conversationSummary,
            screenshotOwnerMessages,
          },
        })
      } catch (error) {
        console.error("AI footnote failed:", error)
      }

      if (image && conversationSummary) {
        try {
          const screenshotNotes = await buildScreenshotNotesWithAi({
            direction,
            conversationSummary,
            screenshotOwnerMessages: screenshotOwnerMessages ?? [],
            translatedPhrase: text,
          })
          analysis = { screenshotNotes }
        } catch (error) {
          console.error("Screenshot notes failed:", error)
        }
      }
    }

    return withMode(baseline, "short_translation", {
      aiInsight,
      analysis,
      inputOverride: text,
    })
  }

  // Long-context path: extract one phrase, translate only that.
  let extractedPhrase = extractPhraseHeuristic(text)
  let analysis: TranslationAnalysis = localLongAnalysis(
    text,
    direction,
    extractedPhrase
  )

  if (gatewayReady) {
    try {
      const extracted = await extractPhraseWithAi({ text, direction })
      extractedPhrase = extracted.extractedPhrase
      analysis = {
        whyThisPhrase: extracted.whyThisPhrase,
        contextSignals: extracted.contextSignals,
        whatUserBrainAdded: extracted.whatUserBrainAdded,
      }
    } catch (error) {
      console.error("Phrase extraction failed:", error)
      try {
        analysis = await buildLongAnalysisWithAi({
          text,
          extractedPhrase,
          direction,
        })
      } catch (analysisError) {
        console.error("Long analysis failed:", analysisError)
      }
    }
  }

  if (image && conversationSummary && gatewayReady) {
    try {
      const screenshotNotes = await buildScreenshotNotesWithAi({
        direction,
        conversationSummary,
        screenshotOwnerMessages: screenshotOwnerMessages ?? [],
        translatedPhrase: extractedPhrase,
      })
      analysis = { ...analysis, screenshotNotes }
    } catch (error) {
      console.error("Screenshot notes failed:", error)
    }
  }

  const baseline = dictionaryTranslate(
    extractedPhrase,
    direction,
    sarcasmLevel,
    gruntMode
  )

  let aiInsight: string | undefined
  if (gatewayReady) {
    try {
      aiInsight = await buildAiFootnote({
        baseline,
        direction,
        sarcasmLevel,
        context: {
          conversationSummary,
          screenshotOwnerMessages,
          longInput: text,
        },
      })
    } catch (error) {
      console.error("AI footnote failed:", error)
    }
  }

  return withMode(baseline, "long_context_translation", {
    extractedPhrase,
    analysis,
    aiInsight,
    inputOverride: text,
  })
}

/** Convenience for callers still using gender naming. */
export const runTranslatePipelineForGender = async (
  request: Omit<TranslatePipelineRequest, "direction"> & {
    gender: TranslatorGender
  }
): Promise<TranslationResult> =>
  runTranslatePipeline({
    ...request,
    direction: genderToDirection(request.gender),
  })
