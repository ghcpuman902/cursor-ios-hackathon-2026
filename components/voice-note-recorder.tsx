"use client"

import { motion } from "motion/react"
import { Mic, Square } from "lucide-react"

import { VoiceNoteWaveform } from "@/components/voice-note-waveform"
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
  recordPrompt?: string
  idleHint?: string
  onToggleRecording: () => void
}

export function VoiceNoteRecorder({
  status,
  durationMs,
  waveformHistory,
  liveLevels,
  transcript,
  disabled = false,
  recordPrompt = "Record what they actually said",
  idleHint = "Tap record when you're ready.",
  onToggleRecording,
}: VoiceNoteRecorderProps) {
  const isRecording = status === "recording"
  const isProcessing = status === "processing"

  return (
    <section className="overflow-hidden" aria-label="Voice capture">
      <div className="border-b border-white/10 bg-white/[0.04] px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
              Voice capture
            </p>
            <p className="mt-1 text-sm text-foreground/75">
              {isRecording
                ? "Listening…"
                : isProcessing
                  ? "Transcribing…"
                  : recordPrompt}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 px-5 py-9">
        <div className="flex items-center gap-3">
          {isRecording && (
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-rose-400/50" />
              <span className="relative inline-flex size-2.5 rounded-full bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.8)]" />
            </span>
          )}
          <span className="font-mono text-5xl font-extralight tracking-tight text-foreground tabular-nums sm:text-6xl">
            {formatDurationMs(durationMs)}
          </span>
        </div>

        <div className="glass-ring w-full rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-5">
          <VoiceNoteWaveform
            samples={waveformHistory}
            liveLevels={liveLevels}
            isRecording={isRecording}
          />
        </div>

        {transcript?.trim() ? (
          <div className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-left">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              Transcribed
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
              &ldquo;{transcript}&rdquo;
            </p>
          </div>
        ) : (
          <p className="max-w-[16rem] text-center text-xs leading-relaxed text-muted-foreground">
            {isRecording
              ? "Speak clearly — the waveform reacts in real time"
              : idleHint}
          </p>
        )}

        <div className="relative flex items-center justify-center pt-1">
          {isRecording && (
            <motion.span
              className="absolute size-32 rounded-full border border-primary/10"
              initial={{ opacity: 0.5, scale: 0.9 }}
              animate={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            />
          )}

          <button
            type="button"
            disabled={disabled || isProcessing}
            onClick={onToggleRecording}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
            className={cn(
              "relative z-10 flex size-[5.5rem] items-center justify-center rounded-full border border-white/70 bg-rose-500 text-white shadow-[0_12px_30px_rgba(244,63,94,0.28)] transition-transform active:scale-95 disabled:opacity-50",
              isRecording &&
                "bg-rose-600 shadow-[0_12px_34px_rgba(225,29,72,0.35)]"
            )}
          >
            <span className="absolute inset-1 rounded-full border border-white/20" />
            {isRecording ? (
              <Square className="relative size-7 fill-current" aria-hidden />
            ) : isProcessing ? (
              <span className="relative size-7 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            ) : (
              <Mic className="relative size-8" aria-hidden />
            )}
          </button>
        </div>

        <p className="text-center text-[11px] tracking-wide text-muted-foreground uppercase">
          {isRecording
            ? "Tap to stop"
            : isProcessing
              ? "Processing"
              : "Tap to record"}
        </p>
      </div>
    </section>
  )
}
