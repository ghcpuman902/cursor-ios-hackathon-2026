"use client"

import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

const DISPLAY_BARS = 56

type VoiceNoteWaveformProps = {
  samples: number[]
  liveLevels?: number[]
  isRecording: boolean
  className?: string
}

function buildBars(samples: number[], liveLevels: number[], isRecording: boolean) {
  if (isRecording && liveLevels.length > 0) {
    const tail = samples.slice(-Math.floor(DISPLAY_BARS * 0.55))
    const live = liveLevels.slice(-Math.ceil(DISPLAY_BARS * 0.45))
    const merged = [...tail, ...live]
    if (merged.length >= DISPLAY_BARS) return merged.slice(-DISPLAY_BARS)
    return [
      ...Array.from({ length: DISPLAY_BARS - merged.length }, () => 0.12),
      ...merged,
    ]
  }

  if (samples.length >= DISPLAY_BARS) return samples.slice(-DISPLAY_BARS)
  return [
    ...Array.from({ length: DISPLAY_BARS - samples.length }, () => 0.12),
    ...samples,
  ]
}

export function VoiceNoteWaveform({
  samples,
  liveLevels = [],
  isRecording,
  className,
}: VoiceNoteWaveformProps) {
  const reduceMotion = useReducedMotion()
  const bars = buildBars(samples, liveLevels, isRecording)

  return (
    <div
      aria-hidden
      className={cn(
        "flex h-20 w-full items-end justify-center gap-[2px] px-1 sm:h-24 sm:gap-[3px]",
        className,
      )}
    >
      {bars.map((level, index) => (
        <WaveformBar
          key={`${index}-${bars.length}-${isRecording}`}
          level={level}
          isRecording={isRecording}
          reduceMotion={reduceMotion}
          isRecent={index >= bars.length - 6}
        />
      ))}
    </div>
  )
}

function WaveformBar({
  level,
  isRecording,
  reduceMotion,
  isRecent,
}: {
  level: number
  isRecording: boolean
  reduceMotion: boolean | null
  isRecent: boolean
}) {
  const heightPx = Math.round(8 + level * 56)

  const barClass = cn(
    "w-[3px] rounded-full sm:w-1",
    isRecording
      ? isRecent
        ? "bg-white/90"
        : "bg-white/35"
      : "bg-white/25",
  )

  if (reduceMotion) {
    return <span className={barClass} style={{ height: heightPx }} />
  }

  return (
    <motion.span
      className={barClass}
      initial={false}
      animate={{ height: heightPx, opacity: isRecording && isRecent ? 1 : 0.85 }}
      transition={{
        type: "spring",
        stiffness: 520,
        damping: 26,
        mass: 0.28,
      }}
    />
  )
}
