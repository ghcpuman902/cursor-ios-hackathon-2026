"use client"

import { Copy, Play, RefreshCw, Sparkles } from "lucide-react"

import { GlassPanel } from "@/components/glass-panel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RISK_LABELS } from "@/lib/translations"
import type { TranslationResult } from "@/lib/translator"

type TranslationResultCardProps = {
  result: TranslationResult
  resultLabel: string
  isFetchingAnalysis?: boolean
  isSpeaking?: boolean
  theme?: "male-translator" | "female-translator"
  onSpeak: () => void
  onCopy: () => void
}

export const TranslationResultCard = ({
  result,
  resultLabel,
  isFetchingAnalysis = false,
  isSpeaking = false,
  theme = "male-translator",
  onSpeak,
  onCopy,
}: TranslationResultCardProps) => {
  const displayPhrase = result.extractedPhrase ?? result.input
  const showLongContext = result.mode === "long_context_translation"
  const analysis = result.analysis
  const isFemaleTranslator = theme === "female-translator"
  const labels = isFemaleTranslator
    ? {
        theory: "Mission intel",
        reply: "Safe play",
        analysis: "Tactical read",
        loading: "Reading the quest log…",
        refining: "Updating the battle plan…",
      }
    : {
        theory: "Today's theory",
        reply: "Lowest-risk reply",
        analysis: "Analysis",
        loading: "Reading the soft context…",
        refining: "Refining…",
      }

  return (
    <div className="w-full max-w-[88%]">
      <GlassPanel
        variant="strong"
        className="rounded-3xl rounded-br-md px-4 py-4 text-sm"
      >
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            {resultLabel}
          </p>
          <Badge className="h-5 rounded-full border-border/70 bg-secondary px-2 text-[10px] text-secondary-foreground hover:bg-secondary">
            {RISK_LABELS[result.riskLevel]}
          </Badge>
          {showLongContext && result.input !== displayPhrase && (
            <Badge
              variant="outline"
              className="translator-control h-5 rounded-full border px-2 text-[10px] text-muted-foreground"
            >
              From a longer rant
            </Badge>
          )}
        </div>

        <p className="text-sm font-semibold text-foreground">
          {result.headline}
        </p>
        <p className="mt-2 text-base leading-relaxed font-medium text-foreground">
          &ldquo;{result.comicTranslation}&rdquo;
        </p>

        <div className="mt-3 space-y-2 border-t border-border/70 pt-3 text-sm leading-relaxed text-foreground/80">
          <p>
            <span className="font-medium text-foreground/90">
              {labels.theory}:{" "}
            </span>
            {result.possibleActualMeaning}
          </p>
          <p>
            <span className="font-medium text-foreground/90">
              {labels.reply}:{" "}
            </span>
            {result.lowestRiskReply}
          </p>
          <p className="text-foreground/70">{result.tinyWholesomeNudge}</p>
        </div>

        {(analysis || isFetchingAnalysis || result.aiInsight) && (
          <div className="mt-3 space-y-2 border-t border-border/70 pt-3">
            <p className="mb-1 flex items-center gap-1 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              <Sparkles className="size-3" aria-hidden />
              {labels.analysis}
            </p>

            {isFetchingAnalysis && !analysis && !result.aiInsight && (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="size-3.5 animate-spin" aria-hidden />
                {labels.loading}
              </p>
            )}

            {(analysis?.contextConflict ||
              result.aiEnhancement?.contextConflict) && (
              <p className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm leading-relaxed text-foreground/85">
                Context caveat: the thread or rant may soften or challenge
                today&apos;s dictionary reading — card above stays primary.
              </p>
            )}

            {analysis?.whyThisPhrase && (
              <p className="text-sm leading-relaxed text-foreground/80">
                {analysis.whyThisPhrase}
              </p>
            )}

            {analysis?.contextSignals && analysis.contextSignals.length > 0 && (
              <ul className="list-disc space-y-1 pl-4 text-sm text-foreground/75">
                {analysis.contextSignals.map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
            )}

            {(analysis?.extraStoryAdded ?? analysis?.whatUserBrainAdded) &&
              (analysis?.extraStoryAdded ?? analysis?.whatUserBrainAdded)!
                .length > 0 && (
                <div className="space-y-1">
                  <p className="text-[11px] font-medium text-foreground/70">
                    What your brain may have added
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

            {analysis?.screenshotNotes &&
              analysis.screenshotNotes.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[11px] font-medium text-foreground/70">
                    Screenshot notes
                  </p>
                  <ul className="list-disc space-y-1 pl-4 text-sm text-foreground/75">
                    {analysis.screenshotNotes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}

            {result.aiInsight && (
              <p className="text-sm leading-relaxed text-foreground/80">
                {result.aiInsight}
              </p>
            )}

            {isFetchingAnalysis && (analysis || result.aiInsight) && (
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <RefreshCw className="size-3 animate-spin" aria-hidden />
                {labels.refining}
              </p>
            )}
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            size="sm"
            className="h-8 rounded-full"
            onClick={onSpeak}
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
            onClick={onCopy}
          >
            <Copy aria-hidden />
            Copy
          </Button>
        </div>
      </GlassPanel>
    </div>
  )
}
