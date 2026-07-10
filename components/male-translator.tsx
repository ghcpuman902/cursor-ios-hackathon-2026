"use client"

import Image from "next/image"
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  ArrowRight,
  Copy,
  ImageUp,
  Keyboard,
  Mic,
  Play,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react"
import { toast } from "sonner"

import { GlassPanel } from "@/components/glass-panel"
import {
  SlidingTabs,
  SlidingTabsBar,
  type SlidingTabItem,
} from "@/components/sliding-tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { VoiceNoteRecorder } from "@/components/voice-note-recorder"
import { useAudioRecorder } from "@/hooks/use-audio-recorder"
import {
  SAMPLE_PHRASES,
  FEMALE_SAMPLE_PHRASES,
  RISK_LABELS,
} from "@/lib/translations"
import {
  getRandomLoadingMessage,
  getRandomFemaleLoadingMessage,
  translateMale,
  translateFemale,
  type TranslationResult,
  type TranslatorGender,
} from "@/lib/translator"
import { getSecureMicUrl } from "@/lib/audio-capture-support"
import { cn } from "@/lib/utils"

const GENDER_CONFIG = {
  male: {
    appName: "Male → Female",
    tagline: "His short texts, translated into cosy horoscope energy",
    subjectLabel: "He said",
    resultLabel: "For you (her read)",
    typeLabel: "Type what he said",
    typePlaceholder: `e.g. "ok", "sorry", "I'm busy"`,
    recordPrompt: "Record what he actually said",
    idleHint: "Comedy-first decode. Pause before the cathedral of meaning.",
    emptyToastTitle: "He said nothing. Tiny omen: silence.",
    transcribeLoading: "Reading the soft weather…",
    transcribeError: "Could not read that omen.",
    samplePhrases: SAMPLE_PHRASES,
  },
  female: {
    appName: "Female → Male",
    tagline: "Her subtext, translated into quest markers and bro tips",
    subjectLabel: "She said",
    resultLabel: "For you (his read)",
    typeLabel: "Type what she said",
    typePlaceholder: `e.g. "I'm fine", "Nothing", "You should know"`,
    recordPrompt: "Record what she said",
    idleHint: "Joke first. Lowest-risk reply second. No therapy mode.",
    emptyToastTitle: "She said nothing. Suspicious side quest?",
    transcribeLoading: "Scanning for quest markers…",
    transcribeError: "Could not decode that quest.",
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

type ViewMode = "voice" | "type" | "screenshot"

const INPUT_MODE_TABS: SlidingTabItem[] = [
  { value: "voice", label: "Voice", icon: Mic },
  { value: "type", label: "Type", icon: Keyboard },
  { value: "screenshot", label: "Screenshot", icon: ImageUp },
]

type BackgroundBlob = {
  className: string
  colorClass: string
  drift: { x: number[]; y: number[] }
  cycleDuration: number
}

// Male: deep slow drift (~1.6–3.3 breaths/min). Female: calm but slightly livelier (~2.5–5 breaths/min).
const MALE_BACKGROUND_BLOBS: BackgroundBlob[] = [
  {
    className: "absolute -top-32 -left-28 size-[28rem]",
    colorClass: "gender-blob-male-blue",
    drift: {
      x: [0, 28, 10, -18, 0],
      y: [0, 18, 34, 12, 0],
    },
    cycleDuration: 18,
  },
  {
    className: "absolute top-[22%] -right-36 size-[32rem]",
    colorClass: "gender-blob-male-cyan",
    drift: {
      x: [0, -34, 8, 16, 0],
      y: [0, 24, -14, 8, 0],
    },
    cycleDuration: 24,
  },
  {
    className: "absolute -bottom-44 left-[12%] size-[34rem]",
    colorClass: "gender-blob-male-indigo",
    drift: {
      x: [0, 36, -12, -24, 0],
      y: [0, -20, 8, 16, 0],
    },
    cycleDuration: 30,
  },
  {
    className: "absolute top-[58%] right-[8%] size-56",
    colorClass: "gender-blob-male-red",
    drift: {
      x: [0, -14, 12, -6, 0],
      y: [0, -10, 14, 4, 0],
    },
    cycleDuration: 38,
  },
]

const FEMALE_BACKGROUND_BLOBS: BackgroundBlob[] = [
  {
    className: "absolute -top-28 -left-24 size-[30rem]",
    colorClass: "gender-blob-female-soft-pink",
    drift: {
      x: [0, 32, 8, -22, 0],
      y: [0, 20, 38, 12, 0],
    },
    cycleDuration: 12,
  },
  {
    className: "absolute top-[26%] -right-32 size-[30rem]",
    colorClass: "gender-blob-female-fuchsia",
    drift: {
      x: [0, -40, 10, 22, 0],
      y: [0, 28, -16, 8, 0],
    },
    cycleDuration: 15,
  },
  {
    className: "absolute -bottom-40 left-[20%] size-[32rem]",
    colorClass: "gender-blob-female-hot-pink",
    drift: {
      x: [0, 42, -18, -26, 0],
      y: [0, -22, 8, 16, 0],
    },
    cycleDuration: 19,
  },
  {
    className: "absolute top-[12%] left-[42%] size-48",
    colorClass: "gender-blob-female-magenta",
    drift: {
      x: [0, 16, -18, 4, 0],
      y: [0, 12, -10, 6, 0],
    },
    cycleDuration: 24,
  },
]

function DynamicGenderBackground({ gender }: { gender: TranslatorGender }) {
  const reduceMotion = useReducedMotion()
  const blobs =
    gender === "male" ? MALE_BACKGROUND_BLOBS : FEMALE_BACKGROUND_BLOBS

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
          {blobs.map((blob, index) => (
            <motion.div
              key={`${gender}-${index}`}
              className={cn(
                "rounded-full blur-[130px]",
                blob.className,
                blob.colorClass
              )}
              animate={
                reduceMotion
                  ? undefined
                  : {
                      x: blob.drift.x,
                      y: blob.drift.y,
                    }
              }
              transition={{
                duration: blob.cycleDuration,
                repeat: Infinity,
                ease: [0.42, 0, 0.58, 1],
              }}
            />
          ))}
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
  void taglineProp

  const [viewMode, setViewMode] = useState<ViewMode>("voice")
  const [input, setInput] = useState("")
  const [result, setResult] = useState<TranslationResult | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)
  const [isFetchingAiInsight, setIsFetchingAiInsight] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null)
  const [screenshotPreviewUrl, setScreenshotPreviewUrl] = useState<
    string | null
  >(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const speechUrlRef = useRef<string | null>(null)
  const screenshotInputRef = useRef<HTMLInputElement | null>(null)
  const screenshotUrlRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (screenshotUrlRef.current) {
        URL.revokeObjectURL(screenshotUrlRef.current)
      }
    }
  }, [])

  const translate = useCallback(
    async (text: string) => {
      if (!text.trim()) {
        toast.error(genderConfig.emptyToastTitle, {
          description: "Record a voice note or type something first.",
        })
        return
      }

      setIsTranslating(true)
      setIsFetchingAiInsight(false)
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

      setResult(dictionaryTranslation)
      setIsTranslating(false)
      setIsFetchingAiInsight(true)

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

        const enhanced = (await response.json()) as TranslationResult

        setResult((current) => {
          if (!current || current.input !== text) {
            return current
          }

          if (!enhanced.aiInsight) {
            return current
          }

          return {
            ...current,
            aiInsight: enhanced.aiInsight,
          }
        })
      } catch {
        // Dictionary reply is already visible.
      } finally {
        setIsFetchingAiInsight(false)
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
    unsupportedReason: micUnsupportedReason,
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
        description:
          micUnsupportedReason === "insecure-context"
            ? "Open the HTTPS LAN URL from pnpm dev:lan, then allow mic access."
            : "Allow mic access to record a voice note.",
      })
    }
  }

  const handleSubmit = () => translate(input)

  const handleSample = (phrase: string) => {
    setViewMode("type")
    setInput(phrase)
    void translate(phrase)
  }

  const clearScreenshot = useCallback(() => {
    if (screenshotUrlRef.current) {
      URL.revokeObjectURL(screenshotUrlRef.current)
      screenshotUrlRef.current = null
    }

    if (screenshotInputRef.current) {
      screenshotInputRef.current.value = ""
    }

    setScreenshotFile(null)
    setScreenshotPreviewUrl(null)
  }, [])

  const handleScreenshotChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    const isSupportedType = ["image/jpeg", "image/png", "image/webp"].includes(
      file.type
    )

    if (!isSupportedType || file.size > 10 * 1024 * 1024) {
      event.target.value = ""
      toast.error("Choose a PNG, JPEG, or WebP screenshot up to 10 MB.")
      return
    }

    clearScreenshot()
    const previewUrl = URL.createObjectURL(file)
    screenshotUrlRef.current = previewUrl
    setScreenshotFile(file)
    setScreenshotPreviewUrl(previewUrl)
    setResult(null)
  }

  const handleAnalyzeScreenshot = async () => {
    if (!screenshotFile) {
      toast.error("Choose a conversation screenshot first.")
      return
    }

    setIsTranslating(true)
    setLoadingMessage("Reading both sides of the conversation…")
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("screenshot", screenshotFile)
      formData.append("gender", gender)
      formData.append("sarcasmLevel", String(sarcasmLevel))
      formData.append("gruntMode", String(gruntMode))

      const response = await fetch("/api/analyze-screenshot", {
        method: "POST",
        body: formData,
        signal: AbortSignal.timeout(45_000),
      })
      const data = (await response.json()) as TranslationResult & {
        error?: string
      }

      if (!response.ok) {
        throw new Error(data.error ?? "Screenshot analysis failed.")
      }

      setInput(data.input)
      setResult(data)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Screenshot analysis failed."
      toast.error("Could not read that screenshot.", { description: message })
    } finally {
      setIsTranslating(false)
    }
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
        body: JSON.stringify({ text: result.translation, gender }),
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
    const block = [
      result.headline,
      result.comicTranslation,
      "",
      `Probably means: ${result.possibleActualMeaning}`,
      `Risk: ${result.riskLevel}`,
      `Lowest-risk reply: ${result.lowestRiskReply}`,
      `Nudge: ${result.tinyWholesomeNudge}`,
    ].join("\n")
    await navigator.clipboard.writeText(block)
    toast.success("Copied!")
  }

  const handleGenderChange = (nextGender: TranslatorGender) => {
    if (nextGender === gender) return
    stopSpeechPlayback()
    setGender(nextGender)
    setInput("")
    setResult(null)
    setIsFetchingAiInsight(false)
    clearScreenshot()
  }

  // const sarcasmLabel =
  //   sarcasmLevel <= 3
  //     ? "Gentle"
  //     : sarcasmLevel <= 6
  //       ? "Honest"
  //       : sarcasmLevel <= 8
  //         ? "Spicy"
  //         : "Nuclear"

  const isRecorderBusy =
    recorderStatus === "recording" || recorderStatus === "processing"
  const isBusy = isTranslating || isRecorderBusy

  return (
    <>
      <DynamicGenderBackground gender={gender} />

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col">
        <header className="shrink-0 space-y-5 pt-4 text-center sm:pt-10">
          <div className="absolute top-0 right-0 flex items-center gap-2">
            <span className="text-[10px] font-medium tracking-wide text-white/45 uppercase">
              I&apos;m into
            </span>
            <div
              className="sliding-pill sliding-pill--glass relative flex rounded-full border border-white/12 bg-white/[0.07] p-0.5 shadow-sm backdrop-blur-xl"
              role="tablist"
              aria-label="Who I am into"
            >
              {(["male", "female"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  role="tab"
                  data-slot="pill-trigger"
                  data-active={gender === mode ? "" : undefined}
                  aria-selected={gender === mode}
                  onClick={() => handleGenderChange(mode)}
                  disabled={isBusy}
                  className="relative z-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:px-3"
                >
                  {mode === "male" ? "Him → You" : "Her → You"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {appName}
            </h1>
            {/* <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground">
              {tagline}
            </p> */}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {/* <Badge className="rounded-full border-white/12 bg-white/[0.08] text-white/75 shadow-sm backdrop-blur-xl hover:bg-white/[0.08]">
              Sarcasm {sarcasmLevel}/10 · {sarcasmLabel}
            </Badge> */}
            {gruntMode && (
              <Badge
                variant="outline"
                className="rounded-full border-white/12 bg-white/[0.06] text-white/60 backdrop-blur-xl"
              >
                {gender === "male" ? "Extra sparkle" : "Spicy footnotes"}
              </Badge>
            )}
          </div>
        </header>

        <div className="mt-6 shrink-0">
          <SlidingTabs
            value={viewMode}
            onValueChange={(value) => setViewMode(value as ViewMode)}
            className="gap-0"
          >
            <SlidingTabsBar
              items={INPUT_MODE_TABS}
              variant="glass"
              disabled={isRecorderBusy}
              aria-label="Input method"
            />
          </SlidingTabs>
        </div>

        <div className="mt-6 flex flex-col gap-6">
          <GlassPanel variant="strong" className="min-h-[28rem] overflow-hidden">
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
                    <div className="space-y-4 px-5 py-10 text-center">
                      {micUnsupportedReason === "insecure-context" ? (
                        <>
                          <p className="text-sm font-medium text-foreground/85">
                            Microphone access needs HTTPS
                          </p>
                          <p className="mx-auto max-w-xs text-xs leading-relaxed text-muted-foreground">
                            iOS blocks the mic on plain HTTP LAN URLs. On your
                            Mac, run{" "}
                            <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-foreground/80">
                              pnpm dev:lan
                            </code>
                            , then open{" "}
                            <span className="font-medium text-foreground/80">
                              {getSecureMicUrl()}
                            </span>{" "}
                            on your phone and allow the certificate warning.
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Voice notes need a mic-friendly browser. Try Safari on
                          iOS 14.3+ or switch to typing.
                        </p>
                      )}
                      <Button
                        size="sm"
                        className="mt-2 rounded-full"
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
              ) : viewMode === "type" ? (
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
              ) : (
                <div className="space-y-5 p-5">
                  <div>
                    <p className="text-sm font-medium text-foreground/80">
                      Upload a two-sided conversation
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      We&apos;ll separate your messages from theirs, then run
                      the same dictionary-first analysis.
                    </p>
                  </div>

                  {screenshotPreviewUrl ? (
                    <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-black/20">
                      <Image
                        src={screenshotPreviewUrl}
                        alt="Selected conversation screenshot"
                        width={900}
                        height={1600}
                        unoptimized
                        className="max-h-80 w-full object-contain"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon-sm"
                        className="absolute top-2 right-2 rounded-full bg-black/55 text-white hover:bg-black/70"
                        onClick={clearScreenshot}
                        disabled={isBusy}
                        aria-label="Remove screenshot"
                      >
                        <X aria-hidden />
                      </Button>
                    </div>
                  ) : (
                    <label
                      htmlFor="conversation-screenshot"
                      className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/[0.05] px-6 text-center transition-colors focus-within:border-white/30 focus-within:ring-2 focus-within:ring-white/15 hover:border-white/30 hover:bg-white/[0.08]"
                    >
                      <span className="flex size-12 items-center justify-center rounded-full bg-white/10 text-white/80">
                        <ImageUp className="size-5" aria-hidden />
                      </span>
                      <span className="mt-4 text-sm font-medium text-white/85">
                        Choose screenshot
                      </span>
                      <span className="mt-1 text-xs text-muted-foreground">
                        PNG, JPEG, or WebP · 10 MB max
                      </span>
                    </label>
                  )}

                  <input
                    ref={screenshotInputRef}
                    id="conversation-screenshot"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    onChange={handleScreenshotChange}
                    disabled={isBusy}
                  />

                  <Button
                    onClick={() => void handleAnalyzeScreenshot()}
                    disabled={isBusy || !screenshotFile}
                    className="h-11 w-full rounded-full"
                  >
                    <Sparkles aria-hidden />
                    Analyze conversation
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
                      {genderConfig.resultLabel}
                    </p>
                    <Badge className="h-5 rounded-full border-border/70 bg-secondary px-2 text-[10px] text-secondary-foreground hover:bg-secondary">
                      {RISK_LABELS[result.riskLevel]}
                    </Badge>
                  </div>

                  <p className="text-sm font-semibold text-foreground">
                    {result.headline}
                  </p>
                  <p className="mt-2 text-base leading-relaxed font-medium text-foreground">
                    &ldquo;{result.comicTranslation}&rdquo;
                  </p>

                  <div className="mt-3 space-y-2 border-t border-white/10 pt-3 text-sm leading-relaxed text-foreground/80">
                    <p>
                      <span className="font-medium text-foreground/90">
                        Today&apos;s theory:{" "}
                      </span>
                      {result.possibleActualMeaning}
                    </p>
                    <p>
                      <span className="font-medium text-foreground/90">
                        Lowest-risk reply:{" "}
                      </span>
                      {result.lowestRiskReply}
                    </p>
                    <p className="text-foreground/70">
                      {result.tinyWholesomeNudge}
                    </p>
                  </div>

                  {result.aiInsight && (
                    <div className="mt-3 border-t border-white/10 pt-3">
                      <p className="mb-1 flex items-center gap-1 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        <Sparkles className="size-3" aria-hidden />
                        Extra footnote
                      </p>
                      <p className="text-sm leading-relaxed text-foreground/80">
                        {result.aiInsight}
                      </p>
                    </div>
                  )}

                  {isFetchingAiInsight && !result.aiInsight && (
                    <div className="mt-3 border-t border-white/10 pt-3">
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <RefreshCw className="size-3.5 animate-spin" aria-hidden />
                        Adding a tiny footnote…
                      </p>
                    </div>
                  )}

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
                        setIsFetchingAiInsight(false)
                        setInput("")
                        clearScreenshot()
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
      </div>
    </>
  )
}
