"use client"

import {
  useRef,
  type ChangeEvent,
  type KeyboardEvent,
} from "react"
import { ArrowRight, ImageUp, Mic, Sparkles } from "lucide-react"

import { AttachmentPreview } from "@/components/attachment-preview"
import { PresetChips } from "@/components/preset-chips"
import { VoiceRecorderState } from "@/components/voice-recorder-state"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getSecureMicUrl } from "@/lib/audio-capture-support"
import { cn } from "@/lib/utils"

type RecorderStatus = "idle" | "recording" | "processing"

type AdaptiveComposerProps = {
  value: string
  onChange: (value: string) => void
  placeholder: string
  ariaLabel: string
  phrases: readonly string[]
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
}

export const AdaptiveComposer = ({
  value,
  onChange,
  placeholder,
  ariaLabel,
  phrases,
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
  submitLabel = "Translate",
}: AdaptiveComposerProps) => {
  const screenshotInputRef = useRef<HTMLInputElement | null>(null)
  const isRecording =
    recorderStatus === "recording" || recorderStatus === "processing"
  const isBusy = disabled || isSubmitting || isRecording
  const canSubmit =
    !isBusy && (Boolean(value.trim()) || Boolean(screenshotPreviewUrl))

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

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "rounded-[1.75rem] border border-white/12 bg-white/[0.07] p-3 shadow-sm backdrop-blur-xl sm:p-4",
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
          <div className="space-y-3">
            {screenshotPreviewUrl && (
              <AttachmentPreview
                previewUrl={screenshotPreviewUrl}
                fileName={screenshotFileName ?? undefined}
                disabled={isBusy}
                onRemove={onRemoveScreenshot}
              />
            )}

            <Textarea
              aria-label={ariaLabel}
              placeholder={placeholder}
              value={value}
              onChange={(event) => onChange(event.target.value)}
              onKeyDown={handleKeyDown}
              rows={4}
              className="min-h-28 resize-none border-0 bg-transparent px-1 py-1 text-base text-foreground shadow-none placeholder:text-muted-foreground/65 focus-visible:ring-0"
              disabled={isBusy}
            />

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
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
                  className="size-10 rounded-full border border-white/12 bg-white/[0.08] text-white/80 hover:bg-white/14"
                  onClick={() => screenshotInputRef.current?.click()}
                  disabled={isBusy}
                  aria-label="Attach screenshot"
                >
                  <ImageUp className="size-4" aria-hidden />
                </Button>

                {isMicSupported ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="size-10 rounded-full border border-white/12 bg-white/[0.08] text-white/80 hover:bg-white/14"
                    onClick={onToggleRecording}
                    disabled={isBusy}
                    aria-label="Start voice input"
                  >
                    <Mic className="size-4" aria-hidden />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="size-10 rounded-full border border-white/12 bg-white/[0.05] text-white/40"
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
                    <Mic className="size-4" aria-hidden />
                  </Button>
                )}
              </div>

              <p className="hidden text-[10px] text-muted-foreground sm:block">
                ⌘/Ctrl + Enter
              </p>
            </div>
          </div>
        )}
      </div>

      {!isRecording && (
        <PresetChips
          phrases={phrases}
          disabled={isBusy}
          onSelect={onSelectPreset}
        />
      )}

      <Button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit}
        className="h-12 w-full rounded-full"
        size="lg"
      >
        <Sparkles aria-hidden />
        {submitLabel}
        <ArrowRight aria-hidden />
      </Button>
    </div>
  )
}
