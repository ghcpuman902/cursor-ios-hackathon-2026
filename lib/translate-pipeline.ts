import { generateText, Output } from "ai"
import { z } from "zod"

import { getTextModel } from "@/lib/ai"
import {
  buildDictionaryAiPayload,
  toDictionaryContext,
  type AiEnhancement,
  type DictionaryTranslationContext,
} from "@/lib/dictionary-context"
import {
  extractPhraseHeuristic,
  resolvePipelineMode,
  type TranslationPipelineMode,
} from "@/lib/input-classifier"
import { deescalateRant } from "@/lib/rant"
import { isGatewayConfigured } from "@/lib/server-env"
import type { TranslationDirection } from "@/lib/translation-types"
import {
  aiFailureFallback,
  buildFootnotePrompt,
  buildLocalSupportingFootnote,
  buildLongAnalysisPrompt,
  buildPhraseExtractionPrompt,
  buildScreenshotExtractionPrompt,
  buildScreenshotNotesPrompt,
  directionToGender,
  genderToDirection,
  memeIntensityFor,
  screenshotStyleInstruction,
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

export type ScreenshotMessage = {
  speaker: "owner" | "other" | "unknown"
  text: string
  order: number
}

const screenshotExtractionSchema = z.object({
  messages: z
    .array(
      z.object({
        speaker: z.enum(["owner", "other", "unknown"]),
        text: z.string().trim().min(1).max(500),
        order: z.number().int().min(1).max(60),
      })
    )
    .min(1)
    .max(40),
})

const phraseExtractionSchema = z.object({
  phrase: z.string().trim().min(1).max(200),
  sourceType: z.enum([
    "direct_quote",
    "paraphrase",
    "pivotal_phrase",
    "action",
    "synthesised",
  ]),
  sourceExcerpt: z.string().trim().min(1).max(240).optional(),
  confidence: z.enum(["low", "medium", "high"]),
  contextSignals: z.array(z.string().trim().min(1).max(120)).max(5),
  extraStoryAdded: z.array(z.string().trim().min(1).max(120)).max(4).optional(),
})

const longAnalysisSchema = z.object({
  whyThisPhrase: z.string().trim().min(1).max(220),
  contextSignals: z.array(z.string().trim().min(1).max(120)).max(5),
  extraStoryAdded: z.array(z.string().trim().min(1).max(120)).max(4).optional(),
  relationshipToDictionary: z.enum([
    "supports",
    "adds_context",
    "softens",
    "conflicts",
  ]),
  contextConflict: z.boolean(),
})

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

const screenshotNotesSchema = z.object({
  screenshotNotes: z.array(z.string().trim().min(1).max(140)).min(1).max(4),
  relationshipToDictionary: z.enum([
    "supports",
    "adds_context",
    "softens",
    "conflicts",
  ]),
  contextConflict: z.boolean(),
})

export { buildDictionaryAiPayload }

export const dictionaryTranslate = (
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
    aiEnhancement?: AiEnhancement
    inputOverride?: string
  }
): TranslationResult => ({
  ...result,
  mode,
  input: extras?.inputOverride ?? result.input,
  extractedPhrase: extras?.extractedPhrase,
  analysis: extras?.analysis,
  aiInsight: extras?.aiInsight ?? result.aiInsight,
  aiEnhancement: extras?.aiEnhancement ?? result.aiEnhancement,
})

const localLongAnalysis = (
  vent: string,
  direction: TranslationDirection,
  extractedPhrase: string,
  dictionary: DictionaryTranslationContext
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
    extraStoryAdded: [rant.whatYourBrainAdded],
    relationshipToDictionary: dictionary.isFallback
      ? "adds_context"
      : "supports",
    contextConflict: false,
  }
}

const messagesToTextContext = (messages: ScreenshotMessage[]) => {
  const sorted = [...messages].sort((a, b) => a.order - b.order)
  const otherPersonMessages = sorted
    .filter((message) => message.speaker === "other")
    .map((message) => message.text)
  const screenshotOwnerMessages = sorted
    .filter((message) => message.speaker === "owner")
    .map((message) => message.text)
  const unknownMessages = sorted
    .filter((message) => message.speaker === "unknown")
    .map((message) => message.text)

  const conversationSummary = sorted
    .map((message) => `[${message.speaker}] ${message.text}`)
    .join(" | ")
    .slice(0, 500)

  return {
    messages: sorted,
    otherPersonMessages:
      otherPersonMessages.length > 0
        ? otherPersonMessages
        : unknownMessages.length > 0
          ? unknownMessages
          : sorted.map((message) => message.text),
    screenshotOwnerMessages,
    conversationSummary,
  }
}

const extractConversationFromImage = async (params: {
  image: NonNullable<TranslatePipelineRequest["image"]>
  direction: TranslationDirection
}): Promise<ReturnType<typeof messagesToTextContext>> => {
  const extraction = await generateText({
    model: getTextModel(),
    output: Output.object({ schema: screenshotExtractionSchema }),
    instructions: buildScreenshotExtractionPrompt(),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: [
              "Extract the conversation messages faithfully.",
              screenshotStyleInstruction(params.direction),
            ].join(" "),
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

  return messagesToTextContext(extraction.output.messages)
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
    screenshotMessages?: ScreenshotMessage[]
    longInput?: string
  }
}): Promise<AiEnhancement> => {
  const dictionary = toDictionaryContext(params.baseline)
  const result = await generateText({
    model: getTextModel(),
    output: Output.object({ schema: footnoteSchema }),
    instructions: buildFootnotePrompt({
      direction: params.direction,
      memeIntensity: memeIntensityFor(params.sarcasmLevel),
    }),
    prompt: JSON.stringify(
      buildDictionaryAiPayload({
        dictionary,
        direction: params.direction,
        extra: {
          originalInput: params.baseline.input,
          extractedPhrase: params.baseline.extractedPhrase ?? null,
          context: params.context ?? null,
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

  return result.output
}

const buildLongAnalysisWithAi = async (params: {
  text: string
  extractedPhrase: string
  direction: TranslationDirection
  dictionary: DictionaryTranslationContext
  phraseMeta?: {
    sourceType?: TranslationAnalysis["phraseSourceType"]
    sourceExcerpt?: string
    confidence?: "low" | "medium" | "high"
  }
}): Promise<TranslationAnalysis> => {
  const result = await generateText({
    model: getTextModel(),
    output: Output.object({ schema: longAnalysisSchema }),
    instructions: buildLongAnalysisPrompt({ direction: params.direction }),
    prompt: JSON.stringify(
      buildDictionaryAiPayload({
        dictionary: params.dictionary,
        direction: params.direction,
        extra: {
          longInput: params.text,
          extractedPhrase: params.extractedPhrase,
          phraseMeta: params.phraseMeta ?? null,
        },
      })
    ),
    maxOutputTokens: 700,
    abortSignal: AbortSignal.timeout(20_000),
    providerOptions: {
      gateway: {
        tags: ["feature:long-analysis"],
      },
    },
  })

  const output = result.output
  return {
    whyThisPhrase: output.whyThisPhrase,
    contextSignals: output.contextSignals,
    extraStoryAdded: output.extraStoryAdded,
    whatUserBrainAdded: output.extraStoryAdded,
    relationshipToDictionary: output.relationshipToDictionary,
    contextConflict: output.contextConflict,
    phraseSourceType: params.phraseMeta?.sourceType,
  }
}

const buildScreenshotNotesWithAi = async (params: {
  direction: TranslationDirection
  sarcasmLevel: number
  conversationSummary: string
  screenshotOwnerMessages: string[]
  screenshotMessages: ScreenshotMessage[]
  translatedPhrase: string
  dictionary: DictionaryTranslationContext
}): Promise<{
  screenshotNotes: string[]
  relationshipToDictionary: TranslationAnalysis["relationshipToDictionary"]
  contextConflict: boolean
}> => {
  const result = await generateText({
    model: getTextModel(),
    output: Output.object({ schema: screenshotNotesSchema }),
    instructions: buildScreenshotNotesPrompt({
      direction: params.direction,
      memeIntensity: memeIntensityFor(params.sarcasmLevel),
    }),
    prompt: JSON.stringify(
      buildDictionaryAiPayload({
        dictionary: params.dictionary,
        direction: params.direction,
        extra: {
          conversationSummary: params.conversationSummary,
          screenshotOwnerMessages: params.screenshotOwnerMessages,
          screenshotMessages: params.screenshotMessages,
          translatedPhrase: params.translatedPhrase,
        },
      })
    ),
    maxOutputTokens: 400,
    abortSignal: AbortSignal.timeout(15_000),
    providerOptions: {
      gateway: {
        tags: ["feature:screenshot-notes"],
      },
    },
  })

  return result.output
}

const attachFootnoteOrFallback = async (params: {
  baseline: TranslationResult
  direction: TranslationDirection
  sarcasmLevel: number
  gatewayReady: boolean
  context?: {
    conversationSummary?: string
    screenshotOwnerMessages?: string[]
    screenshotMessages?: ScreenshotMessage[]
    longInput?: string
  }
}): Promise<{
  aiInsight: string
  aiEnhancement?: AiEnhancement
}> => {
  const localFootnote = buildLocalSupportingFootnote({
    direction: params.direction,
    isFallback: params.baseline.isFallback,
  })

  if (!params.gatewayReady) {
    return {
      aiInsight: localFootnote,
      aiEnhancement: {
        type: params.baseline.isFallback
          ? "alternate_reading"
          : "overthinking_check",
        text: localFootnote,
        relationshipToDictionary: params.baseline.isFallback
          ? "adds_context"
          : "supports",
        contextConflict: false,
      },
    }
  }

  try {
    const enhancement = await buildAiFootnote(params)
    return {
      aiInsight: enhancement.text,
      aiEnhancement: enhancement,
    }
  } catch (error) {
    console.error("AI footnote failed:", error)
    return {
      aiInsight: aiFailureFallback(params.direction),
      aiEnhancement: {
        type: "alternate_reading",
        text: aiFailureFallback(params.direction),
        relationshipToDictionary: "adds_context",
        contextConflict: false,
      },
    }
  }
}

/**
 * Unified adaptive translate pipeline.
 * Dictionary translation is always computed before AI enhancement.
 */
export const runTranslatePipeline = async (
  request: TranslatePipelineRequest
): Promise<TranslationResult> => {
  const { direction, sarcasmLevel, gruntMode, image } = request
  let text = request.text?.trim() ?? ""
  let conversationSummary: string | undefined
  let screenshotOwnerMessages: string[] | undefined
  let screenshotMessages: ScreenshotMessage[] | undefined

  // 1. Normalise input — optional screenshot extraction first.
  if (image && isGatewayConfigured()) {
    try {
      const conversation = await extractConversationFromImage({
        image,
        direction,
      })
      conversationSummary = conversation.conversationSummary
      screenshotOwnerMessages = conversation.screenshotOwnerMessages
      screenshotMessages = conversation.messages

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

  // Short path: dictionary first, then supporting AI.
  if (mode === "short_translation") {
    // 3. Deterministic dictionary translation (source of truth).
    const baseline = dictionaryTranslate(
      text,
      direction,
      sarcasmLevel,
      gruntMode
    )
    const dictionary = toDictionaryContext(baseline)
    let analysis: TranslationAnalysis | undefined

    // 4–5. Supporting AI only, with exact dictionary context.
    const { aiInsight, aiEnhancement } = await attachFootnoteOrFallback({
      baseline,
      direction,
      sarcasmLevel,
      gatewayReady,
      context: {
        conversationSummary,
        screenshotOwnerMessages,
        screenshotMessages,
      },
    })

    if (image && conversationSummary && gatewayReady) {
      try {
        const notes = await buildScreenshotNotesWithAi({
          direction,
          sarcasmLevel,
          conversationSummary,
          screenshotOwnerMessages: screenshotOwnerMessages ?? [],
          screenshotMessages: screenshotMessages ?? [],
          translatedPhrase: text,
          dictionary,
        })
        analysis = {
          screenshotNotes: notes.screenshotNotes,
          relationshipToDictionary: notes.relationshipToDictionary,
          contextConflict: notes.contextConflict,
        }
      } catch (error) {
        console.error("Screenshot notes failed:", error)
      }
    }

    return withMode(baseline, "short_translation", {
      aiInsight,
      aiEnhancement,
      analysis,
      inputOverride: text,
    })
  }

  // Long-context path:
  // 2. Extract one phrase first.
  // 3. Dictionary-translate that phrase.
  // 4. Send dictionary + extraction into long analysis / footnote AI.
  let extractedPhrase = extractPhraseHeuristic(text)
  let phraseMeta: {
    sourceType?: TranslationAnalysis["phraseSourceType"]
    sourceExcerpt?: string
    confidence?: "low" | "medium" | "high"
  } = {
    sourceType: "pivotal_phrase",
    confidence: "medium",
  }
  let extractionSignals: string[] | undefined
  let extractionExtraStory: string[] | undefined

  if (gatewayReady) {
    try {
      const extracted = await extractPhraseWithAi({ text, direction })
      extractedPhrase = extracted.phrase
      phraseMeta = {
        sourceType: extracted.sourceType,
        sourceExcerpt: extracted.sourceExcerpt,
        confidence: extracted.confidence,
      }
      extractionSignals = extracted.contextSignals
      extractionExtraStory = extracted.extraStoryAdded
    } catch (error) {
      console.error("Phrase extraction failed:", error)
    }
  }

  // 3. Deterministic dictionary on the extracted phrase only.
  const baseline = dictionaryTranslate(
    extractedPhrase,
    direction,
    sarcasmLevel,
    gruntMode
  )
  const dictionary = toDictionaryContext(baseline)

  let analysis: TranslationAnalysis = localLongAnalysis(
    text,
    direction,
    extractedPhrase,
    dictionary
  )

  if (extractionSignals?.length) {
    analysis = {
      ...analysis,
      contextSignals: extractionSignals,
      extraStoryAdded: extractionExtraStory ?? analysis.extraStoryAdded,
      whatUserBrainAdded:
        extractionExtraStory ?? analysis.whatUserBrainAdded,
      phraseSourceType: phraseMeta.sourceType,
    }
  }

  if (gatewayReady) {
    try {
      analysis = await buildLongAnalysisWithAi({
        text,
        extractedPhrase,
        direction,
        dictionary,
        phraseMeta,
      })
    } catch (error) {
      console.error("Long analysis failed:", error)
    }
  }

  if (image && conversationSummary && gatewayReady) {
    try {
      const notes = await buildScreenshotNotesWithAi({
        direction,
        sarcasmLevel,
        conversationSummary,
        screenshotOwnerMessages: screenshotOwnerMessages ?? [],
        screenshotMessages: screenshotMessages ?? [],
        translatedPhrase: extractedPhrase,
        dictionary,
      })
      analysis = {
        ...analysis,
        screenshotNotes: notes.screenshotNotes,
        relationshipToDictionary:
          notes.contextConflict
            ? "conflicts"
            : (analysis.relationshipToDictionary ??
              notes.relationshipToDictionary),
        contextConflict:
          Boolean(analysis.contextConflict) || notes.contextConflict,
      }
    } catch (error) {
      console.error("Screenshot notes failed:", error)
    }
  }

  const { aiInsight, aiEnhancement } = await attachFootnoteOrFallback({
    baseline: {
      ...baseline,
      extractedPhrase,
      input: text,
    },
    direction,
    sarcasmLevel,
    gatewayReady,
    context: {
      conversationSummary,
      screenshotOwnerMessages,
      screenshotMessages,
      longInput: text,
    },
  })

  return withMode(baseline, "long_context_translation", {
    extractedPhrase,
    analysis,
    aiInsight,
    aiEnhancement,
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
