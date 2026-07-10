"use client"

import { useCallback, useEffect, useSyncExternalStore } from "react"

import {
  loadChatHistory,
  saveChatHistory,
  type ChatThreads,
  type ChatTurn,
} from "@/lib/chat-history"
import type { TranslatorGender } from "@/lib/translator"

/** Stable SSR snapshot — must be referentially equal on every call. */
const SERVER_THREADS_SNAPSHOT: ChatThreads = { male: [], female: [] }

let cachedThreads: ChatThreads = { male: [], female: [] }
let storeInitialized = false
const listeners = new Set<() => void>()

const getServerThreadsSnapshot = (): ChatThreads => SERVER_THREADS_SNAPSHOT

const getClientThreadsSnapshot = (): ChatThreads =>
  storeInitialized ? cachedThreads : SERVER_THREADS_SNAPSHOT

const getServerHydratedSnapshot = (): boolean => false

const getClientHydratedSnapshot = (): boolean => storeInitialized

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const emit = (): void => {
  listeners.forEach((listener) => listener())
}

const mutateThreads = (
  updater: (current: ChatThreads) => ChatThreads
): void => {
  const next = updater(getClientThreadsSnapshot())
  cachedThreads = next
  storeInitialized = true
  saveChatHistory(next)
  emit()
}

type UsePersistedChatHistoryResult = {
  threads: ChatThreads
  currentTurns: ChatTurn[]
  isHydrated: boolean
  appendTurn: (gender: TranslatorGender, turn: ChatTurn) => void
  updateTurn: (
    gender: TranslatorGender,
    turnId: string,
    updater: (turn: ChatTurn) => ChatTurn
  ) => void
  clearCurrentThread: (gender: TranslatorGender) => void
}

export const usePersistedChatHistory = (
  gender: TranslatorGender
): UsePersistedChatHistoryResult => {
  const threads = useSyncExternalStore(
    subscribe,
    getClientThreadsSnapshot,
    getServerThreadsSnapshot
  )

  const isHydrated = useSyncExternalStore(
    subscribe,
    getClientHydratedSnapshot,
    getServerHydratedSnapshot
  )

  useEffect(() => {
    if (storeInitialized) return

    cachedThreads = loadChatHistory()
    storeInitialized = true
    emit()
  }, [])

  const appendTurn = useCallback((targetGender: TranslatorGender, turn: ChatTurn) => {
    mutateThreads((current) => ({
      ...current,
      [targetGender]: [...current[targetGender], turn],
    }))
  }, [])

  const updateTurn = useCallback(
    (
      targetGender: TranslatorGender,
      turnId: string,
      updater: (turn: ChatTurn) => ChatTurn
    ) => {
      mutateThreads((current) => ({
        ...current,
        [targetGender]: current[targetGender].map((turn) =>
          turn.id === turnId ? updater(turn) : turn
        ),
      }))
    },
    []
  )

  const clearCurrentThread = useCallback((targetGender: TranslatorGender) => {
    mutateThreads((current) => ({
      ...current,
      [targetGender]: [],
    }))
  }, [])

  return {
    threads,
    currentTurns: threads[gender],
    isHydrated,
    appendTurn,
    updateTurn,
    clearCurrentThread,
  }
}
