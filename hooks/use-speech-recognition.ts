"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type SpeechRecognitionInstance = {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null
  onend: (() => void) | null
}

type SpeechRecognitionEventLike = {
  resultIndex: number
  results: ArrayLike<{
    isFinal: boolean
    0: { transcript: string }
  }>
}

type SpeechRecognitionErrorEventLike = {
  error: string
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null

  const win = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }

  return win.SpeechRecognition ?? win.webkitSpeechRecognition ?? null
}

export function useSpeechRecognition() {
  const [isSupported] = useState(() => getSpeechRecognition() !== null)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const shouldRestartRef = useRef(false)

  const stopListening = useCallback(() => {
    shouldRestartRef.current = false
    recognitionRef.current?.stop()
    setIsListening(false)
    setInterimTranscript("")
  }, [])

  const startListening = useCallback(
    (options?: { append?: boolean }) => {
      const SpeechRecognition = getSpeechRecognition()
      if (!SpeechRecognition) return

      recognitionRef.current?.abort()

      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "en-US"

      shouldRestartRef.current = true

      recognition.onresult = (event) => {
        let finalText = ""
        let interimText = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (!result) continue
          const chunk = result[0]?.transcript ?? ""
          if (result.isFinal) {
            finalText += chunk
          } else {
            interimText += chunk
          }
        }

        if (finalText) {
          setTranscript((current) => {
            const base = options?.append === false ? "" : current
            const spacer = base && !base.endsWith(" ") ? " " : ""
            return `${base}${spacer}${finalText.trim()}`
          })
        }

        setInterimTranscript(interimText.trim())
      }

      recognition.onerror = () => {
        shouldRestartRef.current = false
        setIsListening(false)
        setInterimTranscript("")
      }

      recognition.onend = () => {
        if (shouldRestartRef.current) {
          try {
            recognition.start()
            return
          } catch {
            shouldRestartRef.current = false
          }
        }
        setIsListening(false)
        setInterimTranscript("")
      }

      recognitionRef.current = recognition

      try {
        recognition.start()
        setIsListening(true)
        if (options?.append === false) {
          setTranscript("")
        }
      } catch {
        setIsListening(false)
      }
    },
    [],
  )

  const resetTranscript = useCallback(() => {
    setTranscript("")
    setInterimTranscript("")
  }, [])

  useEffect(() => {
    return () => {
      shouldRestartRef.current = false
      recognitionRef.current?.abort()
    }
  }, [])

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript,
  }
}
