"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const LIVE_BAR_COUNT = 28
const MAX_HISTORY = 72

function createIdleLevels(): number[] {
  return Array.from({ length: LIVE_BAR_COUNT }, () => 0.12)
}

function averageLevel(levels: number[]): number {
  if (levels.length === 0) return 0.12
  return levels.reduce((sum, level) => sum + level, 0) / levels.length
}

export function useAudioLevels() {
  const [levels, setLevels] = useState<number[]>(createIdleLevels)
  const [waveformHistory, setWaveformHistory] = useState<number[]>([])
  const [isActive, setIsActive] = useState(false)

  const streamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const rafRef = useRef<number | null>(null)
  const dataRef = useRef<Uint8Array | null>(null)
  const lastSampleAtRef = useRef(0)

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null

    void audioContextRef.current?.close()
    audioContextRef.current = null
    analyserRef.current = null
    dataRef.current = null
    lastSampleAtRef.current = 0

    setIsActive(false)
    setLevels(createIdleLevels())
  }, [])

  const resetHistory = useCallback(() => {
    setWaveformHistory([])
    lastSampleAtRef.current = 0
  }, [])

  const start = useCallback(async () => {
    stop()
    resetHistory()

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    })

    const audioContext = new AudioContext()
    await audioContext.resume()

    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 128
    analyser.smoothingTimeConstant = 0.72

    const source = audioContext.createMediaStreamSource(stream)
    source.connect(analyser)

    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    streamRef.current = stream
    audioContextRef.current = audioContext
    analyserRef.current = analyser
    dataRef.current = dataArray
    setIsActive(true)

    const tick = (timestamp: number) => {
      const analyserNode = analyserRef.current
      const buffer = dataRef.current
      if (!analyserNode || !buffer) return

      analyserNode.getByteFrequencyData(
        buffer as Uint8Array<ArrayBuffer>,
      )

      const nextLevels = Array.from({ length: LIVE_BAR_COUNT }, (_, index) => {
        const sampleIndex = Math.floor((index / LIVE_BAR_COUNT) * buffer.length * 0.65)
        const value = buffer[sampleIndex] ?? 0
        const normalized = value / 255
        return Math.max(0.1, Math.min(1, normalized * 1.4))
      })

      setLevels(nextLevels)

      if (timestamp - lastSampleAtRef.current >= 90) {
        lastSampleAtRef.current = timestamp
        const sample = averageLevel(nextLevels)
        setWaveformHistory((current) => [...current, sample].slice(-MAX_HISTORY))
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [resetHistory, stop])

  useEffect(() => stop, [stop])

  return {
    levels,
    waveformHistory,
    isActive,
    start,
    stop,
    resetHistory,
    barCount: LIVE_BAR_COUNT,
  }
}
