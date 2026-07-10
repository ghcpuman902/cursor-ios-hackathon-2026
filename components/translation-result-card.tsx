"use client"

import { Copy, Play, RefreshCw } from "lucide-react"

import { AiNoteBubble } from "@/components/ai-note-bubble"
import { GlassPanel } from "@/components/glass-panel"
import { TacticalReadBubble } from "@/components/tactical-read-bubble"
import { TimeSensitiveBubble } from "@/components/time-sensitive-bubble"
import { Button } from "@/components/ui/button"
import { toBroAdviceFields } from "@/lib/bro-format"
import { toHerAdviceFields } from "@/lib/her-format"
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

const BroAdviceCard = ({
  result,
  resultLabel,
  isSpeaking,
  onSpeak,
  onCopy,
}: {
  result: TranslationResult
  resultLabel: string
  isSpeaking: boolean
  onSpeak: () => void
  onCopy: () => void
}) => {
  const bro = toBroAdviceFields({
    riskLevel: result.riskLevel,
    possibleActualMeaning: result.possibleActualMeaning,
    lowestRiskReply: result.lowestRiskReply,
    tinyWholesomeNudge: result.tinyWholesomeNudge,
  })

  return (
    <GlassPanel
      variant="strong"
      className="rounded-3xl rounded-bl-md px-4 py-4 text-sm"
    >
      <p className="mb-3 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
        {resultLabel}
      </p>

      <p className="text-sm font-medium text-foreground">{bro.alert}</p>

      <div className="mt-3 space-y-2.5 text-sm leading-relaxed">
        <p>
          <span className="font-medium text-foreground/90">real talk: </span>
          <span className="text-foreground/80">{bro.realTalk}</span>
        </p>
        <p>
          <span className="font-medium text-foreground/90">send this: </span>
          <span className="text-foreground/80">&ldquo;{bro.sendThis}&rdquo;</span>
        </p>
        <p>
          <span className="font-medium text-foreground/90">chill move: </span>
          <span className="text-foreground/70">{bro.chillMove}</span>
        </p>
      </div>

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
          play
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="h-8 rounded-full"
          onClick={onCopy}
        >
          <Copy aria-hidden />
          copy
        </Button>
      </div>
    </GlassPanel>
  )
}

const HerAdviceCard = ({
  result,
  resultLabel,
  isSpeaking,
  onSpeak,
  onCopy,
}: {
  result: TranslationResult
  resultLabel: string
  isSpeaking: boolean
  onSpeak: () => void
  onCopy: () => void
}) => {
  const her = toHerAdviceFields({
    riskLevel: result.riskLevel,
    possibleActualMeaning: result.possibleActualMeaning,
    lowestRiskReply: result.lowestRiskReply,
    tinyWholesomeNudge: result.tinyWholesomeNudge,
  })

  return (
    <GlassPanel
      variant="strong"
      className="rounded-3xl rounded-bl-md px-4 py-4 text-sm"
    >
      <p className="mb-3 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
        {resultLabel}
      </p>

      <p className="text-sm font-medium text-foreground">{her.alert}</p>

      <div className="mt-3 space-y-2.5 text-sm leading-relaxed">
        <p>
          <span className="font-medium text-foreground/90">the read: </span>
          <span className="text-foreground/80">{her.theRead}</span>
        </p>
        <p>
          <span className="font-medium text-foreground/90">try this: </span>
          <span className="text-foreground/80">&ldquo;{her.tryThis}&rdquo;</span>
        </p>
        <p>
          <span className="font-medium text-foreground/90">soft landing: </span>
          <span className="text-foreground/70">{her.softLanding}</span>
        </p>
      </div>

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
  )
}

const hasAnalysisBody = (
  analysis: TranslationResult["analysis"] | undefined
): boolean => {
  if (!analysis) return false
  return Boolean(
    analysis.whyThisPhrase ||
      (analysis.contextSignals && analysis.contextSignals.length > 0) ||
      (analysis.extraStoryAdded && analysis.extraStoryAdded.length > 0) ||
      (analysis.whatUserBrainAdded && analysis.whatUserBrainAdded.length > 0) ||
      (analysis.screenshotNotes && analysis.screenshotNotes.length > 0)
  )
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
  const isFemaleTranslator = theme === "female-translator"
  const analysis = result.analysis
  const timingWarning = result.timingWarning?.trim()
  const timingFlag = result.timingFlag?.trim()
  const aiInsight = result.aiInsight?.trim()

  const hasSoftNote =
    hasAnalysisBody(analysis) ||
    Boolean(
      analysis?.contextConflict || result.aiEnhancement?.contextConflict
    ) ||
    (isFetchingAnalysis && hasAnalysisBody(analysis))

  const showTimingCheck = Boolean(timingWarning && timingFlag)

  return (
    <div className="w-full max-w-[88%] space-y-2">
      {isFemaleTranslator ? (
        <BroAdviceCard
          result={result}
          resultLabel={resultLabel}
          isSpeaking={isSpeaking}
          onSpeak={onSpeak}
          onCopy={onCopy}
        />
      ) : (
        <HerAdviceCard
          result={result}
          resultLabel={resultLabel}
          isSpeaking={isSpeaking}
          onSpeak={onSpeak}
          onCopy={onCopy}
        />
      )}

      {showTimingCheck && (
        <TimeSensitiveBubble
          text={timingWarning!}
          flag={timingFlag!}
          theme={theme}
        />
      )}

      <AiNoteBubble
        text={aiInsight}
        isLoading={isFetchingAnalysis}
        theme={theme}
      />

      {hasSoftNote && (
        <TacticalReadBubble
          analysis={analysis}
          contextConflict={
            Boolean(analysis?.contextConflict) ||
            Boolean(result.aiEnhancement?.contextConflict)
          }
          isFetchingAnalysis={isFetchingAnalysis && hasAnalysisBody(analysis)}
          loadingLabel={
            isFemaleTranslator
              ? "reading the room…"
              : "Reading the soft context…"
          }
          refiningLabel={isFemaleTranslator ? "updating…" : "Refining…"}
          title={isFemaleTranslator ? "extra context" : "Soft note"}
        />
      )}
    </div>
  )
}
