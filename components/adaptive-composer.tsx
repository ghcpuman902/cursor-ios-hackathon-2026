"use client"

import {
  useRef,
  type ChangeEvent,
  type KeyboardEvent,
} from "react"
import { ImageUp, Mic, Send } from "lucide-react"

import { AttachmentPreview } from "@/components/attachment-preview"
import { PresetChips } from "@/components/preset-chips"
import { VoiceRecorderState } from "@/components/voice-recorder-state"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useCyclingPlaceholder } from "@/hooks/use-cycling-placeholder"
import { getSecureMicUrl } from "@/lib/audio-capture-support"
import { cn } from "@/lib/utils"

type RecorderStatus = "idle" | "recording" | "processing"

type AdaptiveComposerProps = {
  value: string
  onChange: (value: string) => void
  placeholder: string
  ariaLabel: string
  phrases: readonly string[]
  showPresets?: boolean
  useCyclingExamples?: boolean
  disabled?: boolean
  isSubmitting?: boolean
  screenshotPreviewUrl: string | null
  screenshotFileName?: string | null
  onScreenshotChange: (file: File | null) => void
  onRemoveScreenshot: () => void
  recorderStatus: RecorderStatus
  durationMs: number
  waveformHistory: number[]
  liveLevels: number[]
  isMicSupported: boolean
  micUnsupportedReason: string | null
  onToggleRecording: () => void
  onSelectPreset: (phrase: string) => void
  onSubmit: () => void
  submitLabel?: string
  theme?: "male-translator" | "female-translator"
}

export const AdaptiveComposer = ({
  value,
  onChange,
  placeholder,
  ariaLabel,
  phrases,
  showPresets = true,
  useCyclingExamples = false,
  disabled = false,
  isSubmitting = false,
  screenshotPreviewUrl,
  screenshotFileName,
  onScreenshotChange,
  onRemoveScreenshot,
  recorderStatus,
  durationMs,
  waveformHistory,
  liveLevels,
  isMicSupported,
  micUnsupportedReason,
  onToggleRecording,
  onSelectPreset,
  onSubmit,
  submitLabel = "Send",
  theme = "male-translator",
}: AdaptiveComposerProps) => {
  const screenshotInputRef = useRef<HTMLInputElement | null>(null)
  const isRecording =
    recorderStatus === "recording" || recorderStatus === "processing"
  const isBusy = disabled || isSubmitting || isRecording
  const canSubmit =
    !isBusy && (Boolean(value.trim()) || Boolean(screenshotPreviewUrl))
  const cyclingPlaceholder = useCyclingPlaceholder(
    phrases,
    useCyclingExamples && !value.trim() && !isRecording
  )
  const resolvedPlaceholder = cyclingPlaceholder ?? placeholder

  const handleScreenshotPick = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    onScreenshotChange(file)
    event.target.value = ""
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      if (canSubmit) onSubmit()
    }
  }

  const floatingActionClass =
    "translator-control size-8 shrink-0 rounded-full border text-foreground/85 backdrop-blur-md"

  const renderMicButton = (floating = false) => {
    const buttonClass = floating
      ? floatingActionClass
      : "translator-control size-11 shrink-0 rounded-full border text-foreground/80"

    if (!isMicSupported) {
      return (
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className={cn(
            buttonClass,
            "text-foreground/40"
          )}
          disabled
          aria-label={
            micUnsupportedReason === "insecure-context"
              ? `Microphone needs HTTPS. Try ${getSecureMicUrl()}`
              : "Microphone unavailable"
          }
          title={
            micUnsupportedReason === "insecure-context"
              ? `Open ${getSecureMicUrl()} for mic access`
              : "Microphone unavailable in this browser"
          }
        >
          <Mic className="size-3.5" aria-hidden />
        </Button>
      )
    }

    return (
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className={buttonClass}
        onClick={onToggleRecording}
        disabled={isBusy}
        aria-label="Start voice input"
      >
        <Mic className={floating ? "size-3.5" : "size-4"} aria-hidden />
      </Button>
    )
  }

  const renderScreenshotButton = (floating = false) => (
    <>
      <input
        ref={screenshotInputRef}
        id="composer-screenshot"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={handleScreenshotPick}
        disabled={isBusy}
      />
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className={cn(
          floating
            ? floatingActionClass
            : "translator-control size-10 rounded-full border text-foreground/80"
        )}
        onClick={() => screenshotInputRef.current?.click()}
        disabled={isBusy}
        aria-label="Attach screenshot"
      >
        <ImageUp className={floating ? "size-3.5" : "size-4"} aria-hidden />
      </Button>
    </>
  )

  return (
    <div className="space-y-2 sm:space-y-3">
      {showPresets && !isRecording && (
        <PresetChips
          phrases={phrases}
          disabled={isBusy}
          onSelect={onSelectPreset}
          theme={theme}
        />
      )}

      <div
        className={cn(
          "translator-surface rounded-2xl border p-2.5 backdrop-blur-xl sm:rounded-[1.75rem] sm:p-4",
          isRecording && "ring-1 ring-rose-400/30"
        )}
      >
        {isRecording ? (
          <VoiceRecorderState
            durationMs={durationMs}
            waveformHistory={waveformHistory}
            liveLevels={liveLevels}
            isProcessing={recorderStatus === "processing"}
            onStop={onToggleRecording}
          />
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {screenshotPreviewUrl && (
              <AttachmentPreview
                previewUrl={screenshotPreviewUrl}
                fileName={screenshotFileName ?? undefined}
                disabled={isBusy}
                onRemove={onRemoveScreenshot}
              />
            )}

            <div className="relative min-h-14 sm:static sm:min-h-0">
              <Textarea
                aria-label={ariaLabel}
                placeholder={resolvedPlaceholder}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                className="min-h-14 resize-none rounded-xl border-0 bg-transparent p-0 pb-9 text-base leading-snug text-foreground shadow-none placeholder:text-muted-foreground/65 focus-visible:ring-0 sm:min-h-24 sm:rounded-none sm:pb-1 sm:py-1"
                disabled={isBusy}
              />

              <div className="absolute bottom-0 left-0 z-10 sm:hidden">
                {renderScreenshotButton(true)}
              </div>
              <div className="absolute right-0 bottom-0 z-10 sm:hidden">
                {renderMicButton(true)}
              </div>
            </div>

            <div className="hidden items-end justify-between gap-3 sm:flex">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                {renderScreenshotButton()}
                <p className="hidden min-w-0 truncate text-[10px] text-muted-foreground sm:block">
                  ⌘/Ctrl + Enter
                </p>
              </div>

              {renderMicButton()}
            </div>
          </div>
        )}
      </div>

      <Button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit}
        className="h-10 w-full rounded-full border border-primary-foreground/10 bg-primary/85 backdrop-blur-sm hover:bg-primary/90 disabled:bg-primary/30 disabled:text-primary-foreground/45 disabled:opacity-100 sm:h-12"
        size="lg"
      >
        <Send aria-hidden />
        {submitLabel}
      </Button>
    </div>
  )
}
