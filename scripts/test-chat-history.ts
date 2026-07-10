import assert from "node:assert/strict"

import {
  CHAT_HISTORY_VERSION,
  MAX_TURNS_PER_THREAD,
  appendTurn,
  clearThread,
  createPendingTurn,
  createTurnId,
  hasConversation,
  hydrateTurn,
  parseStoredChatHistory,
  serializeThreads,
  toPersistableTurn,
  type ChatThreads,
} from "../lib/chat-history"
import type { TranslationResult } from "../lib/translator"

const sampleResult = (): TranslationResult => ({
  input: "k",
  direction: "male_to_female",
  mode: "short_translation",
  headline: "Tiny ping",
  comicTranslation: "Cosmic breadcrumb",
  translation: "Cosmic breadcrumb",
  possibleActualMeaning: "Acknowledged",
  riskLevel: "low",
  lowestRiskReply: "Got it",
  tinyWholesomeNudge: "Breathe",
  category: "texting",
  confidence: 0.8,
  isFallback: false,
  source: "dictionary",
})

const completeTurn = (input: string) => {
  const turn = createPendingTurn(input, "typed")
  return {
    ...turn,
    status: "complete" as const,
    result: { ...sampleResult(), input },
  }
}

const run = () => {
  const empty = parseStoredChatHistory(null)
  assert.deepEqual(empty, { male: [], female: [] })

  const corrupt = parseStoredChatHistory("{not-json")
  assert.deepEqual(corrupt, { male: [], female: [] })

  const wrongVersion = parseStoredChatHistory(
    JSON.stringify({ version: 99, threads: { male: [], female: [] } })
  )
  assert.deepEqual(wrongVersion, { male: [], female: [] })

  const pending = createPendingTurn("hello", "voice")
  assert.equal(toPersistableTurn(pending), null)

  const completed = completeTurn("I'm fine")
  const persisted = toPersistableTurn(completed)
  assert.ok(persisted)
  assert.equal(persisted?.status, "complete")
  assert.equal(persisted?.result?.input, "I'm fine")

  let threads: ChatThreads = { male: [], female: [] }
  threads = appendTurn(threads, "male", completed)
  threads = appendTurn(threads, "female", completeTurn("Do whatever you want"))
  assert.equal(threads.male.length, 1)
  assert.equal(threads.female.length, 1)

  const serialized = serializeThreads(threads)
  assert.equal(serialized.version, CHAT_HISTORY_VERSION)

  const restored = parseStoredChatHistory(JSON.stringify(serialized))
  assert.equal(restored.male[0]?.input, "I'm fine")
  assert.equal(restored.female[0]?.input, "Do whatever you want")

  const cappedThreads: ChatThreads = {
    male: Array.from({ length: MAX_TURNS_PER_THREAD + 5 }, (_, index) =>
      completeTurn(`turn-${index}`)
    ),
    female: [],
  }
  const capped = serializeThreads(cappedThreads)
  assert.equal(capped.threads.male.length, MAX_TURNS_PER_THREAD)
  assert.equal(capped.threads.male[0]?.input, "turn-5")

  const cleared = clearThread(threads, "male")
  assert.equal(cleared.male.length, 0)
  assert.equal(cleared.female.length, 1)

  assert.equal(hasConversation([]), false)
  assert.equal(hasConversation([createPendingTurn("x", "typed")]), true)
  assert.equal(
    hasConversation([
      {
        ...createPendingTurn("x", "typed"),
        status: "complete",
        result: sampleResult(),
      },
    ]),
    true
  )

  const hydrated = hydrateTurn({
    id: createTurnId(),
    input: "k",
    inputSource: "typed",
    createdAt: Date.now(),
    status: "complete",
    result: sampleResult(),
  })
  assert.equal(hydrated.status, "complete")
  assert.equal(hydrated.result?.headline, "Tiny ping")

  console.log("chat-history storage checks passed")
}

run()
