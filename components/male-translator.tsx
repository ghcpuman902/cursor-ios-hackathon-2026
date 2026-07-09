"use client"

import { useCallback, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowRight,
  Copy,
  Keyboard,
  Mic,
  Play,
  RefreshCw,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

import { GlassPanel } from "@/components/glass-panel"
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

      const dictionaryTranslation = translateMale(text, {
        sarcasmLevel,
        gruntMode,
      })

      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: text, sarcasmLevel, gruntMode }),
          signal: AbortSignal.timeout(20_000),
        })

        if (!response.ok) {
          throw new Error("AI translation request failed.")
        }

        const translation = (await response.json()) as TranslationResult
        setResult(translation)
      } catch {
        setResult(dictionaryTranslation)
      } finally {
        setIsTranslating(false)
      }
    },
    [gruntMode, sarcasmLevel, translationDelayMs]
  )

  const transcribeAudio = useCallback(
    async (blob: Blob) => {
      const extension = blob.type.includes("mp4")
        ? "m4a"
        : blob.type.includes("ogg")
          ? "ogg"
          : "webm"

      const formData = new FormData()
      formData.append("audio", blob, `grunt.${extension}`)

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
    [translate]
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
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
      <header className="space-y-4 text-center">
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium tracking-wider text-white/60 uppercase backdrop-blur-md">
          <span className="size-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          Live decode
        </div>

        <div className="space-y-2">
          <h1 className="text-gradient-brand text-3xl font-semibold tracking-tight sm:text-4xl">
            {appName}
          </h1>
          <p className="mx-auto max-w-xs text-sm leading-relaxed text-white/50">
            {tagline}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge className="rounded-full border-white/10 bg-white/10 text-white/80 backdrop-blur-sm hover:bg-white/10">
            Sarcasm {sarcasmLevel}/10 · {sarcasmLabel}
          </Badge>
          {gruntMode && (
            <Badge
              variant="outline"
              className="rounded-full border-white/15 bg-transparent text-white/60"
            >
              Grunt mode
            </Badge>
          )}
        </div>
      </header>

      <div className="flex rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md">
        {(["voice", "type"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setViewMode(mode)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium transition-all",
              viewMode === mode
                ? "bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
                : "text-white/45 hover:text-white/70"
            )}
          >
            {mode === "voice" ? (
              <Mic className="size-3.5" aria-hidden />
            ) : (
              <Keyboard className="size-3.5" aria-hidden />
            )}
            {mode === "voice" ? "Voice" : "Type"}
          </button>
        ))}
      </div>

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
            <GlassPanel className="px-5 py-10 text-center">
              <p className="text-sm text-white/70">
                Voice notes need a mic-friendly browser.
              </p>
              <Button
                size="sm"
                className="mt-4 rounded-full border-0 bg-white/15 text-white hover:bg-white/25"
                onClick={() => setViewMode("type")}
              >
                Switch to typing
              </Button>
            </GlassPanel>
          )}

          {input.trim() && recorderStatus === "idle" && !isTranslating && (
            <Button
              onClick={handleSubmit}
              disabled={isBusy}
              className="h-12 w-full rounded-full border-0 bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-[0_0_30px_rgba(139,92,246,0.35)] hover:from-violet-500 hover:to-cyan-400"
              size="lg"
            >
              <Sparkles aria-hidden />
              Translate
              <ArrowRight aria-hidden />
            </Button>
          )}
        </div>
      ) : (
        <GlassPanel className="space-y-4 p-5">
          <p className="text-sm font-medium text-white/80">Type what he said</p>

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
            className="min-h-28 resize-none rounded-2xl border-white/10 bg-white/5 text-white backdrop-blur-sm placeholder:text-white/30 focus-visible:border-violet-400/50 focus-visible:ring-violet-400/20"
            disabled={isBusy}
          />

          <div className="flex flex-wrap gap-2">
            {SAMPLE_PHRASES.map((phrase) => (
              <Button
                key={phrase}
                variant="outline"
                size="sm"
                className="rounded-full border-white/10 bg-white/5 text-white/70 backdrop-blur-sm hover:bg-white/10 hover:text-white"
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
            className="h-11 w-full rounded-full border-0 bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:from-violet-500 hover:to-cyan-400"
          >
            <Sparkles aria-hidden />
            Translate
            <ArrowRight aria-hidden />
          </Button>
        </GlassPanel>
      )}

      <AnimatePresence mode="wait">
        {(isTranslating || recorderStatus === "processing") && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <GlassPanel variant="subtle" className="px-4 py-8 text-center">
              <div className="mx-auto mb-3 size-5 animate-spin rounded-full border-2 border-white/15 border-t-violet-400" />
              <p className="text-sm text-white/50">{loadingMessage}</p>
            </GlassPanel>
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
              <div className="max-w-[88%] rounded-3xl rounded-bl-md border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/80 backdrop-blur-xl">
                <p className="text-[10px] font-semibold tracking-[0.16em] text-white/40 uppercase">
                  He said
                </p>
                <p className="mt-1 text-white/90">
                  &ldquo;{result.input}&rdquo;
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <GlassPanel
                variant="strong"
                className="max-w-[88%] rounded-3xl rounded-br-md px-4 py-4 text-sm"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <p className="text-[10px] font-semibold tracking-[0.16em] text-violet-300/80 uppercase">
                    Translation
                  </p>
                  <Badge className="h-5 rounded-full border-white/10 bg-white/10 px-2 text-[10px] text-white/80">
                    {result.category === "mystery"
                      ? "🔮 Mystery"
                      : CATEGORY_LABELS[result.category]}
                  </Badge>
                  <Badge className="h-5 rounded-full border-white/10 bg-white/10 px-2 font-mono text-[10px] text-white/80">
                    {result.confidence}%
                  </Badge>
                </div>

                <p className="text-base leading-relaxed font-medium text-white">
                  &ldquo;{result.translation}&rdquo;
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className="h-8 rounded-full border-white/10 bg-white/10 text-white hover:bg-white/20"
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
                    className="h-8 rounded-full border-white/10 bg-white/10 text-white hover:bg-white/20"
                    onClick={copyResult}
                  >
                    <Copy aria-hidden />
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 rounded-full text-white/60 hover:bg-white/10 hover:text-white"
                    onClick={() => {
                      stopSpeechPlayback()
                      setResult(null)
                      setInput("")
                    }}
                  >
                    New
                  </Button>
                </div>
              </GlassPanel>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="text-center text-[11px] text-white/30">
        Voice notes stay on your device until transcribed.
      </footer>
    </div>
  )
}
