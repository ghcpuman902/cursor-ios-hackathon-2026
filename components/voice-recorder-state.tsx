"use client"

import { Square } from "lucide-react"

import { VoiceNoteWaveform } from "@/components/voice-note-waveform"
import { Button } from "@/components/ui/button"
import { formatDurationMs } from "@/lib/format-duration"

type VoiceRecorderStateProps = {
  durationMs: number
  waveformHistory: number[]
  liveLevels: number[]
  isProcessing?: boolean
  onStop: () => void
}

const RANT_HINT_MS = 12_000

export const VoiceRecorderState = ({
  durationMs,
  waveformHistory,
  liveLevels,
  isProcessing = false,
  onStop,
}: VoiceRecorderStateProps) => {
  const showRantHint = durationMs >= RANT_HINT_MS

  return (
    <div
      className="flex min-h-[10.5rem] flex-col justify-between gap-4"
      role="status"
      aria-live="polite"
      aria-label={isProcessing ? "Transcribing voice note" : "Recording voice note"}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-rose-400/50" />
            <span className="relative inline-flex size-2.5 rounded-full bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.8)]" />
          </span>
          <p className="text-sm font-medium text-foreground/85">
            {isProcessing ? "Transcribing…" : "Listening…"}
          </p>
        </div>
        <span className="font-mono text-sm tabular-nums text-foreground/70">
          {formatDurationMs(durationMs)}
        </span>
      </div>

      <VoiceNoteWaveform
        samples={waveformHistory}
        liveLevels={liveLevels}
        isRecording={!isProcessing}
        className="h-14 sm:h-16"
      />

      <div className="flex items-end justify-between gap-3">
        <p className="min-h-11 flex-1 py-2 text-xs leading-relaxed text-muted-foreground">
          {showRantHint
            ? "Just having a rant? We're listening."
            : "Speak clearly — we'll drop the transcript into the composer."}
        </p>
        {!isProcessing && (
          <Button
            type="button"
            size="icon"
            className="size-11 shrink-0 rounded-full bg-rose-500 text-white hover:bg-rose-500/90"
            onClick={onStop}
            aria-label="Stop recording"
          >
            <Square className="size-3.5 fill-current" aria-hidden />
          </Button>
        )}
      </div>
    </div>
  )
}
