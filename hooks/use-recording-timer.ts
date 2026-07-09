"use client"

import { useCallback, useEffect, useState } from "react"

export function useRecordingTimer(isRecording: boolean) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  const reset = useCallback(() => {
    setElapsedSeconds(0)
  }, [])

  useEffect(() => {
    if (!isRecording) return

    const startedAt = Date.now()
    const interval = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000))
    }, 250)

    return () => window.clearInterval(interval)
  }, [isRecording])

  return { elapsedSeconds, reset }
}
