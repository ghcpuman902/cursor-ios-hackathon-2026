"use client"

import { useCallback, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowRight,
  Copy,
  Mic,
  Play,
  RefreshCw,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { VoiceNoteRecorder } from "@/components/voice-note-recorder"
import { useAudioRecorder } from "@/hooks/use-audio-recorder"
import { SAMPLE_PHRASES, CATEGORY_LABELS } from "@/lib/translations"
import {
  getRandomLoadingMessage,
  translateMale,
  type TranslationResult,
} from "@/lib/translator"
import { cn } from "@/lib/utils"

type MaleTranslatorProps = {
  appName: string
  tagline: string
  sarcasmLevel: number
  gruntMode: boolean
  translationDelayMs: number
}

type ViewMode = "voice" | "type"

export function MaleTranslator({
  appName,
  tagline,
  sarcasmLevel,
  gruntMode,
  translationDelayMs,
}: MaleTranslatorProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("voice")
  const [input, setInput] = useState("")
  const [result, setResult] = useState<TranslationResult | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")
  const [isSpeaking, setIsSpeaking] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const speechUrlRef = useRef<string | null>(null)

  const translate = useCallback(
    async (text: string) => {
      if (!text.trim()) {
        toast.error("He said nothing. That's also data.", {
          description: "Record a voice note or type something first.",
        })
        return
      }

      setIsTranslating(true)
      setLoadingMessage(getRandomLoadingMessage())
      setResult(null)

      await new Promise((resolve) => setTimeout(resolve, translationDelayMs))

      const translation = translateMale(text, { sarcasmLevel, gruntMode })
      setResult(translation)
      setIsTranslating(false)
    },
    [gruntMode, sarcasmLevel, translationDelayMs],
  )

  const transcribeAudio = useCallback(
    async (blob: Blob) => {
      const formData = new FormData()
      formData.append("audio", blob, "grunt.webm")

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      const data = (await response.json()) as { text?: string; error?: string }

      if (!response.ok) {
        throw new Error(data.error ?? "Transcription failed.")
      }

      if (!data.text?.trim()) {
        throw new Error("Could not detect speech in the recording.")
      }

      setInput(data.text)
      await translate(data.text)
    },
    [translate],
  )

  const {
    status: recorderStatus,
    durationMs,
    waveformHistory,
    liveLevels,
    startRecording,
    stopRecording,
    isSupported: isMicSupported,
  } = useAudioRecorder({
    onRecordingComplete: async (blob) => {
      try {
        setLoadingMessage("Decoding grunt frequencies…")
        await transcribeAudio(blob)
        toast.success("Voice note transcribed!")
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Transcription failed."
        toast.error("Could not decode that grunt.", { description: message })
      }
    },
  })

  const handleToggleRecording = async () => {
    if (recorderStatus === "recording") {
      stopRecording()
      return
    }

    if (recorderStatus === "processing" || isTranslating) return

    try {
      setInput("")
      setResult(null)
      await startRecording()
    } catch {
      toast.error("Microphone access denied.", {
        description: "Allow mic access to record a voice note.",
      })
    }
  }

  const handleSubmit = () => translate(input)

  const handleSample = (phrase: string) => {
    setViewMode("type")
    setInput(phrase)
    void translate(phrase)
  }

  const stopSpeechPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    if (speechUrlRef.current) {
      URL.revokeObjectURL(speechUrlRef.current)
      speechUrlRef.current = null
    }

    setIsSpeaking(false)
  }, [])

  const handleSpeakTranslation = async () => {
    if (!result || isSpeaking) return

    stopSpeechPlayback()
    setIsSpeaking(true)

    try {
      const response = await fetch("/api/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: result.translation }),
      })

      if (!response.ok) {
        const data = (await response.json()) as { error?: string }
        throw new Error(data.error ?? "Speech generation failed.")
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      speechUrlRef.current = audioUrl

      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onended = () => stopSpeechPlayback()
      audio.onerror = () => {
        stopSpeechPlayback()
        toast.error("Playback failed.")
      }

      await audio.play()
    } catch (error) {
      stopSpeechPlayback()
      const message =
        error instanceof Error ? error.message : "Speech generation failed."
      toast.error("Could not generate speech.", { description: message })
    }
  }

  const copyResult = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result.translation)
    toast.success("Copied!")
  }

  const sarcasmLabel =
    sarcasmLevel <= 3
      ? "Gentle"
      : sarcasmLevel <= 6
        ? "Honest"
        : sarcasmLevel <= 8
          ? "Spicy"
          : "Nuclear"

  const isRecorderBusy =
    recorderStatus === "recording" || recorderStatus === "processing"
  const isBusy = isTranslating || isRecorderBusy

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5">
      <header className="space-y-2 px-1 text-center">
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-zinc-950 px-3 py-1 text-[11px] font-medium tracking-wide text-white">
          <Mic className="size-3" aria-hidden />
          Voice note mode
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{appName}</h1>
        <p className="text-sm text-muted-foreground">{tagline}</p>
        <Badge variant="secondary" className="rounded-full">
          Sarcasm {sarcasmLevel}/10 · {sarcasmLabel}
        </Badge>
      </header>

      {viewMode === "voice" ? (
        <div className="space-y-4">
          {isMicSupported ? (
            <VoiceNoteRecorder
              status={recorderStatus}
              durationMs={durationMs}
              waveformHistory={waveformHistory}
              liveLevels={liveLevels}
              transcript={input}
              disabled={isBusy && recorderStatus !== "recording"}
              onToggleRecording={() => void handleToggleRecording()}
              onSwitchToType={() => setViewMode("type")}
            />
          ) : (
            <div className="rounded-[1.75rem] bg-zinc-950 px-5 py-10 text-center text-white">
              <p className="text-sm">Voice notes need a mic-friendly browser.</p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4 rounded-full"
                onClick={() => setViewMode("type")}
              >
                Switch to typing
              </Button>
            </div>
          )}

          {input.trim() && recorderStatus === "idle" && !isTranslating && (
            <Button
              onClick={handleSubmit}
              disabled={isBusy}
              className="h-12 w-full rounded-full"
              size="lg"
            >
              <Sparkles aria-hidden />
              Translate voice note
              <ArrowRight aria-hidden />
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4 rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Type what he said</p>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => setViewMode("voice")}
            >
              <Mic className="size-4" aria-hidden />
              Voice
            </Button>
          </div>

          <Textarea
            placeholder={`e.g. "I'm fine", "k", "do whatever you want"`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                handleSubmit()
              }
            }}
            rows={4}
            className="min-h-28 resize-none rounded-2xl"
            disabled={isBusy}
          />

          <div className="flex flex-wrap gap-2">
            {SAMPLE_PHRASES.map((phrase) => (
              <Button
                key={phrase}
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => handleSample(phrase)}
                disabled={isBusy}
              >
                &ldquo;{phrase}&rdquo;
              </Button>
            ))}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isBusy}
            className="h-11 w-full rounded-full"
          >
            <Sparkles aria-hidden />
            Translate
            <ArrowRight aria-hidden />
          </Button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {(isTranslating || recorderStatus === "processing") && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-3xl border border-dashed border-border/70 bg-muted/20 px-4 py-8 text-center"
          >
            <p className="text-sm text-muted-foreground">{loadingMessage}</p>
          </motion.div>
        )}

        {result && !isTranslating && recorderStatus !== "processing" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <div className="flex justify-start">
              <div className="max-w-[88%] rounded-3xl rounded-bl-md bg-zinc-200 px-4 py-3 text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
                <p className="text-[10px] font-medium tracking-wide uppercase opacity-60">
                  His voice note
                </p>
                <p className="mt-1">&ldquo;{result.input}&rdquo;</p>
              </div>
            </div>

            <div className="flex justify-end">
              <div
                className={cn(
                  "max-w-[88%] rounded-3xl rounded-br-md px-4 py-4 text-sm",
                  result.isFallback
                    ? "bg-zinc-800 text-white"
                    : "bg-blue-600 text-white",
                )}
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <p className="text-[10px] font-medium tracking-wide uppercase opacity-70">
                    Translation
                  </p>
                  <Badge className="h-5 rounded-full bg-white/15 px-2 text-[10px] text-white">
                    {result.category === "mystery"
                      ? "🔮 Mystery"
                      : CATEGORY_LABELS[result.category]}
                  </Badge>
                  <Badge className="h-5 rounded-full bg-white/15 px-2 font-mono text-[10px] text-white">
                    {result.confidence}%
                  </Badge>
                </div>

                <p className="text-base leading-relaxed font-medium">
                  &ldquo;{result.translation}&rdquo;
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 rounded-full bg-white/15 text-white hover:bg-white/25"
                    onClick={handleSpeakTranslation}
                    disabled={isSpeaking}
                  >
                    {isSpeaking ? (
                      <RefreshCw className="animate-spin" aria-hidden />
                    ) : (
                      <Play aria-hidden />
                    )}
                    Play
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 rounded-full bg-white/15 text-white hover:bg-white/25"
                    onClick={copyResult}
                  >
                    <Copy aria-hidden />
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 rounded-full text-white/80 hover:bg-white/10 hover:text-white"
                    onClick={() => {
                      stopSpeechPlayback()
                      setResult(null)
                      setInput("")
                    }}
                  >
                    New note
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="text-center text-[11px] text-muted-foreground">
        Voice notes stay on your device until transcribed.
      </footer>
    </div>
  )
}
