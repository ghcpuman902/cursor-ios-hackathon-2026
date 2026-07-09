"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type AudioRecorderStatus = "idle" | "recording" | "processing"

type UseAudioRecorderOptions = {
  onRecordingComplete?: (blob: Blob) => void | Promise<void>
}

type UseAudioRecorderReturn = {
  status: AudioRecorderStatus
  durationMs: number
  waveformHistory: number[]
  liveLevels: number[]
  startRecording: () => Promise<void>
  stopRecording: () => void
  isSupported: boolean
}

const LIVE_BAR_COUNT = 40
const MAX_HISTORY = 80

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

function createIdleLevels(): number[] {
  return Array.from({ length: LIVE_BAR_COUNT }, () => 0.12)
}

function averageLevel(levels: number[]): number {
  if (levels.length === 0) return 0.12
  return levels.reduce((sum, level) => sum + level, 0) / levels.length
}

export const useAudioRecorder = ({
  onRecordingComplete,
}: UseAudioRecorderOptions = {}): UseAudioRecorderReturn => {
  const [status, setStatus] = useState<AudioRecorderStatus>("idle")
  const [durationMs, setDurationMs] = useState(0)
  const [waveformHistory, setWaveformHistory] = useState<number[]>([])
  const [liveLevels, setLiveLevels] = useState<number[]>(createIdleLevels)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const dataRef = useRef<Uint8Array | null>(null)
  const startedAtRef = useRef<number | null>(null)
  const lastSampleAtRef = useRef(0)

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

  const stopAnalyser = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    void audioContextRef.current?.close()
    audioContextRef.current = null
    analyserRef.current = null
    dataRef.current = null
    lastSampleAtRef.current = 0
    setLiveLevels(createIdleLevels())
  }, [])

  const stopMediaStream = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop())
    mediaStreamRef.current = null
  }, [])

  const resetRecorder = useCallback(() => {
    clearTimer()
    stopAnalyser()
    stopMediaStream()
    mediaRecorderRef.current = null
    chunksRef.current = []
    startedAtRef.current = null
    setDurationMs(0)
    setWaveformHistory([])
  }, [clearTimer, stopAnalyser, stopMediaStream])

  const startAnalyser = useCallback((stream: MediaStream) => {
    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 128
    analyser.smoothingTimeConstant = 0.72

    const source = audioContext.createMediaStreamSource(stream)
    source.connect(analyser)

    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    audioContextRef.current = audioContext
    analyserRef.current = analyser
    dataRef.current = dataArray

    const tick = (timestamp: number) => {
      const analyserNode = analyserRef.current
      const buffer = dataRef.current
      if (!analyserNode || !buffer) return

      analyserNode.getByteFrequencyData(
        buffer as Uint8Array<ArrayBuffer>,
      )

      const nextLevels = Array.from({ length: LIVE_BAR_COUNT }, (_, index) => {
        const sampleIndex = Math.floor(
          (index / LIVE_BAR_COUNT) * buffer.length * 0.65,
        )
        const value = buffer[sampleIndex] ?? 0
        const normalized = value / 255
        return Math.max(0.1, Math.min(1, normalized * 1.45))
      })

      setLiveLevels(nextLevels)

      if (timestamp - lastSampleAtRef.current >= 85) {
        lastSampleAtRef.current = timestamp
        const sample = averageLevel(nextLevels)
        setWaveformHistory((current) => [...current, sample].slice(-MAX_HISTORY))
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    void audioContext.resume()
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const startRecording = useCallback(async () => {
    if (!isSupported || status === "recording" || status === "processing") {
      return
    }

    resetRecorder()

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaStreamRef.current = stream
    startAnalyser(stream)

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
      stopAnalyser()
      stopMediaStream()

      const blob = new Blob(chunksRef.current, {
        type: recorder.mimeType || mimeType || "audio/webm",
      })

      chunksRef.current = []
      mediaRecorderRef.current = null
      startedAtRef.current = null

      if (blob.size === 0) {
        setStatus("idle")
        setWaveformHistory([])
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

    recorder.start(250)
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
    startAnalyser,
    status,
    stopAnalyser,
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
    waveformHistory,
    liveLevels,
    startRecording,
    stopRecording,
    isSupported,
  }
}
