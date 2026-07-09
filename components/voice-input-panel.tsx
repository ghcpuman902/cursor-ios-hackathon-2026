"use client"

import { useEffect } from "react"
import { motion } from "motion/react"
import { Mic, MicOff } from "lucide-react"

import { VoiceWave } from "@/components/voice-wave"
import { Button } from "@/components/ui/button"
import { useAudioLevels } from "@/hooks/use-audio-levels"
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

  const { levels, isActive, start, stop } = useAudioLevels()

  const liveText = [transcript, interimTranscript].filter(Boolean).join(" ").trim()

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
      <div className="rounded-2xl border border-dashed border-border/80 bg-muted/30 px-4 py-10 text-center">
        <MicOff className="mx-auto mb-3 size-8 text-muted-foreground" aria-hidden />
        <p className="text-sm font-medium">Voice input isn&apos;t supported here</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Switch to Type mode, or try Chrome / Safari on desktop or mobile.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative flex w-full flex-col items-center">
        <VoiceWave
          levels={levels}
          isActive={isActive && isListening}
          className={cn(
            "transition-opacity duration-300",
            isListening ? "opacity-100" : "opacity-35",
          )}
        />

        <div className="relative mt-2 flex items-center justify-center">
          {isListening && (
            <>
              <motion.span
                className="absolute size-24 rounded-full border border-primary/25"
                initial={{ opacity: 0.7, scale: 0.85 }}
                animate={{ opacity: 0, scale: 1.45 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.span
                className="absolute size-24 rounded-full border border-primary/15"
                initial={{ opacity: 0.5, scale: 0.9 }}
                animate={{ opacity: 0, scale: 1.7 }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.35,
                }}
              />
            </>
          )}

          <Button
            type="button"
            size="icon"
            disabled={disabled}
            onClick={() => void handleToggleListening()}
            aria-pressed={isListening}
            aria-label={isListening ? "Stop listening" : "Start voice input"}
            className={cn(
              "relative z-10 size-20 rounded-full shadow-lg transition-all sm:size-24",
              isListening
                ? "bg-destructive text-white hover:bg-destructive/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            {isListening ? (
              <MicOff className="size-8 sm:size-9" aria-hidden />
            ) : (
              <Mic className="size-8 sm:size-9" aria-hidden />
            )}
          </Button>
        </div>
      </div>

      <div className="w-full space-y-2 text-center">
        <p className="text-sm font-medium">
          {isListening ? "Listening for male dialect…" : "Tap the mic and say what he said"}
        </p>
        <p className="text-xs text-muted-foreground">
          {isListening
            ? "Grunts, mumbles, and one-word texts all welcome."
            : "Works best in a quiet room. We cannot decode sports yelling yet."}
        </p>
      </div>

      <div
        className={cn(
          "min-h-16 w-full rounded-2xl border px-4 py-3 text-left transition-colors",
          liveText
            ? "border-primary/20 bg-primary/5"
            : "border-dashed border-border/80 bg-muted/20",
        )}
      >
        {liveText ? (
          <p className="text-sm leading-relaxed sm:text-base">
            <span className="text-muted-foreground">He said: </span>
            <span className="font-medium text-foreground">
              &ldquo;{liveText}
              {interimTranscript ? "…" : ""}&rdquo;
            </span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Your live transcript will show up here while you speak.
          </p>
        )}
      </div>
    </div>
  )
}
