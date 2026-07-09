"use client"

import { useCallback, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
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
import {
  SAMPLE_PHRASES,
  FEMALE_SAMPLE_PHRASES,
  CATEGORY_LABELS,
} from "@/lib/translations"
import {
  getRandomLoadingMessage,
  getRandomFemaleLoadingMessage,
  translateMale,
  translateFemale,
  type TranslationResult,
} from "@/lib/translator"
import { cn } from "@/lib/utils"

type TranslatorGender = "male" | "female"

const GENDER_CONFIG = {
  male: {
    appName: "Male Translator™",
    tagline: "Decoding grunts, shrugs, and three-word texts since forever",
    subjectLabel: "He said",
    typeLabel: "Type what he said",
    typePlaceholder: `e.g. "I'm fine", "k", "do whatever you want"`,
    recordPrompt: "Record what he actually said",
    idleHint: "Tap record. Grunts, mumbles, and one-word texts all count.",
    emptyToastTitle: "He said nothing. That's also data.",
    transcribeLoading: "Decoding grunt frequencies…",
    transcribeError: "Could not decode that grunt.",
    samplePhrases: SAMPLE_PHRASES,
  },
  female: {
    appName: "Female Translator™",
    tagline: 'Decoding "fine", punctuation, and what she actually meant',
    subjectLabel: "She said",
    typeLabel: "Type what she said",
    typePlaceholder: `e.g. "I'm fine", "it's fine", "we need to talk"`,
    recordPrompt: "Record what she actually said",
    idleHint: "Tap record. Tone, pauses, and word choice all count.",
    emptyToastTitle: "She said nothing. That's also data.",
    transcribeLoading: "Reading between the lines…",
    transcribeError: "Could not transcribe that.",
    samplePhrases: FEMALE_SAMPLE_PHRASES,
  },
} as const

type MaleTranslatorProps = {
  appName?: string
  tagline?: string
  sarcasmLevel: number
  gruntMode: boolean
  translationDelayMs: number
}

type ViewMode = "voice" | "type"

function DynamicGenderBackground({ gender }: { gender: TranslatorGender }) {
  const reduceMotion = useReducedMotion()
  const isMale = gender === "male"

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={gender}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.7 }}
        >
          <motion.div
            className={cn(
              "absolute -top-28 -left-24 size-96 rounded-full blur-[90px]",
              isMale ? "bg-blue-500/30" : "bg-fuchsia-500/28"
            )}
            animate={
              reduceMotion
                ? undefined
                : {
                    x: [0, 34, -12, 0],
                    y: [0, 22, 48, 0],
                    scale: [1, 1.08, 0.96, 1],
                  }
            }
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className={cn(
              "absolute top-[28%] -right-32 size-[28rem] rounded-full blur-[110px]",
              isMale ? "bg-cyan-400/22" : "bg-rose-400/24"
            )}
            animate={
              reduceMotion
                ? undefined
                : {
                    x: [0, -46, 10, 0],
                    y: [0, 42, -18, 0],
                    scale: [1, 0.94, 1.07, 1],
                  }
            }
            transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className={cn(
              "absolute -bottom-40 left-[18%] size-[30rem] rounded-full blur-[120px]",
              isMale ? "bg-violet-500/24" : "bg-amber-400/18"
            )}
            animate={
              reduceMotion
                ? undefined
                : { x: [0, 54, -24, 0], y: [0, -28, 8, 0] }
            }
            transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export function MaleTranslator({
  appName: appNameProp,
  tagline: taglineProp,
  sarcasmLevel,
  gruntMode,
  translationDelayMs,
}: MaleTranslatorProps) {
  const [gender, setGender] = useState<TranslatorGender>("male")
  const genderConfig = GENDER_CONFIG[gender]
  const appName =
    gender === "male" && appNameProp ? appNameProp : genderConfig.appName
  const tagline =
    gender === "male" && taglineProp ? taglineProp : genderConfig.tagline

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
        toast.error(genderConfig.emptyToastTitle, {
          description: "Record a voice note or type something first.",
        })
        return
      }

      setIsTranslating(true)
      setLoadingMessage(
        gender === "female"
          ? getRandomFemaleLoadingMessage()
          : getRandomLoadingMessage()
      )
      setResult(null)

      await new Promise((resolve) => setTimeout(resolve, translationDelayMs))

      const dictionaryTranslation =
        gender === "female"
          ? translateFemale(text, { sarcasmLevel, gruntMode })
          : translateMale(text, { sarcasmLevel, gruntMode })

      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: text,
            gender,
            sarcasmLevel,
            gruntMode,
          }),
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
    [
      gender,
      genderConfig.emptyToastTitle,
      gruntMode,
      sarcasmLevel,
      translationDelayMs,
    ]
  )

  const transcribeAudio = useCallback(
    async (blob: Blob) => {
      const extension = blob.type.includes("mp4")
        ? "m4a"
        : blob.type.includes("ogg")
          ? "ogg"
          : "webm"

      const formData = new FormData()
      formData.append("audio", blob, `note.${extension}`)

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

  const handleRecordingComplete = useCallback(
    async (blob: Blob) => {
      try {
        setLoadingMessage(genderConfig.transcribeLoading)
        await transcribeAudio(blob)
        toast.success("Voice note transcribed!")
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Transcription failed."
        toast.error(genderConfig.transcribeError, { description: message })
      }
    },
    [
      genderConfig.transcribeError,
      genderConfig.transcribeLoading,
      transcribeAudio,
    ]
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
    onRecordingComplete: handleRecordingComplete,
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

  const handleGenderChange = (nextGender: TranslatorGender) => {
    if (nextGender === gender) return
    stopSpeechPlayback()
    setGender(nextGender)
    setInput("")
    setResult(null)
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
    <>
      <DynamicGenderBackground gender={gender} />

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col gap-6">
        <header className="relative space-y-5 pt-12 text-center sm:pt-10">
          <div className="absolute top-0 right-0">
            <div
              className="flex rounded-full border border-white/12 bg-white/[0.07] p-0.5 shadow-sm backdrop-blur-xl"
              role="tablist"
              aria-label="Translator gender"
            >
              {(["male", "female"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  role="tab"
                  aria-selected={gender === mode}
                  onClick={() => handleGenderChange(mode)}
                  disabled={isBusy}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 sm:px-3",
                    gender === mode
                      ? "bg-white/16 text-white shadow-sm"
                      : "text-white/45 hover:bg-white/8 hover:text-white/75"
                  )}
                >
                  {mode === "male" ? "Male" : "Female"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {appName}
            </h1>
            <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground">
              {tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge className="rounded-full border-white/12 bg-white/[0.08] text-white/75 shadow-sm backdrop-blur-xl hover:bg-white/[0.08]">
              Sarcasm {sarcasmLevel}/10 · {sarcasmLabel}
            </Badge>
            {gruntMode && (
              <Badge
                variant="outline"
                className="rounded-full border-white/12 bg-white/[0.06] text-white/60 backdrop-blur-xl"
              >
                Grunt mode
              </Badge>
            )}
          </div>
        </header>

        <div
          className="grid grid-cols-2 rounded-full border border-white/12 bg-white/[0.07] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
          role="tablist"
          aria-label="Input method"
        >
          {(["voice", "type"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              role="tab"
              aria-selected={viewMode === mode}
              onClick={() => setViewMode(mode)}
              disabled={isRecorderBusy}
              className={cn(
                "flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50",
                viewMode === mode
                  ? "bg-white/16 text-white shadow-sm"
                  : "text-white/45 hover:bg-white/[0.06] hover:text-white/75"
              )}
            >
              {mode === "voice" ? (
                <Mic className="size-4" aria-hidden />
              ) : (
                <Keyboard className="size-4" aria-hidden />
              )}
              {mode === "voice" ? "Voice" : "Type"}
            </button>
          ))}
        </div>

        <GlassPanel variant="strong" className="overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={viewMode}
              role="tabpanel"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {viewMode === "voice" ? (
                <div>
                  {isMicSupported ? (
                    <VoiceNoteRecorder
                      status={recorderStatus}
                      durationMs={durationMs}
                      waveformHistory={waveformHistory}
                      liveLevels={liveLevels}
                      transcript={input}
                      recordPrompt={genderConfig.recordPrompt}
                      idleHint={genderConfig.idleHint}
                      disabled={isBusy && recorderStatus !== "recording"}
                      onToggleRecording={() => void handleToggleRecording()}
                    />
                  ) : (
                    <div className="px-5 py-10 text-center">
                      <p className="text-sm text-muted-foreground">
                        Voice notes need a mic-friendly browser.
                      </p>
                      <Button
                        size="sm"
                        className="mt-4 rounded-full"
                        onClick={() => setViewMode("type")}
                      >
                        Switch to typing
                      </Button>
                    </div>
                  )}

                  {input.trim() &&
                    recorderStatus === "idle" &&
                    !isTranslating && (
                      <div className="border-t border-border/60 p-5">
                        <Button
                          onClick={handleSubmit}
                          disabled={isBusy}
                          className="h-12 w-full rounded-full"
                          size="lg"
                        >
                          <Sparkles aria-hidden />
                          Translate
                          <ArrowRight aria-hidden />
                        </Button>
                      </div>
                    )}
                </div>
              ) : (
                <div className="space-y-4 p-5">
                  <p className="text-sm font-medium text-foreground/80">
                    {genderConfig.typeLabel}
                  </p>

                  <Textarea
                    aria-label={genderConfig.typeLabel}
                    placeholder={genderConfig.typePlaceholder}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        (event.metaKey || event.ctrlKey)
                      ) {
                        event.preventDefault()
                        handleSubmit()
                      }
                    }}
                    rows={4}
                    className="min-h-32 resize-none rounded-2xl border-white/12 bg-white/[0.06] text-foreground placeholder:text-muted-foreground/65 focus-visible:border-white/25 focus-visible:ring-white/10"
                    disabled={isBusy}
                  />

                  <div className="flex flex-wrap gap-2">
                    {genderConfig.samplePhrases.map((phrase) => (
                      <Button
                        key={phrase}
                        variant="outline"
                        size="sm"
                        className="rounded-full border-white/12 bg-white/[0.06] text-white/70 hover:bg-white/12 hover:text-white"
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
            </motion.div>
          </AnimatePresence>
        </GlassPanel>

        <AnimatePresence mode="wait">
          {(isTranslating || recorderStatus === "processing") && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <GlassPanel variant="subtle" className="px-4 py-8 text-center">
                <div className="mx-auto mb-3 size-5 animate-spin rounded-full border-2 border-primary/15 border-t-primary/70" />
                <p className="text-sm text-muted-foreground">
                  {loadingMessage}
                </p>
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
                <div className="max-w-[88%] rounded-3xl rounded-bl-md border border-white/12 bg-white/[0.08] px-4 py-3 text-sm text-foreground/80 shadow-sm backdrop-blur-xl">
                  <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    {genderConfig.subjectLabel}
                  </p>
                  <p className="mt-1 text-foreground/90">
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
                    <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                      Translation
                    </p>
                    <Badge className="h-5 rounded-full border-border/70 bg-secondary px-2 text-[10px] text-secondary-foreground hover:bg-secondary">
                      {result.category === "mystery"
                        ? "🔮 Mystery"
                        : CATEGORY_LABELS[result.category]}
                    </Badge>
                    <Badge className="h-5 rounded-full border-border/70 bg-secondary px-2 font-mono text-[10px] text-secondary-foreground hover:bg-secondary">
                      {result.confidence}%
                    </Badge>
                  </div>

                  <p className="text-base leading-relaxed font-medium text-foreground">
                    &ldquo;{result.translation}&rdquo;
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="h-8 rounded-full"
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
                      className="h-8 rounded-full"
                      onClick={copyResult}
                    >
                      <Copy aria-hidden />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 rounded-full text-muted-foreground hover:text-foreground"
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

        <footer className="text-center text-[11px] text-muted-foreground/80">
          Voice notes stay on your device until transcribed.
        </footer>
      </div>
    </>
  )
}
