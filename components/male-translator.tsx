"use client"

import Link from "next/link"
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { MessageSquarePlus } from "lucide-react"
import { toast } from "sonner"

import { AdaptiveComposer } from "@/components/adaptive-composer"
import { ChatTranscript } from "@/components/chat-transcript"
import { MemeOverloadBackground } from "@/components/meme-overload-background"
import { ProgressiveBlur } from "@/components/progressive-blur"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAudioRecorder } from "@/hooks/use-audio-recorder"
import { usePersistedChatHistory } from "@/hooks/use-persisted-chat-history"
import {
  createPendingTurn,
  hasConversation,
  type InputSource,
} from "@/lib/chat-history"
import {
  extractPhraseHeuristic,
  resolvePipelineMode,
} from "@/lib/input-classifier"
import { deescalateRant } from "@/lib/rant"
import { FEMALE_SAMPLE_PHRASES, MALE_SAMPLE_PHRASES } from "@/lib/translations"
import { TRANSLATOR_PATHS } from "@/lib/translator-routes"
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
    appName: "Male Translator™",
    theme: "male-translator",
    audienceLabel: "Female-facing translator",
    submitLabel: "Decode the signal",
    emptyThreadCopy:
      "Paste his message, drop a screenshot, or use the mic. We’ll translate the signal without inventing a whole saga.",
    subjectLabel: "He said",
    resultLabel: "For you (her read)",
    typeLabel: "Paste what he said — or rant, we'll find the phrase",
    typePlaceholder: `e.g. "k", "I'm almost there", or a longer vent…`,
    emptyToastTitle: "He said nothing. Tiny omen: silence.",
    transcribeLoading: "Reading the soft weather…",
    transcribeError: "Could not read that omen.",
    samplePhrases: MALE_SAMPLE_PHRASES,
  },
  female: {
    appName: "Female Translator™",
    theme: "female-translator",
    audienceLabel: "Male-facing translator",
    submitLabel: "Decode the quest",
    emptyThreadCopy:
      "Drop the message, screenshot, or voice note. We’ll check the quest log before you panic-text.",
    subjectLabel: "She said",
    resultLabel: "For you (his read)",
    typeLabel: "Paste what she said — or rant, we'll find the phrase",
    typePlaceholder: `e.g. "I'm fine", "Do whatever you want", or a longer vent…`,
    emptyToastTitle: "She said nothing. Suspicious side quest?",
    transcribeLoading: "Scanning for quest markers…",
    transcribeError: "Could not decode that quest.",
    samplePhrases: FEMALE_SAMPLE_PHRASES,
  },
} as const

type MaleTranslatorProps = {
  gender: TranslatorGender
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

const MALE_BACKGROUND_BLOBS: BackgroundBlob[] = [
  {
    className: "absolute -top-32 -left-28 size-[28rem]",
    colorClass: "gender-blob-male-blue",
    drift: { x: [0, 28, 10, -18, 0], y: [0, 18, 34, 12, 0] },
    cycleDuration: 18,
  },
  {
    className: "absolute top-[22%] -right-36 size-[32rem]",
    colorClass: "gender-blob-male-pink",
    drift: { x: [0, -34, 8, 16, 0], y: [0, 24, -14, 8, 0] },
    cycleDuration: 24,
  },
  {
    className: "absolute -bottom-44 left-[12%] size-[34rem]",
    colorClass: "gender-blob-male-indigo",
    drift: { x: [0, 36, -12, -24, 0], y: [0, -20, 8, 16, 0] },
    cycleDuration: 30,
  },
  {
    className: "absolute top-[58%] right-[8%] size-56",
    colorClass: "gender-blob-male-red",
    drift: { x: [0, -14, 12, -6, 0], y: [0, -10, 14, 4, 0] },
    cycleDuration: 38,
  },
]

const FEMALE_BACKGROUND_BLOBS: BackgroundBlob[] = [
  {
    className: "absolute -top-28 -left-24 size-[30rem]",
    colorClass: "gender-blob-female-soft-pink",
    drift: { x: [0, 32, 8, -22, 0], y: [0, 20, 38, 12, 0] },
    cycleDuration: 12,
  },
  {
    className: "absolute top-[26%] -right-32 size-[30rem]",
    colorClass: "gender-blob-female-fuchsia",
    drift: { x: [0, -40, 10, 22, 0], y: [0, 28, -16, 8, 0] },
    cycleDuration: 15,
  },
  {
    className: "absolute -bottom-40 left-[20%] size-[32rem]",
    colorClass: "gender-blob-female-hot-pink",
    drift: { x: [0, 42, -18, -26, 0], y: [0, -22, 8, 16, 0] },
    cycleDuration: 19,
  },
  {
    className: "absolute top-[12%] left-[42%] size-48",
    colorClass: "gender-blob-female-magenta",
    drift: { x: [0, 16, -18, 4, 0], y: [0, 12, -10, 6, 0] },
    cycleDuration: 24,
  },
]

function DynamicGenderBackground({ gender }: { gender: TranslatorGender }) {
  const reduceMotion = useReducedMotion()
  const blobs =
    gender === "male" ? MALE_BACKGROUND_BLOBS : FEMALE_BACKGROUND_BLOBS

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[linear-gradient(160deg,#14234b_0%,#1c1648_32%,#3a1848_58%,#2a1038_78%,#0c1228_100%)]"
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
                  : { x: blob.drift.x, y: blob.drift.y }
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
  // Keep in sync with attachFootnoteOrFallback in translate-pipeline —
  // mismatched types make the footnote jump bubbles and look like it vanished.
  const localEnhancement = {
    type: baseline.isFallback
      ? ("alternate_reading" as const)
      : ("timing_check" as const),
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
  gender,
  sarcasmLevel,
  gruntMode,
  translationDelayMs,
}: MaleTranslatorProps) {
  const genderConfig = GENDER_CONFIG[gender]

  const {
    currentTurns,
    isHydrated,
    appendTurn,
    updateTurn,
    clearCurrentThread,
  } = usePersistedChatHistory(gender)

  const [input, setInput] = useState("")
  const [inputSource, setInputSource] = useState<InputSource>("typed")
  const [isTranslating, setIsTranslating] = useState(false)
  const [speakingTurnId, setSpeakingTurnId] = useState<string | null>(null)
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null)
  const [screenshotPreviewUrl, setScreenshotPreviewUrl] = useState<
    string | null
  >(null)
  const [composerInset, setComposerInset] = useState(320)
  const [headerInset, setHeaderInset] = useState(132)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const speechUrlRef = useRef<string | null>(null)
  const screenshotUrlRef = useRef<string | null>(null)
  const composerRef = useRef<HTMLDivElement | null>(null)
  const headerRef = useRef<HTMLElement | null>(null)
  const requestIdRef = useRef(0)
  const activeTurnIdRef = useRef<string | null>(null)

  const conversationStarted = hasConversation(currentTurns)

  useEffect(() => {
    return () => {
      if (screenshotUrlRef.current) {
        URL.revokeObjectURL(screenshotUrlRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const composer = composerRef.current
    if (!composer) return

    const updateComposerInset = () => {
      setComposerInset(Math.ceil(composer.getBoundingClientRect().height))
    }
    const resizeObserver = new ResizeObserver(updateComposerInset)

    updateComposerInset()
    resizeObserver.observe(composer)

    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    const updateHeaderInset = () => {
      setHeaderInset(Math.ceil(header.getBoundingClientRect().height))
    }
    const resizeObserver = new ResizeObserver(updateHeaderInset)

    updateHeaderInset()
    resizeObserver.observe(header)

    return () => resizeObserver.disconnect()
  }, [])

  const clearScreenshot = useCallback(() => {
    if (screenshotUrlRef.current) {
      URL.revokeObjectURL(screenshotUrlRef.current)
      screenshotUrlRef.current = null
    }

    setScreenshotFile(null)
    setScreenshotPreviewUrl(null)
  }, [])

  const cancelInFlightWork = useCallback(() => {
    requestIdRef.current += 1
    activeTurnIdRef.current = null
    setIsTranslating(false)
  }, [])

  const translateForTurn = useCallback(
    async (
      turnId: string,
      text: string,
      options?: {
        source?: InputSource
        imageFile?: File | null
      }
    ) => {
      const source = options?.source ?? inputSource
      const imageFile = options?.imageFile ?? screenshotFile
      const trimmed = text.trim()
      const requestGender = gender

      if (!trimmed && !imageFile) {
        toast.error(genderConfig.emptyToastTitle, {
          description: "Type something, attach a screenshot, or use voice.",
        })
        return
      }

      const requestId = ++requestIdRef.current
      activeTurnIdRef.current = turnId
      setIsTranslating(true)

      const loadingMessage =
        requestGender === "female"
          ? getRandomFemaleLoadingMessage()
          : getRandomLoadingMessage()

      updateTurn(requestGender, turnId, (turn) => ({
        ...turn,
        status: "translating",
        loadingMessage,
        isFetchingAiInsight: false,
      }))

      const direction = genderToDirection(requestGender)

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

          updateTurn(requestGender, turnId, (turn) => ({
            ...turn,
            input: data.extractedPhrase ?? data.input ?? turn.input,
            status: "complete",
            result: data,
            isFetchingAiInsight: false,
            loadingMessage: undefined,
          }))
        } catch (error) {
          if (requestId !== requestIdRef.current) return
          const message =
            error instanceof Error ? error.message : "Translation failed."
          updateTurn(requestGender, turnId, (turn) => ({
            ...turn,
            status: "error",
            errorMessage: message,
            isFetchingAiInsight: false,
            loadingMessage: undefined,
          }))
          toast.error("Could not translate that.", { description: message })
        } finally {
          if (requestId === requestIdRef.current) {
            setIsTranslating(false)
            activeTurnIdRef.current = null
          }
        }
        return
      }

      await new Promise((resolve) => setTimeout(resolve, translationDelayMs))

      if (requestId !== requestIdRef.current) return

      const localResult = buildLocalResult(
        trimmed,
        requestGender,
        sarcasmLevel,
        gruntMode
      )

      updateTurn(requestGender, turnId, (turn) => ({
        ...turn,
        status: "complete",
        result: localResult,
        isFetchingAiInsight: true,
        loadingMessage: undefined,
      }))
      setIsTranslating(false)

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

        updateTurn(requestGender, turnId, (turn) => {
          if (!turn.result || turn.result.input !== trimmed) {
            return turn
          }

          const nextInsight =
            enhanced.aiInsight?.trim() || turn.result.aiInsight
          const nextEnhancement =
            enhanced.aiEnhancement ?? turn.result.aiEnhancement
          const nextAnalysis = enhanced.analysis?.whyThisPhrase
            ? enhanced.analysis
            : (enhanced.analysis?.screenshotNotes?.length ?? 0) > 0
              ? enhanced.analysis
              : (turn.result.analysis ?? enhanced.analysis)

          return {
            ...turn,
            result: {
              ...turn.result,
              aiInsight: nextInsight,
              aiEnhancement: nextEnhancement
                ? {
                    ...nextEnhancement,
                    text: nextEnhancement.text?.trim() || nextInsight || "",
                  }
                : turn.result.aiEnhancement,
              analysis: nextAnalysis,
              extractedPhrase:
                enhanced.extractedPhrase ?? turn.result.extractedPhrase,
              mode: enhanced.mode ?? turn.result.mode,
            },
            isFetchingAiInsight: false,
          }
        })
      } catch {
        if (requestId === requestIdRef.current) {
          updateTurn(requestGender, turnId, (turn) => ({
            ...turn,
            isFetchingAiInsight: false,
          }))
        }
      } finally {
        if (requestId === requestIdRef.current) {
          activeTurnIdRef.current = null
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
      updateTurn,
    ]
  )

  const beginTranslation = useCallback(
    (
      text: string,
      options?: {
        source?: InputSource
        imageFile?: File | null
        clearComposer?: boolean
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

      const turn = createPendingTurn(trimmed || "Screenshot attached", source)
      appendTurn(gender, turn)

      if (options?.clearComposer !== false) {
        setInput("")
        setInputSource("typed")
        clearScreenshot()
      }

      void translateForTurn(turn.id, trimmed, { source, imageFile })
    },
    [
      appendTurn,
      clearScreenshot,
      gender,
      genderConfig.emptyToastTitle,
      inputSource,
      screenshotFile,
      translateForTurn,
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

      beginTranslation(data.text, {
        source: screenshotFile ? "mixed" : "voice",
        imageFile: screenshotFile,
        clearComposer: true,
      })
    },
    [beginTranslation, screenshotFile]
  )

  const handleRecordingComplete = useCallback(
    async (blob: Blob) => {
      try {
        await transcribeAudio(blob)
        toast.success("Voice note transcribed!")
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Transcription failed."
        toast.error(genderConfig.transcribeError, { description: message })
      }
    },
    [genderConfig.transcribeError, transcribeAudio]
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
  }

  const handleSubmit = () => {
    beginTranslation(input, {
      source: screenshotFile ? "mixed" : inputSource,
      imageFile: screenshotFile,
    })
  }

  const handleSample = (phrase: string) => {
    setInput(phrase)
    setInputSource("typed")
    beginTranslation(phrase, { source: "typed", imageFile: null })
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

    setSpeakingTurnId(null)
  }, [])

  const previousGenderRef = useRef(gender)

  useEffect(() => {
    if (previousGenderRef.current === gender) return

    previousGenderRef.current = gender
    stopSpeechPlayback()
    cancelInFlightWork()
    setInput("")
    setInputSource("typed")
    clearScreenshot()
  }, [gender, cancelInFlightWork, clearScreenshot, stopSpeechPlayback])

  const handleSpeakTranslation = async (
    turnId: string,
    result: TranslationResult
  ) => {
    if (speakingTurnId === turnId) return

    stopSpeechPlayback()
    setSpeakingTurnId(turnId)

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

  const copyResult = async (result: TranslationResult) => {
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

  const handleNewChat = () => {
    stopSpeechPlayback()
    cancelInFlightWork()
    clearCurrentThread(gender)
    setInput("")
    setInputSource("typed")
    clearScreenshot()
  }

  const isRecorderBusy =
    recorderStatus === "recording" || recorderStatus === "processing"
  const isBusy = isTranslating || isRecorderBusy

  return (
    <>
      {gender === "male" ? (
        <DynamicGenderBackground gender={gender} />
      ) : (
        <MemeOverloadBackground />
      )}

      <div
        className="translator-theme relative z-10 mx-auto flex h-full min-h-0 w-full max-w-md flex-col"
        data-translator-theme={genderConfig.theme}
        style={
          {
            "--composer-inset": `${composerInset}px`,
            "--header-inset": `${headerInset}px`,
          } as CSSProperties
        }
      >
        <ProgressiveBlur
          direction="top"
          blurLayers={5}
          blurIntensity={0.1}
          className="fixed inset-x-0 top-0 z-10 w-screen"
          style={{ height: `${headerInset + 44}px` }}
        />

        <header
          ref={headerRef}
          className="absolute inset-x-0 top-0 z-20 space-y-3 px-1 pt-2 text-center sm:pt-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col items-start gap-1">
              {conversationStarted && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 rounded-full px-2.5 text-xs text-muted-foreground hover:text-foreground"
                  onClick={handleNewChat}
                  disabled={isBusy}
                  aria-label="Start a new chat"
                >
                  <MessageSquarePlus className="size-3.5" aria-hidden />
                  New chat
                </Button>
              )}
            </div>

            <div className="flex min-w-0 flex-col items-end gap-2">
              <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                {genderConfig.audienceLabel}
              </span>
              <div
                className="sliding-pill sliding-pill--glass translator-surface relative flex rounded-full border p-0.5 backdrop-blur-xl"
                role="tablist"
                aria-label="Translator product mode"
              >
                {(["male", "female"] as const).map((mode) => (
                  <Link
                    key={mode}
                    href={TRANSLATOR_PATHS[mode]}
                    scroll={false}
                    role="tab"
                    data-slot="pill-trigger"
                    data-active={gender === mode ? "" : undefined}
                    aria-selected={gender === mode}
                    aria-disabled={isBusy}
                    tabIndex={isBusy ? -1 : undefined}
                    onClick={(event) => {
                      if (isBusy) event.preventDefault()
                    }}
                    className={cn(
                      "relative z-1 inline-flex items-center gap-0.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors sm:gap-1 sm:px-3",
                      isBusy && "pointer-events-none opacity-50"
                    )}
                  >
                    <span>
                      {mode === "male" ? "Male Translator™" : "Female Translator™"}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h1 className="translator-title text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {genderConfig.appName}
            </h1>
          </div>

          {gruntMode && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge
                variant="outline"
                className="translator-control rounded-full border text-foreground/70 backdrop-blur-xl"
              >
                {gender === "male" ? "Extra sparkle" : "Bro mode: activated"}
              </Badge>
            </div>
          )}
        </header>

        <div className="relative min-h-0 flex-1">
          {isHydrated ? (
            <ChatTranscript
              turns={currentTurns}
              resultLabel={genderConfig.resultLabel}
              theme={genderConfig.theme}
              emptyThreadCopy={genderConfig.emptyThreadCopy}
              speakingTurnId={speakingTurnId}
              onSpeak={(turnId, result) =>
                void handleSpeakTranslation(turnId, result)
              }
              onCopy={(result) => void copyResult(result)}
              className="absolute inset-0 min-h-0"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-5 animate-spin rounded-full border-2 border-primary/15 border-t-primary/70" />
            </div>
          )}

          <div
            ref={composerRef}
            className="absolute inset-x-0 bottom-0 z-20 shrink-0 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-3 sm:pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          >
            <AdaptiveComposer
              value={input}
              onChange={(next) => {
                setInput(next)
                setInputSource(screenshotFile ? "mixed" : "typed")
              }}
              placeholder={genderConfig.typePlaceholder}
              ariaLabel={genderConfig.typeLabel}
              phrases={genderConfig.samplePhrases}
              showPresets={!conversationStarted}
              useCyclingExamples={conversationStarted}
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
              submitLabel={genderConfig.submitLabel}
              theme={genderConfig.theme}
            />

            <footer className="mt-2 space-y-1 text-center text-[11px] text-muted-foreground/80">
              <p>
                Entertainment only — not professional advice.{" "}
                <Link
                  href="/disclaimer"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  Disclaimer
                </Link>
                {" · "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  Privacy
                </Link>
                {" · "}
                <Link
                  href="/terms"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  Terms
                </Link>
              </p>
              <p>
                Made for Cursor iOS hackathon, 9 July 2026, by{" "}
                <a
                  href="https://github.com/hcnc101"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  hcnc101
                </a>{" "}
                &{" "}
                <a
                  href="https://github.com/ghcpuman902/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  ghcpuman902
                </a>
              </p>
            </footer>
          </div>
        </div>
      </div>
    </>
  )
}
