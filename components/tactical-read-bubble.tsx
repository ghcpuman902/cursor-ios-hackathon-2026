"use client"

import { RefreshCw, Sparkles } from "lucide-react"

import { GlassPanel } from "@/components/glass-panel"
import type { TranslationAnalysis } from "@/lib/translator"

type TacticalReadBubbleProps = {
  analysis?: TranslationAnalysis
  aiInsight?: string
  contextConflict?: boolean
  isFetchingAnalysis?: boolean
  loadingLabel?: string
  refiningLabel?: string
  title?: string
}

export const TacticalReadBubble = ({
  analysis,
  aiInsight,
  contextConflict = false,
  isFetchingAnalysis = false,
  loadingLabel = "reading the room…",
  refiningLabel = "updating…",
  title = "extra context",
}: TacticalReadBubbleProps) => {
  const hasContent =
    Boolean(analysis) ||
    Boolean(aiInsight) ||
    contextConflict ||
    isFetchingAnalysis

  if (!hasContent) return null

  return (
    <GlassPanel
      variant="subtle"
      className="rounded-3xl rounded-bl-md px-4 py-3 text-sm"
    >
      <p className="mb-2 flex items-center gap-1 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
        <Sparkles className="size-3" aria-hidden />
        {title}
      </p>

      {isFetchingAnalysis && !analysis && !aiInsight && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <RefreshCw className="size-3.5 animate-spin" aria-hidden />
          {loadingLabel}
        </p>
      )}

      {contextConflict && (
        <p className="mb-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm leading-relaxed text-foreground/85">
          heads up — the full thread might soften or change this read. card
          above still stands.
        </p>
      )}

      {analysis?.whyThisPhrase && (
        <p className="text-sm leading-relaxed text-foreground/80">
          {analysis.whyThisPhrase}
        </p>
      )}

      {analysis?.contextSignals && analysis.contextSignals.length > 0 && (
        <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-foreground/75">
          {analysis.contextSignals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>
      )}

      {(analysis?.extraStoryAdded ?? analysis?.whatUserBrainAdded) &&
        (analysis?.extraStoryAdded ?? analysis?.whatUserBrainAdded)!.length >
          0 && (
          <div className="mt-2 space-y-1">
            <p className="text-[11px] font-medium text-foreground/70">
              what your brain might&apos;ve added
            </p>
            <ul className="list-disc space-y-1 pl-4 text-sm text-foreground/75">
              {(
                analysis?.extraStoryAdded ??
                analysis?.whatUserBrainAdded ??
                []
              ).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}

      {analysis?.screenshotNotes && analysis.screenshotNotes.length > 0 && (
        <div className="mt-2 space-y-1">
          <p className="text-[11px] font-medium text-foreground/70">
            from the screenshot
          </p>
          <ul className="list-disc space-y-1 pl-4 text-sm text-foreground/75">
            {analysis.screenshotNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {aiInsight && (
        <p className="mt-2 text-sm leading-relaxed text-foreground/80">
          {aiInsight}
        </p>
      )}

      {isFetchingAnalysis && (analysis || aiInsight) && (
        <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <RefreshCw className="size-3 animate-spin" aria-hidden />
          {refiningLabel}
        </p>
      )}
    </GlassPanel>
  )
}
