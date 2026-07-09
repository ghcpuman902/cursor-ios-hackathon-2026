"use client"

import { motion } from "motion/react"
import { Keyboard, Mic, Square } from "lucide-react"

import { VoiceNoteWaveform } from "@/components/voice-note-waveform"
import { Button } from "@/components/ui/button"
import { formatDurationMs } from "@/lib/format-duration"
import { cn } from "@/lib/utils"

type RecorderStatus = "idle" | "recording" | "processing"

type VoiceNoteRecorderProps = {
  status: RecorderStatus
  durationMs: number
  waveformHistory: number[]
  liveLevels: number[]
  transcript?: string
  disabled?: boolean
  onToggleRecording: () => void
  onSwitchToType?: () => void
}

export function VoiceNoteRecorder({
  status,
  durationMs,
  waveformHistory,
  liveLevels,
  transcript,
  disabled = false,
  onToggleRecording,
  onSwitchToType,
}: VoiceNoteRecorderProps) {
  const isRecording = status === "recording"
  const isProcessing = status === "processing"

  return (
    <div className="flex flex-col overflow-hidden rounded-[1.75rem] bg-zinc-950 text-white shadow-2xl shadow-zinc-950/30">
      <div className="border-b border-white/10 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium tracking-[0.2em] text-white/50 uppercase">
              Voice note
            </p>
            <p className="mt-1 text-sm text-white/80">
              {isRecording
                ? "Recording…"
                : isProcessing
                  ? "Transcribing grunt…"
                  : "Hold the mic. Say what he said."}
            </p>
          </div>
          {onSwitchToType && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onSwitchToType}
              disabled={disabled || isRecording || isProcessing}
              className="h-8 rounded-full text-white/70 hover:bg-white/10 hover:text-white"
            >
              <Keyboard className="size-3.5" aria-hidden />
              Type
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 px-5 py-8">
        <div className="flex items-center gap-3">
          {isRecording && (
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400/60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-red-500" />
            </span>
          )}
          <span
            className={cn(
              "font-mono text-4xl font-light tabular-nums tracking-tight sm:text-5xl",
              isRecording ? "text-red-400" : "text-white",
            )}
          >
            {formatDurationMs(durationMs)}
          </span>
        </div>

        <div className="w-full rounded-2xl bg-white/5 px-3 py-4 ring-1 ring-white/10">
          <VoiceNoteWaveform
            samples={waveformHistory}
            liveLevels={liveLevels}
            isRecording={isRecording}
            variant="dark"
          />
        </div>

        {transcript?.trim() ? (
          <div className="w-full rounded-2xl bg-white/10 px-4 py-3 text-left ring-1 ring-white/10">
            <p className="text-[10px] font-medium tracking-[0.18em] text-white/50 uppercase">
              Transcribed
            </p>
            <p className="mt-1 text-sm leading-relaxed text-white">
              &ldquo;{transcript}&rdquo;
            </p>
          </div>
        ) : (
          <p className="text-center text-xs text-white/45">
            {isRecording
              ? "Waveform is live — speak now"
              : "Your voice note transcript appears here after recording"}
          </p>
        )}

        <div className="relative flex items-center justify-center pt-2">
          {isRecording && (
            <>
              <motion.span
                className="absolute size-28 rounded-full border border-red-500/30"
                initial={{ opacity: 0.8, scale: 0.9 }}
                animate={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.span
                className="absolute size-28 rounded-full border border-red-500/20"
                initial={{ opacity: 0.6, scale: 0.95 }}
                animate={{ opacity: 0, scale: 1.8 }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.3,
                }}
              />
            </>
          )}

          <button
            type="button"
            disabled={disabled || isProcessing}
            onClick={onToggleRecording}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
            className={cn(
              "relative z-10 flex size-24 items-center justify-center rounded-full transition-transform active:scale-95 disabled:opacity-50",
              isRecording
                ? "bg-red-500 text-white shadow-[0_0_40px_rgba(239,68,68,0.45)]"
                : "bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.35)] hover:bg-red-400",
            )}
          >
            {isRecording ? (
              <Square className="size-8 fill-current" aria-hidden />
            ) : isProcessing ? (
              <span className="size-8 animate-pulse rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Mic className="size-9" aria-hidden />
            )}
          </button>
        </div>

        <p className="text-center text-xs text-white/45">
          {isRecording
            ? "Tap square to stop"
            : isProcessing
              ? "Decoding male dialect…"
              : "Tap to record"}
        </p>
      </div>
    </div>
  )
}
