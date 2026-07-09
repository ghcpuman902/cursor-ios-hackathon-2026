"use client"

import { motion, useReducedMotion } from "motion/react"
import { Mic, Square } from "lucide-react"

import { formatDuration } from "@/lib/format-duration"
import { cn } from "@/lib/utils"

const DISPLAY_BARS = 48

type VoiceNoteWaveformProps = {
  samples: number[]
  isRecording: boolean
  durationSeconds: number
  hasContent?: boolean
  className?: string
}

function padSamples(samples: number[]): number[] {
  if (samples.length >= DISPLAY_BARS) {
    return samples.slice(-DISPLAY_BARS)
  }

  const padding = Array.from(
    { length: DISPLAY_BARS - samples.length },
    () => 0.14,
  )
  return [...padding, ...samples]
}

export function VoiceNoteWaveform({
  samples,
  isRecording,
  durationSeconds,
  hasContent = false,
  className,
}: VoiceNoteWaveformProps) {
  const reduceMotion = useReducedMotion()
  const bars = padSamples(samples)

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-full border px-3 py-2.5 shadow-sm sm:px-4 sm:py-3",
        isRecording
          ? "border-destructive/30 bg-destructive/5"
          : hasContent
            ? "border-border/70 bg-muted/50"
            : "border-border/60 bg-muted/30",
        className,
      )}
    >
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full sm:size-10",
          isRecording
            ? "bg-destructive text-white"
            : hasContent
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground",
        )}
      >
        {isRecording ? (
          <Square className="size-3.5 fill-current sm:size-4" aria-hidden />
        ) : (
          <Mic className="size-4" aria-hidden />
        )}
      </div>

      <div className="relative min-w-0 flex-1">
        <div
          aria-hidden
          className="flex h-8 items-end gap-[2px] sm:h-9 sm:gap-[3px]"
        >
          {bars.map((level, index) => (
            <WaveformBar
              key={`${index}-${bars.length}`}
              level={level}
              isRecording={isRecording}
              reduceMotion={reduceMotion}
              isRecent={index >= bars.length - 4}
            />
          ))}
        </div>

        {isRecording && (
          <motion.span
            aria-hidden
            className="absolute top-1/2 right-0 h-6 w-0.5 -translate-y-1/2 rounded-full bg-destructive"
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ duration: 0.9, repeat: Infinity }}
          />
        )}
      </div>

      <span
        className={cn(
          "shrink-0 font-mono text-xs tabular-nums sm:text-sm",
          isRecording ? "text-destructive" : "text-muted-foreground",
        )}
      >
        {formatDuration(durationSeconds)}
      </span>
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
  const minHeight = 18
  const height = Math.round(minHeight + level * 72)

  const barClass = cn(
    "w-[2px] rounded-full sm:w-[3px]",
    isRecording
      ? isRecent
        ? "bg-destructive"
        : "bg-destructive/55"
      : "bg-foreground/45",
  )

  if (reduceMotion) {
    return (
      <span
        className={barClass}
        style={{ height: `${height}%` }}
      />
    )
  }

  return (
    <motion.span
      className={barClass}
      initial={false}
      animate={{ height: `${height}%` }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 28,
        mass: 0.25,
      }}
    />
  )
}
