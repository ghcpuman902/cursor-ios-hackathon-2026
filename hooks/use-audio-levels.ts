"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const BAR_COUNT = 32

function createIdleLevels(): number[] {
  return Array.from({ length: BAR_COUNT }, () => 0.12)
}

export function useAudioLevels() {
  const [levels, setLevels] = useState<number[]>(createIdleLevels)
  const [isActive, setIsActive] = useState(false)

  const streamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const rafRef = useRef<number | null>(null)
  const dataRef = useRef<Uint8Array<ArrayBuffer> | null>(null)

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

    setIsActive(false)
    setLevels(createIdleLevels())
  }, [])

  const start = useCallback(async () => {
    stop()

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
    analyser.smoothingTimeConstant = 0.78

    const source = audioContext.createMediaStreamSource(stream)
    source.connect(analyser)

    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    streamRef.current = stream
    audioContextRef.current = audioContext
    analyserRef.current = analyser
    dataRef.current = dataArray
    setIsActive(true)

    const tick = () => {
      const analyserNode = analyserRef.current
      const buffer = dataRef.current
      if (!analyserNode || !buffer) return

      analyserNode.getByteFrequencyData(buffer)

      const nextLevels = Array.from({ length: BAR_COUNT }, (_, index) => {
        const sampleIndex = Math.floor((index / BAR_COUNT) * buffer.length * 0.7)
        const value = buffer[sampleIndex] ?? 0
        const normalized = value / 255
        return Math.max(0.1, Math.min(1, normalized * 1.35))
      })

      setLevels(nextLevels)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [stop])

  useEffect(() => stop, [stop])

  return { levels, isActive, start, stop, barCount: BAR_COUNT }
}
