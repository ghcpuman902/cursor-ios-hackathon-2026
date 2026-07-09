"use client"

import { motion } from "motion/react"
import { Keyboard, Mic, Square } from "lucide-react"

import { GlassPanel } from "@/components/glass-panel"
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
  recordPrompt?: string
  idleHint?: string
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
  recordPrompt = "Record what they actually said",
  idleHint = "Tap record when you're ready.",
  onToggleRecording,
  onSwitchToType,
}: VoiceNoteRecorderProps) {
  const isRecording = status === "recording"
  const isProcessing = status === "processing"

  return (
    <GlassPanel variant="strong" className="overflow-hidden">
      <div className="border-b border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.22em] text-white/45 uppercase">
              Voice capture
            </p>
            <p className="mt-1 text-sm text-white/75">
              {isRecording
                ? "Listening…"
                : isProcessing
                  ? "Transcribing…"
                  : recordPrompt}
            </p>
          </div>
          {onSwitchToType && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onSwitchToType}
              disabled={disabled || isRecording || isProcessing}
              className="h-8 rounded-full border border-white/10 bg-white/5 text-white/70 backdrop-blur-sm hover:bg-white/10 hover:text-white"
            >
              <Keyboard className="size-3.5" aria-hidden />
              Type
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-7 px-5 py-8">
        <div className="flex items-center gap-3">
          {isRecording && (
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-rose-400/50" />
              <span className="relative inline-flex size-2.5 rounded-full bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.8)]" />
            </span>
          )}
          <span
            className={cn(
              "font-mono text-5xl font-extralight tabular-nums tracking-tight sm:text-6xl",
              isRecording
                ? "text-white"
                : "text-white/90",
            )}
          >
            {formatDurationMs(durationMs)}
          </span>
        </div>

        <div className="glass-ring w-full rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-4 backdrop-blur-md">
          <VoiceNoteWaveform
            samples={waveformHistory}
            liveLevels={liveLevels}
            isRecording={isRecording}
          />
        </div>

        {transcript?.trim() ? (
          <div className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-white/45 uppercase">
              Transcribed
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-white/90">
              &ldquo;{transcript}&rdquo;
            </p>
          </div>
        ) : (
          <p className="max-w-[16rem] text-center text-xs leading-relaxed text-white/40">
            {isRecording
              ? "Speak clearly — the waveform reacts in real time"
              : idleHint}
          </p>
        )}

        <div className="relative flex items-center justify-center pt-1">
          {isRecording && (
            <motion.span
              className="absolute size-32 rounded-full border border-white/10"
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
              "relative z-10 flex size-[5.5rem] items-center justify-center rounded-full border border-white/15 bg-[#ff3b30] text-white shadow-[0_8px_24px_rgba(255,59,48,0.35)] transition-transform active:scale-95 disabled:opacity-50",
              isRecording && "bg-[#ff453a] shadow-[0_8px_28px_rgba(255,69,58,0.45)]",
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

        <p className="text-center text-[11px] tracking-wide text-white/35 uppercase">
          {isRecording ? "Tap to stop" : isProcessing ? "Processing" : "Tap to record"}
        </p>
      </div>
    </GlassPanel>
  )
}
