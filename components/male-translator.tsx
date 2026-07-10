"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { toast } from "sonner"

import { AdaptiveComposer } from "@/components/adaptive-composer"
import { GlassPanel } from "@/components/glass-panel"
import { TranslationResultCard } from "@/components/translation-result-card"
import { Badge } from "@/components/ui/badge"
import { useAudioRecorder } from "@/hooks/use-audio-recorder"
import {
  extractPhraseHeuristic,
  resolvePipelineMode,
} from "@/lib/input-classifier"
import { deescalateRant } from "@/lib/rant"
import { SAMPLE_PHRASES } from "@/lib/translations"
import {
  buildLocalSupportingFootnote,
  genderToDirection,
} from "@/lib/translate-prompts"
import {
  getRandomLoadingMessage,
  getRandomFemaleLoadingMessage,
  translateMale,
  translateFemale,
  type TranslationResult,
  type TranslatorGender,
} from "@/lib/translator"
import { cn } from "@/lib/utils"

const GENDER_CONFIG = {
  male: {
    appName: "Male → Female",
    tagline: "His short texts, translated into cosy horoscope energy",
    subjectLabel: "He said",
    resultLabel: "For you (her read)",
    typeLabel: "Paste what he said — or rant, we'll find the phrase",
    typePlaceholder: `e.g. "k", "I'm almost there", or a longer vent…`,
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
    typeLabel: "Paste what she said — or rant, we'll find the phrase",
    typePlaceholder: `e.g. "I'm fine", "Do whatever you want", or a longer vent…`,
    emptyToastTitle: "She said nothing. Suspicious side quest?",
    transcribeLoading: "Scanning for quest markers…",
    transcribeError: "Could not decode that quest.",
    samplePhrases: SAMPLE_PHRASES,
  },
} as const

type MaleTranslatorProps = {
  appName?: string
  tagline?: string
  sarcasmLevel: number
  gruntMode: boolean
  translationDelayMs: number
}

type BackgroundBlob = {
  className: string
  colorClass: string
  drift: { x: number[]; y: number[] }
  cycleDuration: number
}

type InputSource = "typed" | "voice" | "mixed"

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

const buildLocalResult = (
  text: string,
  gender: TranslatorGender,
  sarcasmLevel: number,
  gruntMode: boolean
): TranslationResult => {
  const mode = resolvePipelineMode(text)
  const direction = genderToDirection(gender)
  const phrase =
    mode === "long_context_translation" ? extractPhraseHeuristic(text) : text

  const baseline =
    gender === "female"
      ? translateFemale(phrase, { sarcasmLevel, gruntMode })
      : translateMale(phrase, { sarcasmLevel, gruntMode })

  const localFootnote = buildLocalSupportingFootnote({
    direction,
    isFallback: baseline.isFallback,
  })
  const localEnhancement = {
    type: baseline.isFallback
      ? ("alternate_reading" as const)
      : ("overthinking_check" as const),
    text: localFootnote,
    relationshipToDictionary: baseline.isFallback
      ? ("adds_context" as const)
      : ("supports" as const),
    contextConflict: false,
  }

  if (mode === "short_translation") {
    return {
      ...baseline,
      mode,
      input: text,
      aiInsight: localFootnote,
      aiEnhancement: localEnhancement,
    }
  }

  const rant = deescalateRant({
    vent: text,
    originalMessage: phrase,
    direction,
  })

  return {
    ...baseline,
    mode,
    input: text,
    extractedPhrase: phrase,
    aiInsight: localFootnote,
    aiEnhancement: localEnhancement,
    analysis: {
      whyThisPhrase: rant.whatHappened,
      contextSignals: rant.likelyNonSeriousExplanations.slice(0, 3),
      whatUserBrainAdded: [rant.whatYourBrainAdded],
      extraStoryAdded: [rant.whatYourBrainAdded],
      relationshipToDictionary: baseline.isFallback
        ? "adds_context"
        : "supports",
      contextConflict: false,
    },
  }
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

  const [input, setInput] = useState("")
  const [inputSource, setInputSource] = useState<InputSource>("typed")
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
  const screenshotUrlRef = useRef<string | null>(null)
  const requestIdRef = useRef(0)

  useEffect(() => {
    return () => {
      if (screenshotUrlRef.current) {
        URL.revokeObjectURL(screenshotUrlRef.current)
      }
    }
  }, [])

  const clearScreenshot = useCallback(() => {
    if (screenshotUrlRef.current) {
      URL.revokeObjectURL(screenshotUrlRef.current)
      screenshotUrlRef.current = null
    }

    setScreenshotFile(null)
    setScreenshotPreviewUrl(null)
  }, [])

  const translate = useCallback(
    async (
      text: string,
      options?: {
        source?: InputSource
        imageFile?: File | null
      }
    ) => {
      const source = options?.source ?? inputSource
      const imageFile = options?.imageFile ?? screenshotFile
      const trimmed = text.trim()

      if (!trimmed && !imageFile) {
        toast.error(genderConfig.emptyToastTitle, {
          description: "Type something, attach a screenshot, or use voice.",
        })
        return
      }

      const requestId = ++requestIdRef.current
      setIsTranslating(true)
      setIsFetchingAiInsight(false)
      setLoadingMessage(
        gender === "female"
          ? getRandomFemaleLoadingMessage()
          : getRandomLoadingMessage()
      )
      setResult(null)

      const direction = genderToDirection(gender)

      // Image-only (or image + text) needs the server for vision context.
      if (imageFile) {
        try {
          const formData = new FormData()
          if (trimmed) formData.append("text", trimmed)
          formData.append("image", imageFile)
          formData.append("direction", direction)
          formData.append("inputSource", trimmed ? "mixed" : source)
          formData.append("sarcasmLevel", String(sarcasmLevel))
          formData.append("gruntMode", String(gruntMode))

          const response = await fetch("/api/translate", {
            method: "POST",
            body: formData,
            signal: AbortSignal.timeout(45_000),
          })
          const data = (await response.json()) as TranslationResult & {
            error?: string
          }

          if (!response.ok) {
            throw new Error(data.error ?? "Translation failed.")
          }

          if (requestId !== requestIdRef.current) return

          if (data.extractedPhrase) {
            setInput(data.extractedPhrase)
          } else if (data.input) {
            setInput(data.input)
          }

          setResult(data)
        } catch (error) {
          if (requestId !== requestIdRef.current) return
          const message =
            error instanceof Error ? error.message : "Translation failed."
          toast.error("Could not translate that.", { description: message })
        } finally {
          if (requestId === requestIdRef.current) {
            setIsTranslating(false)
            setIsFetchingAiInsight(false)
          }
        }
        return
      }

      await new Promise((resolve) => setTimeout(resolve, translationDelayMs))

      if (requestId !== requestIdRef.current) return

      const localResult = buildLocalResult(
        trimmed,
        gender,
        sarcasmLevel,
        gruntMode
      )
      setResult(localResult)
      setIsTranslating(false)
      setIsFetchingAiInsight(true)

      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: trimmed,
            direction,
            inputSource: source,
            sarcasmLevel,
            gruntMode,
          }),
          signal: AbortSignal.timeout(25_000),
        })

        if (!response.ok) {
          throw new Error("AI translation request failed.")
        }

        const enhanced = (await response.json()) as TranslationResult

        if (requestId !== requestIdRef.current) return

        setResult((current) => {
          if (!current || current.input !== trimmed) {
            return current
          }

          // Dictionary card stays primary; AI only adds supporting fields.
          return {
            ...current,
            aiInsight: enhanced.aiInsight ?? current.aiInsight,
            aiEnhancement: enhanced.aiEnhancement ?? current.aiEnhancement,
            analysis: enhanced.analysis ?? current.analysis,
            extractedPhrase:
              enhanced.extractedPhrase ?? current.extractedPhrase,
            mode: enhanced.mode ?? current.mode,
          }
        })
      } catch {
        // Dictionary / local reply is already visible.
      } finally {
        if (requestId === requestIdRef.current) {
          setIsFetchingAiInsight(false)
        }
      }
    },
    [
      gender,
      genderConfig.emptyToastTitle,
      gruntMode,
      inputSource,
      sarcasmLevel,
      screenshotFile,
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
      setInputSource(screenshotFile ? "mixed" : "voice")
      await translate(data.text, {
        source: screenshotFile ? "mixed" : "voice",
      })
    },
    [screenshotFile, translate]
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

  const handleScreenshotChange = (file: File | null) => {
    if (!file) return

    const isSupportedType = ["image/jpeg", "image/png", "image/webp"].includes(
      file.type
    )

    if (!isSupportedType || file.size > 10 * 1024 * 1024) {
      toast.error("Choose a PNG, JPEG, or WebP screenshot up to 10 MB.")
      return
    }

    clearScreenshot()
    const previewUrl = URL.createObjectURL(file)
    screenshotUrlRef.current = previewUrl
    setScreenshotFile(file)
    setScreenshotPreviewUrl(previewUrl)
    setInputSource(input.trim() ? "mixed" : "typed")
    setResult(null)
  }

  const handleSubmit = () => {
    void translate(input, {
      source: screenshotFile ? "mixed" : inputSource,
      imageFile: screenshotFile,
    })
  }

  const handleSample = (phrase: string) => {
    setInput(phrase)
    setInputSource("typed")
    void translate(phrase, { source: "typed", imageFile: null })
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
      result.aiInsight ? `Footnote: ${result.aiInsight}` : null,
    ]
      .filter(Boolean)
      .join("\n")
    await navigator.clipboard.writeText(block)
    toast.success("Copied!")
  }

  const handleGenderChange = (nextGender: TranslatorGender) => {
    if (nextGender === gender) return
    stopSpeechPlayback()
    setGender(nextGender)
    setInput("")
    setInputSource("typed")
    setResult(null)
    setIsFetchingAiInsight(false)
    clearScreenshot()
  }

  const handleReset = () => {
    stopSpeechPlayback()
    setResult(null)
    setIsFetchingAiInsight(false)
    setInput("")
    setInputSource("typed")
    clearScreenshot()
  }

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
              Translating for
            </span>
            <div
              className="sliding-pill sliding-pill--glass relative flex rounded-full border border-white/12 bg-white/[0.07] p-0.5 shadow-sm backdrop-blur-xl"
              role="tablist"
              aria-label="Translation target receiver"
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
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
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

        <div className="mt-6 flex flex-col gap-6">
          <AdaptiveComposer
            value={input}
            onChange={(next) => {
              setInput(next)
              setInputSource(screenshotFile ? "mixed" : "typed")
            }}
            placeholder={genderConfig.typePlaceholder}
            ariaLabel={genderConfig.typeLabel}
            phrases={genderConfig.samplePhrases}
            disabled={isBusy}
            isSubmitting={isTranslating}
            screenshotPreviewUrl={screenshotPreviewUrl}
            screenshotFileName={screenshotFile?.name}
            onScreenshotChange={handleScreenshotChange}
            onRemoveScreenshot={clearScreenshot}
            recorderStatus={recorderStatus}
            durationMs={durationMs}
            waveformHistory={waveformHistory}
            liveLevels={liveLevels}
            isMicSupported={isMicSupported}
            micUnsupportedReason={micUnsupportedReason}
            onToggleRecording={() => void handleToggleRecording()}
            onSelectPreset={handleSample}
            onSubmit={handleSubmit}
          />

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
              >
                <TranslationResultCard
                  result={result}
                  subjectLabel={genderConfig.subjectLabel}
                  resultLabel={genderConfig.resultLabel}
                  isFetchingAnalysis={isFetchingAiInsight}
                  isSpeaking={isSpeaking}
                  onSpeak={() => void handleSpeakTranslation()}
                  onCopy={() => void copyResult()}
                  onReset={handleReset}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <footer className="text-center text-[11px] text-muted-foreground/80">
            Text, voice, or screenshot — one translator. Voice stays on-device
            until transcribed.
          </footer>
        </div>
      </div>
    </>
  )
}
