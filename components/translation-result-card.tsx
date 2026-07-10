"use client"

import { Copy, Play, RefreshCw, Sparkles } from "lucide-react"

import { GlassPanel } from "@/components/glass-panel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RISK_LABELS } from "@/lib/translations"
import type { TranslationResult } from "@/lib/translator"

type TranslationResultCardProps = {
  result: TranslationResult
  subjectLabel: string
  resultLabel: string
  isFetchingAnalysis?: boolean
  isSpeaking?: boolean
  onSpeak: () => void
  onCopy: () => void
  onReset: () => void
}

export const TranslationResultCard = ({
  result,
  subjectLabel,
  resultLabel,
  isFetchingAnalysis = false,
  isSpeaking = false,
  onSpeak,
  onCopy,
  onReset,
}: TranslationResultCardProps) => {
  const displayPhrase = result.extractedPhrase ?? result.input
  const showLongContext = result.mode === "long_context_translation"
  const analysis = result.analysis

  return (
    <div className="space-y-3">
      <div className="flex justify-start">
        <div className="max-w-[88%] rounded-3xl rounded-bl-md border border-white/12 bg-white/[0.08] px-4 py-3 text-sm text-foreground/80 shadow-sm backdrop-blur-xl">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            {showLongContext ? "Extracted phrase" : subjectLabel}
          </p>
          <p className="mt-1 text-foreground/90">
            &ldquo;{displayPhrase}&rdquo;
          </p>
          {showLongContext && result.input !== displayPhrase && (
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              From a longer rant — we translated the bit that probably matters.
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <GlassPanel
          variant="strong"
          className="max-w-[88%] rounded-3xl rounded-br-md px-4 py-4 text-sm"
        >
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              {resultLabel}
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
            <p className="text-foreground/70">{result.tinyWholesomeNudge}</p>
          </div>

          {(analysis || isFetchingAnalysis || result.aiInsight) && (
            <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
              <p className="mb-1 flex items-center gap-1 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                <Sparkles className="size-3" aria-hidden />
                Analysis
              </p>

              {isFetchingAnalysis && !analysis && !result.aiInsight && (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RefreshCw className="size-3.5 animate-spin" aria-hidden />
                  Reading the soft context…
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
                  Refining…
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
            <Button
              size="sm"
              variant="ghost"
              className="h-8 rounded-full text-muted-foreground hover:text-foreground"
              onClick={onReset}
            >
              New
            </Button>
          </div>
        </GlassPanel>
      </div>
    </div>
  )
}
