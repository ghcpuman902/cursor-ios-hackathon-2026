import { z } from "zod"

import type { TranslationResult, TranslatorGender } from "@/lib/translator"

export const CHAT_HISTORY_STORAGE_KEY = "male-translator-chat-v1"
export const CHAT_HISTORY_VERSION = 1 as const
export const MAX_TURNS_PER_THREAD = 50

export type InputSource = "typed" | "voice" | "mixed"

export type ChatTurnStatus =
  | "pending"
  | "translating"
  | "complete"
  | "error"

export type ChatTurn = {
  id: string
  input: string
  inputSource: InputSource
  createdAt: number
  status: ChatTurnStatus
  result?: TranslationResult
  isFetchingAiInsight?: boolean
  loadingMessage?: string
  errorMessage?: string
}

export type ChatThreads = Record<TranslatorGender, ChatTurn[]>

const translationResultSchema = z.object({
  input: z.string(),
  direction: z.enum(["male_to_female", "female_to_male"]),
  mode: z.enum(["short_translation", "long_context_translation"]),
  extractedPhrase: z.string().optional(),
  headline: z.string(),
  comicTranslation: z.string(),
  translation: z.string(),
  possibleActualMeaning: z.string(),
  riskLevel: z.enum(["low", "medium", "high"]),
  lowestRiskReply: z.string(),
  tinyWholesomeNudge: z.string(),
  category: z.string(),
  confidence: z.number(),
  matchedPattern: z.string().optional(),
  isFallback: z.boolean(),
  source: z.enum(["dictionary", "ai"]),
  timingWarning: z.string().optional(),
  timingFlag: z.string().optional(),
  aiInsight: z.string().optional(),
  aiEnhancement: z
    .object({
      type: z.string(),
      text: z.string(),
      relationshipToDictionary: z.string(),
      contextConflict: z.boolean(),
    })
    .optional(),
  analysis: z
    .object({
      whyThisPhrase: z.string().optional(),
      contextSignals: z.array(z.string()).optional(),
      screenshotNotes: z.array(z.string()).optional(),
      whatUserBrainAdded: z.array(z.string()).optional(),
      extraStoryAdded: z.array(z.string()).optional(),
      relationshipToDictionary: z.string().optional(),
      contextConflict: z.boolean().optional(),
      phraseSourceType: z.string().optional(),
    })
    .optional(),
})

const persistedTurnSchema = z.object({
  id: z.string().min(1),
  input: z.string(),
  inputSource: z.enum(["typed", "voice", "mixed"]),
  createdAt: z.number().int().nonnegative(),
  status: z.enum(["complete", "error"]),
  result: translationResultSchema.optional(),
  errorMessage: z.string().optional(),
})

const chatHistoryStorageSchema = z.object({
  version: z.literal(CHAT_HISTORY_VERSION),
  threads: z.object({
    male: z.array(persistedTurnSchema),
    female: z.array(persistedTurnSchema),
  }),
})

export type PersistedChatHistory = z.infer<typeof chatHistoryStorageSchema>

const emptyThreads = (): ChatThreads => ({
  male: [],
  female: [],
})

export const createTurnId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }

  return `turn-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const createPendingTurn = (
  input: string,
  inputSource: InputSource
): ChatTurn => ({
  id: createTurnId(),
  input,
  inputSource,
  createdAt: Date.now(),
  status: "pending",
})

export const toPersistableTurn = (turn: ChatTurn): z.infer<
  typeof persistedTurnSchema
> | null => {
  if (turn.status !== "complete" && turn.status !== "error") {
    return null
  }

  return {
    id: turn.id,
    input: turn.input,
    inputSource: turn.inputSource,
    createdAt: turn.createdAt,
    status: turn.status,
    result: turn.result,
    errorMessage: turn.errorMessage,
  }
}

export const serializeThreads = (threads: ChatThreads): PersistedChatHistory => ({
  version: CHAT_HISTORY_VERSION,
  threads: {
    male: threads.male
      .map(toPersistableTurn)
      .filter((turn): turn is NonNullable<typeof turn> => turn !== null)
      .slice(-MAX_TURNS_PER_THREAD),
    female: threads.female
      .map(toPersistableTurn)
      .filter((turn): turn is NonNullable<typeof turn> => turn !== null)
      .slice(-MAX_TURNS_PER_THREAD),
  },
})

export const hydrateTurn = (
  turn: z.infer<typeof persistedTurnSchema>
): ChatTurn => ({
  id: turn.id,
  input: turn.input,
  inputSource: turn.inputSource,
  createdAt: turn.createdAt,
  status: turn.status,
  result: turn.result as TranslationResult | undefined,
  errorMessage: turn.errorMessage,
})

export const parseStoredChatHistory = (
  raw: string | null | undefined
): ChatThreads => {
  if (!raw) return emptyThreads()

  try {
    const parsed = chatHistoryStorageSchema.parse(JSON.parse(raw))
    return {
      male: parsed.threads.male.map(hydrateTurn),
      female: parsed.threads.female.map(hydrateTurn),
    }
  } catch {
    return emptyThreads()
  }
}

export const loadChatHistory = (): ChatThreads => {
  if (typeof window === "undefined") return emptyThreads()

  try {
    return parseStoredChatHistory(localStorage.getItem(CHAT_HISTORY_STORAGE_KEY))
  } catch {
    return emptyThreads()
  }
}

export const saveChatHistory = (threads: ChatThreads): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(
      CHAT_HISTORY_STORAGE_KEY,
      JSON.stringify(serializeThreads(threads))
    )
  } catch {
    // Ignore quota / privacy mode failures.
  }
}

export const clearThread = (
  threads: ChatThreads,
  gender: TranslatorGender
): ChatThreads => ({
  ...threads,
  [gender]: [],
})

export const updateTurnInThread = (
  threads: ChatThreads,
  gender: TranslatorGender,
  turnId: string,
  updater: (turn: ChatTurn) => ChatTurn
): ChatThreads => ({
  ...threads,
  [gender]: threads[gender].map((turn) =>
    turn.id === turnId ? updater(turn) : turn
  ),
})

export const appendTurn = (
  threads: ChatThreads,
  gender: TranslatorGender,
  turn: ChatTurn
): ChatThreads => ({
  ...threads,
  [gender]: [...threads[gender], turn].slice(-MAX_TURNS_PER_THREAD),
})

export const hasConversation = (turns: ChatTurn[]): boolean =>
  turns.some(
    (turn) =>
      turn.status === "complete" ||
      turn.status === "translating" ||
      turn.status === "pending" ||
      turn.status === "error"
  )
