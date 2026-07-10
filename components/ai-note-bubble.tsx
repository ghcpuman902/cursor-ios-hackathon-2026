"use client"

import { RefreshCw, Sparkles } from "lucide-react"

import { GlassPanel } from "@/components/glass-panel"

type AiNoteBubbleProps = {
  text?: string
  isLoading?: boolean
  theme?: "male-translator" | "female-translator"
}

export const AiNoteBubble = ({
  text,
  isLoading = false,
  theme = "male-translator",
}: AiNoteBubbleProps) => {
  const isBro = theme === "female-translator"
  const trimmed = text?.trim()

  if (!trimmed && !isLoading) return null

  return (
    <GlassPanel
      variant="subtle"
      className="rounded-3xl rounded-bl-md px-4 py-3 text-sm"
    >
      <p className="mb-1 flex items-center gap-1 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
        <Sparkles className="size-3" aria-hidden />
        {isBro ? "ai note" : "AI note"}
      </p>
      {isLoading && !trimmed ? (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <RefreshCw className="size-3.5 animate-spin" aria-hidden />
          {isBro ? "asking the lads…" : "Reading the soft context…"}
        </p>
      ) : (
        <>
          {trimmed && (
            <p className="text-sm leading-relaxed text-foreground/80">
              {trimmed}
            </p>
          )}
          {isLoading && trimmed && (
            <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <RefreshCw className="size-3 animate-spin" aria-hidden />
              {isBro ? "updating…" : "Refining…"}
            </p>
          )}
        </>
      )}
    </GlassPanel>
  )
}
