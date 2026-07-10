"use client"

import { Clock } from "lucide-react"

import { GlassPanel } from "@/components/glass-panel"
import { formatBroTimeSensitive } from "@/lib/bro-format"
import { formatHerTimeSensitive } from "@/lib/her-format"

type TimeSensitiveBubbleProps = {
  text: string
  isLoading?: boolean
  theme?: "male-translator" | "female-translator"
}

export const TimeSensitiveBubble = ({
  text,
  isLoading = false,
  theme = "female-translator",
}: TimeSensitiveBubbleProps) => {
  const isBro = theme === "female-translator"
  const displayText = isBro
    ? formatBroTimeSensitive(text)
    : formatHerTimeSensitive(text)

  return (
    <GlassPanel
      variant="subtle"
      className="rounded-3xl rounded-bl-md px-4 py-3 text-sm"
    >
      <p className="mb-1 flex items-center gap-1 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
        <Clock className="size-3" aria-hidden />
        {isBro ? "time check" : "Timing"}
      </p>
      {isLoading ? (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          {displayText ? (
            <>
              <span className="text-foreground/80">{displayText}</span>
              <span className="text-xs">updating…</span>
            </>
          ) : isBro ? (
            "checking timing…"
          ) : (
            "Checking the soft timing…"
          )}
        </p>
      ) : (
        <p className="text-sm leading-relaxed text-foreground/80">
          {displayText}
        </p>
      )}
    </GlassPanel>
  )
}
