"use client"

import { useCallback, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowRight,
  Beer,
  Copy,
  Dumbbell,
  RefreshCw,
  Sparkles,
  Volume2,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { CATEGORY_LABELS } from "@/lib/translations"
import {
  getRandomLoadingMessage,
  translateMale,
  type TranslationResult,
} from "@/lib/translator"
import { cn } from "@/lib/utils"

type MaleTranslatorProps = {
  appName: string
  tagline: string
  sarcasmLevel: number
  gruntMode: boolean
  translationDelayMs: number
}

export function MaleTranslator({
  appName,
  tagline,
  sarcasmLevel,
  gruntMode,
  translationDelayMs,
}: MaleTranslatorProps) {
  const [input, setInput] = useState("")
  const [result, setResult] = useState<TranslationResult | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")

  const translate = useCallback(
    async (text: string) => {
      if (!text.trim()) {
        toast.error("He said nothing. That's also data.", {
          description: "Type something he mumbled, texted, or grunted first.",
        })
        return
      }

      setIsTranslating(true)
      setLoadingMessage(getRandomLoadingMessage())
      setResult(null)

      await new Promise((resolve) => setTimeout(resolve, translationDelayMs))

      const translation = translateMale(text, { sarcasmLevel, gruntMode })
      setResult(translation)
      setIsTranslating(false)
    },
    [gruntMode, sarcasmLevel, translationDelayMs],
  )

  const handleSubmit = () => translate(input)

  const handleSample = (phrase: string) => {
    setInput(phrase)
    void translate(phrase)
  }

  const copyResult = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result.translation)
    toast.success("Copied!", {
      description: "Paste it in the group chat at your own risk.",
    })
  }

  const sarcasmLabel =
    sarcasmLevel <= 3
      ? "Gentle"
      : sarcasmLevel <= 6
        ? "Honest"
        : sarcasmLevel <= 8
          ? "Spicy"
          : "Nuclear"

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <header className="space-y-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <Dumbbell className="size-6 text-primary" aria-hidden />
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {appName}
          </h1>
          <Beer className="size-6 text-muted-foreground" aria-hidden />
        </div>
        <p className="text-sm text-muted-foreground sm:text-base">{tagline}</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge variant="secondary">
            Sarcasm: {sarcasmLevel}/10 ({sarcasmLabel})
          </Badge>
          {gruntMode && (
            <Badge variant="outline">Grunt mode: ON *[mm-hmm]*</Badge>
          )}
          <Badge variant="outline" className="font-mono">
            Peer-reviewed by zero men
          </Badge>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Volume2 className="size-4" aria-hidden />
            What he said
          </CardTitle>
          <CardDescription>
            Paste the text, grunt, or emotionally unavailable sentence below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={`e.g. "I'm fine", "k", "do whatever you want"`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                handleSubmit()
              }
            }}
            rows={3}
            className="resize-none"
          />

          <div className="flex flex-wrap gap-2">
            <span className="w-full text-xs text-muted-foreground">
              Quick samples (tap to translate):
            </span>
            {[
              "k",
              "I'm fine",
              "Do whatever you want",
              "I'm almost there",
              "Sounds good",
              "Bruh",
            ].map((phrase) => (
              <Button
                key={phrase}
                variant="outline"
                size="sm"
                onClick={() => handleSample(phrase)}
                disabled={isTranslating}
              >
                &ldquo;{phrase}&rdquo;
              </Button>
            ))}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isTranslating}
            className="w-full sm:w-auto"
          >
            {isTranslating ? (
              <>
                <RefreshCw className="animate-spin" aria-hidden />
                Translating…
              </>
            ) : (
              <>
                <Sparkles aria-hidden />
                Translate
                <ArrowRight aria-hidden />
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {isTranslating && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <Card className="border-dashed">
              <CardContent className="py-8 text-center">
                <p className="animate-pulse text-sm text-muted-foreground">
                  {loadingMessage}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {result && !isTranslating && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card
              className={cn(
                "border-2",
                result.isFallback
                  ? "border-muted"
                  : "border-primary/30 bg-primary/5",
              )}
            >
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">What he meant</CardTitle>
                    <CardDescription>
                      {result.isFallback
                        ? "No exact match — here's our best guess (still 100%+ confident)"
                        : "Decoded with scientifically dubious precision"}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge>
                      {result.category === "mystery"
                        ? "🔮 Mystery"
                        : CATEGORY_LABELS[result.category]}
                    </Badge>
                    <Badge variant="secondary" className="font-mono">
                      {result.confidence}% confident
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <blockquote className="border-l-4 border-primary pl-4 text-base leading-relaxed sm:text-lg">
                  &ldquo;{result.translation}&rdquo;
                </blockquote>

                {result.matchedPattern && (
                  <p className="text-xs text-muted-foreground">
                    Matched dialect pattern: &ldquo;{result.matchedPattern}&rdquo;
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={copyResult}>
                    <Copy aria-hidden />
                    Copy translation
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setResult(null)
                      setInput("")
                    }}
                  >
                    Clear & try again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="text-center text-xs text-muted-foreground">
        <p>
          Not affiliated with any actual men. Results may vary. Side effects
          include eye rolls and improved communication (unlikely).
        </p>
        <p className="mt-1">
          Tip: Press <kbd className="rounded border px-1">⌘</kbd>+
          <kbd className="rounded border px-1">Enter</kbd> to translate.
        </p>
      </footer>
    </div>
  )
}
