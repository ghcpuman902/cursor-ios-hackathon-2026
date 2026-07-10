"use client"

import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { ArrowDown, RefreshCw } from "lucide-react"

import { TranslationResultCard } from "@/components/translation-result-card"
import { ProgressiveBlur } from "@/components/progressive-blur"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Marker, MarkerContent } from "@/components/ui/marker"
import { Message, MessageContent } from "@/components/ui/message"
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
  const previousLastTurnIdRef = useRef<string | null>(null)

  useEffect(() => {
    const lastTurnId = turns.at(-1)?.id
    if (!lastTurnId || lastTurnId === previousLastTurnIdRef.current) return

    const isInitialPosition = previousLastTurnIdRef.current === null
    previousLastTurnIdRef.current = lastTurnId

    const animationFrame = requestAnimationFrame(() => {
      document.getElementById(`chat-turn-${lastTurnId}`)?.scrollIntoView({
        block: "start",
        behavior: isInitialPosition ? "auto" : "smooth",
      })
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [turns])

  return null
}

const DocumentScrollButton = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const visualViewport = window.visualViewport

    const updateVisibility = () => {
      const viewportHeight = visualViewport?.height ?? window.innerHeight
      const viewportTop = window.scrollY + (visualViewport?.offsetTop ?? 0)
      const distanceFromEnd =
        document.documentElement.scrollHeight - (viewportTop + viewportHeight)

      setIsVisible(distanceFromEnd > 48)
    }

    const resizeObserver = new ResizeObserver(updateVisibility)
    resizeObserver.observe(document.documentElement)
    updateVisibility()

    window.addEventListener("scroll", updateVisibility, { passive: true })
    window.addEventListener("resize", updateVisibility)
    visualViewport?.addEventListener("resize", updateVisibility)
    visualViewport?.addEventListener("scroll", updateVisibility)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("scroll", updateVisibility)
      window.removeEventListener("resize", updateVisibility)
      visualViewport?.removeEventListener("resize", updateVisibility)
      visualViewport?.removeEventListener("scroll", updateVisibility)
    }
  }, [])

  const handleScrollToEnd = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    })
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon-sm"
      className={cn(
        "fixed bottom-[calc(var(--visual-viewport-bottom)+var(--composer-inset)+0.25rem)] left-1/2 z-20 -translate-x-1/2 rounded-full border-border bg-background/90 text-foreground backdrop-blur-xl transition-[translate,scale,opacity] duration-200 hover:bg-muted",
        isVisible
          ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-full scale-95 opacity-0"
      )}
      onClick={handleScrollToEnd}
      aria-label="Scroll to latest message"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
    >
      <ArrowDown aria-hidden />
    </Button>
  )
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
  return (
    <section
      className={cn("relative flex min-h-dvh w-full flex-col", className)}
      aria-label="Translation conversation"
    >
      <TurnScrollAnchor turns={turns} />
      <div className="flex min-h-dvh flex-col gap-4 px-1 pt-[calc(var(--header-inset)+1rem)] pb-[calc(var(--composer-inset)+var(--header-inset)+1rem)]">
        {turns.map((turn) => {
          const displayInput = turn.result
            ? (turn.result.extractedPhrase ?? turn.result.input)
            : turn.input

          return (
            <article
              key={turn.id}
              id={`chat-turn-${turn.id}`}
              className="min-w-0 shrink-0 scroll-mt-[calc(var(--header-inset)+1rem)] scroll-mb-[calc(var(--composer-inset)+var(--header-inset)+0.5rem)] space-y-3 [contain-intrinsic-size:auto_10rem] [content-visibility:auto]"
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

              {(turn.status === "pending" || turn.status === "translating") && (
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
            </article>
          )
        })}
      </div>

      <DocumentScrollButton />

      <ProgressiveBlur
        direction="bottom"
        blurLayers={5}
        blurIntensity={0.12}
        className="fixed inset-x-0 bottom-(--visual-viewport-bottom) z-10 h-[calc(var(--composer-inset)+2rem)]"
      />
    </section>
  )
}

export const ChatTranscript = (props: ChatTranscriptProps) => {
  const { turns, className, emptyThreadCopy } = props

  if (turns.length === 0) {
    return (
      <div
        className={cn(
          "flex min-h-dvh flex-1 items-center justify-center px-6 pt-(--header-inset) pb-(--composer-inset) text-center",
          className
        )}
      >
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
          {emptyThreadCopy}
        </p>
      </div>
    )
  }

  return <ChatTranscriptList {...props} />
}
