"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type AudioRecorderStatus = "idle" | "recording" | "processing"

type UseAudioRecorderOptions = {
  onRecordingComplete?: (blob: Blob) => void | Promise<void>
}

type UseAudioRecorderReturn = {
  status: AudioRecorderStatus
  durationMs: number
  startRecording: () => Promise<void>
  stopRecording: () => void
  isSupported: boolean
}

const getSupportedMimeType = () => {
  if (typeof MediaRecorder === "undefined") return ""

  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ]

  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? ""
}

export const useAudioRecorder = ({
  onRecordingComplete,
}: UseAudioRecorderOptions = {}): UseAudioRecorderReturn => {
  const [status, setStatus] = useState<AudioRecorderStatus>("idle")
  const [durationMs, setDurationMs] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)
  const startedAtRef = useRef<number | null>(null)

  const isSupported =
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== "undefined"

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const stopMediaStream = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop())
    mediaStreamRef.current = null
  }, [])

  const resetRecorder = useCallback(() => {
    clearTimer()
    stopMediaStream()
    mediaRecorderRef.current = null
    chunksRef.current = []
    startedAtRef.current = null
    setDurationMs(0)
  }, [clearTimer, stopMediaStream])

  const startRecording = useCallback(async () => {
    if (!isSupported || status === "recording" || status === "processing") {
      return
    }

    resetRecorder()

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaStreamRef.current = stream

    const mimeType = getSupportedMimeType()
    const recorder = mimeType
      ? new MediaRecorder(stream, { mimeType })
      : new MediaRecorder(stream)

    chunksRef.current = []
    mediaRecorderRef.current = recorder
    startedAtRef.current = Date.now()
    setDurationMs(0)
    setStatus("recording")

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data)
      }
    }

    recorder.onstop = async () => {
      clearTimer()
      stopMediaStream()

      const blob = new Blob(chunksRef.current, {
        type: recorder.mimeType || mimeType || "audio/webm",
      })

      chunksRef.current = []
      mediaRecorderRef.current = null
      startedAtRef.current = null

      if (blob.size === 0) {
        setStatus("idle")
        return
      }

      setStatus("processing")

      try {
        await onRecordingComplete?.(blob)
      } finally {
        setStatus("idle")
        setDurationMs(0)
      }
    }

    recorder.start()
    timerRef.current = window.setInterval(() => {
      if (startedAtRef.current !== null) {
        setDurationMs(Date.now() - startedAtRef.current)
      }
    }, 100)
  }, [
    clearTimer,
    isSupported,
    onRecordingComplete,
    resetRecorder,
    status,
    stopMediaStream,
  ])

  const stopRecording = useCallback(() => {
    if (status !== "recording") return

    const recorder = mediaRecorderRef.current
    if (!recorder || recorder.state === "inactive") return

    recorder.stop()
  }, [status])

  useEffect(() => {
    return () => {
      resetRecorder()
    }
  }, [resetRecorder])

  return {
    status,
    durationMs,
    startRecording,
    stopRecording,
    isSupported,
  }
}
