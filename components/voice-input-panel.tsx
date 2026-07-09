"use client"

import { useEffect } from "react"
import { motion } from "motion/react"
import { Mic, MicOff } from "lucide-react"

import { VoiceNoteWaveform } from "@/components/voice-note-waveform"
import { useAudioLevels } from "@/hooks/use-audio-levels"
import { useRecordingTimer } from "@/hooks/use-recording-timer"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { cn } from "@/lib/utils"

type VoiceInputPanelProps = {
  disabled?: boolean
  onTranscriptChange: (value: string) => void
  onListeningChange?: (isListening: boolean) => void
}

export function VoiceInputPanel({
  disabled = false,
  onTranscriptChange,
  onListeningChange,
}: VoiceInputPanelProps) {
  const {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition()

  const { waveformHistory, isActive, start, stop, resetHistory } =
    useAudioLevels()
  const { elapsedSeconds, reset: resetTimer } = useRecordingTimer(isListening)

  const liveText = [transcript, interimTranscript].filter(Boolean).join(" ").trim()
  const hasVoiceNote = liveText.length > 0 || waveformHistory.length > 0

  useEffect(() => {
    onTranscriptChange(liveText)
  }, [liveText, onTranscriptChange])

  useEffect(() => {
    onListeningChange?.(isListening)
  }, [isListening, onListeningChange])

  const handleToggleListening = async () => {
    if (disabled) return

    if (isListening) {
      stopListening()
      stop()
      return
    }

    resetTranscript()
    resetHistory()
    resetTimer()

    try {
      await start()
      startListening({ append: false })
    } catch {
      stop()
      stopListening()
    }
  }

  if (!isSupported) {
    return (
      <div className="rounded-3xl border border-dashed border-border/80 bg-muted/30 px-4 py-10 text-center">
        <MicOff className="mx-auto mb-3 size-8 text-muted-foreground" aria-hidden />
        <p className="text-sm font-medium">Voice notes aren&apos;t supported here</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Switch to Type mode, or try Chrome / Safari on desktop or mobile.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 text-sm font-medium text-destructive"
        >
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive/50" />
            <span className="relative inline-flex size-2.5 rounded-full bg-destructive" />
          </span>
          Recording voice note
        </motion.div>
      )}

      <VoiceNoteWaveform
        samples={waveformHistory}
        isRecording={isListening && isActive}
        durationSeconds={elapsedSeconds}
        hasContent={hasVoiceNote}
      />

      <div
        className={cn(
          "rounded-3xl px-4 py-3 text-sm leading-relaxed transition-colors",
          liveText
            ? "bg-primary text-primary-foreground"
            : "bg-muted/40 text-muted-foreground",
        )}
      >
        {liveText ? (
          <p>
            <span className="block text-[11px] font-medium tracking-wide uppercase opacity-70">
              He said
            </span>
            <span className="mt-1 block text-base font-medium">
              &ldquo;{liveText}
              {interimTranscript ? "…" : ""}&rdquo;
            </span>
          </p>
        ) : (
          <p className="text-center">
            {isListening
              ? "Keep talking — your words will land here like a voice note."
              : "Record a voice note of what he said. Grunts count."}
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 pt-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => void handleToggleListening()}
          aria-pressed={isListening}
          aria-label={isListening ? "Stop recording" : "Start recording"}
          className={cn(
            "relative flex size-20 items-center justify-center rounded-full shadow-lg transition-transform active:scale-95 disabled:opacity-50",
            isListening
              ? "bg-destructive text-white"
              : "bg-destructive text-white hover:bg-destructive/90",
          )}
        >
          {isListening ? (
            <span className="size-6 rounded-sm bg-white" aria-hidden />
          ) : (
            <Mic className="size-8" aria-hidden />
          )}

          {isListening && (
            <>
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-destructive/40"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 1.45, opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.span
                className="absolute inset-0 rounded-full border border-destructive/25"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1.75, opacity: 0 }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.25,
                }}
              />
            </>
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          {isListening
            ? "Tap the square to stop recording"
            : "Tap to record a voice note"}
        </p>
      </div>
    </div>
  )
}
