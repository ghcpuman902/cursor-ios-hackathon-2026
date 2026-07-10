"use client"

import type { ReactNode } from "react"
import { useEffect, useRef } from "react"
import { motion, useReducedMotion } from "motion/react"
import { RefreshCw } from "lucide-react"

import { TranslationResultCard } from "@/components/translation-result-card"
import { ProgressiveBlur } from "@/components/progressive-blur"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Marker, MarkerContent } from "@/components/ui/marker"
import { Message, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
} from "@/components/ui/message-scroller"
import type { ChatTurn } from "@/lib/chat-history"
import type { TranslationResult } from "@/lib/translator"
import { cn } from "@/lib/utils"

type ChatTranscriptProps = {
  turns: ChatTurn[]
  resultLabel: string
  theme?: "male-translator" | "female-translator"
  emptyThreadCopy: string
  speakingTurnId: string | null
  onSpeak: (turnId: string, result: TranslationResult) => void
  onCopy: (result: TranslationResult) => void
  className?: string
}

const TurnBubble = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.2, ease: [0.23, 1, 0.32, 1] }
      }
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Scroll new turns into view at the top — user reads down manually. */
const TurnScrollAnchor = ({ turns }: { turns: ChatTurn[] }) => {
  const { scrollToMessage } = useMessageScroller()
  const previousTurnCountRef = useRef(turns.length)
  const previousLastTurnIdRef = useRef<string | null>(turns.at(-1)?.id ?? null)

  useEffect(() => {
    const lastTurn = turns.at(-1)
    const lastTurnId = lastTurn?.id ?? null
    const isNewTurn = turns.length > previousTurnCountRef.current
    const isLatestTurnChanged = lastTurnId !== previousLastTurnIdRef.current

    previousTurnCountRef.current = turns.length
    previousLastTurnIdRef.current = lastTurnId

    if (!lastTurnId || (!isNewTurn && !isLatestTurnChanged)) return

    scrollToMessage(lastTurnId, { align: "start", behavior: "smooth" })
  }, [scrollToMessage, turns])

  return null
}

const ChatTranscriptList = ({
  turns,
  resultLabel,
  theme = "male-translator",
  speakingTurnId,
  onSpeak,
  onCopy,
  className,
}: ChatTranscriptProps) => {
  const lastTurnId = turns.at(-1)?.id

  return (
    <MessageScroller className={cn("min-h-0 flex-1", className)}>
      <TurnScrollAnchor turns={turns} />
      <MessageScrollerViewport aria-label="Translation conversation">
        <MessageScrollerContent className="gap-4 px-1 pt-[calc(var(--header-inset)+1rem)] pb-[calc(var(--composer-inset)+var(--header-inset)+1rem)]">
          {turns.map((turn) => {
            const displayInput = turn.result
              ? (turn.result.extractedPhrase ?? turn.result.input)
              : turn.input

            return (
              <MessageScrollerItem
                key={turn.id}
                messageId={turn.id}
                scrollAnchor={turn.id === lastTurnId}
                className="scroll-mt-[calc(var(--header-inset)+1rem)] scroll-mb-[calc(var(--composer-inset)+var(--header-inset)+0.5rem)] space-y-3"
              >
                  <TurnBubble>
                    <Message align="end">
                      <MessageContent className="max-w-[88%]">
                        <Bubble
                          align="end"
                          variant="secondary"
                          className="translator-surface max-w-full rounded-3xl rounded-br-md border backdrop-blur-xl"
                        >
                          <BubbleContent className="rounded-3xl rounded-br-md px-4 py-3 text-sm text-foreground/90">
                            {displayInput}
                          </BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </TurnBubble>

                  {(turn.status === "pending" ||
                    turn.status === "translating") && (
                    <Marker>
                      <MarkerContent className="shimmer text-xs">
                        {turn.loadingMessage ?? "Translating…"}
                      </MarkerContent>
                    </Marker>
                  )}

                  {turn.status === "error" && (
                    <TurnBubble>
                      <Message align="start">
                        <MessageContent className="max-w-[88%]">
                          <Bubble
                            align="start"
                            variant="destructive"
                            className="max-w-full rounded-3xl rounded-bl-md"
                          >
                            <BubbleContent className="rounded-3xl rounded-bl-md px-4 py-3 text-sm">
                              {turn.errorMessage ??
                                "Could not translate that message."}
                            </BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </TurnBubble>
                  )}

                  {turn.status === "complete" && turn.result && (
                    <TurnBubble>
                      <Message align="start">
                        <MessageContent className="max-w-full">
                          <TranslationResultCard
                            result={turn.result}
                            resultLabel={resultLabel}
                            theme={theme}
                            isFetchingAnalysis={turn.isFetchingAiInsight}
                            isSpeaking={speakingTurnId === turn.id}
                            onSpeak={() => onSpeak(turn.id, turn.result!)}
                            onCopy={() => onCopy(turn.result!)}
                          />
                        </MessageContent>
                      </Message>
                    </TurnBubble>
                  )}

                  {turn.status === "translating" &&
                    turn.isFetchingAiInsight &&
                    !turn.result && (
                      <Marker>
                        <MarkerContent className="flex items-center gap-2 text-xs text-muted-foreground">
                          <RefreshCw className="size-3 animate-spin" aria-hidden />
                          Refining context…
                        </MarkerContent>
                      </Marker>
                    )}
                </MessageScrollerItem>
              )
            })}
          </MessageScrollerContent>
        </MessageScrollerViewport>

        <MessageScrollerButton
          direction="end"
          className="bottom-[calc(var(--composer-inset)+0.25rem)] border-border bg-background/90 backdrop-blur-xl"
        />

        <ProgressiveBlur
          direction="bottom"
          blurLayers={5}
          blurIntensity={0.12}
          className="absolute inset-x-0 bottom-0 z-1 h-[calc(var(--composer-inset)+2rem)]"
        />

      </MessageScroller>
  )
}

export const ChatTranscript = (props: ChatTranscriptProps) => {
  const { turns, className, emptyThreadCopy } = props

  if (turns.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-1 items-center justify-center px-6 text-center",
          className
        )}
      >
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
          {emptyThreadCopy}
        </p>
      </div>
    )
  }

  return (
    <MessageScrollerProvider
      autoScroll={false}
      defaultScrollPosition="last-anchor"
    >
      <ChatTranscriptList {...props} />
    </MessageScrollerProvider>
  )
}
