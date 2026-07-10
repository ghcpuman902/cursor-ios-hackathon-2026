"use client"

import { useEffect, useState } from "react"

const DEFAULT_INTERVAL_MS = 3200

export const useCyclingPlaceholder = (
  phrases: readonly string[],
  enabled: boolean,
  intervalMs = DEFAULT_INTERVAL_MS
): string | undefined => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!enabled || phrases.length === 0) return

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % phrases.length)
    }, intervalMs)

    return () => window.clearInterval(timer)
  }, [enabled, phrases, intervalMs])

  if (!enabled || phrases.length === 0) return undefined

  return `e.g. "${phrases[index]}"`
}
