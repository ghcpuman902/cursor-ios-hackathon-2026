"use client"

import { useCallback, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowRight,
  Copy,
  Keyboard,
  MessageSquareQuote,
  Mic,
  RefreshCw,
  Sparkles,
  Waves,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { VoiceInputPanel } from "@/components/voice-input-panel"
import { SAMPLE_PHRASES, CATEGORY_LABELS } from "@/lib/translations"
import {
  getRandomLoadingMessage,
  translateMale,
  type TranslationResult,
} from "@/lib/translator"
import { cn } from "@/lib/utils"

type InputMode = "voice" | "type"

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
  const [inputMode, setInputMode] = useState<InputMode>("voice")
  const [input, setInput] = useState("")
  const [voiceInput, setVoiceInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [result, setResult] = useState<TranslationResult | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")

  const activeInput = inputMode === "voice" ? voiceInput : input

  const translate = useCallback(
    async (text: string) => {
      if (!text.trim()) {
        toast.error("He said nothing. That's also data.", {
          description:
            inputMode === "voice"
              ? "Tap the mic and say something first."
              : "Type something he mumbled, texted, or grunted first.",
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
    [gruntMode, inputMode, sarcasmLevel, translationDelayMs],
  )

  const handleSubmit = () => translate(activeInput)

  const handleSample = (phrase: string) => {
    setInputMode("type")
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
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <header className="space-y-5 text-center">
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-border/70 bg-card/80 px-3 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur">
          <Waves className="size-3.5 text-primary" aria-hidden />
          <span>Now with voice decoding</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {appName}
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {tagline}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            Sarcasm {sarcasmLevel}/10 · {sarcasmLabel}
          </Badge>
          {gruntMode && (
            <Badge variant="outline" className="rounded-full px-3 py-1">
              Grunt mode ON
            </Badge>
          )}
          <Badge variant="outline" className="rounded-full px-3 py-1 font-mono">
            Peer-reviewed by zero men
          </Badge>
        </div>
      </header>

      <Tabs
        value={inputMode}
        onValueChange={(value) => setInputMode(value as InputMode)}
        className="gap-0"
      >
        <Card className="overflow-hidden border-border/70 bg-card/90 shadow-sm backdrop-blur">
          <CardHeader className="border-b border-border/60 bg-muted/20 pb-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-1.5">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MessageSquareQuote className="size-5 text-primary" aria-hidden />
                  Decode session
                </CardTitle>
                <CardDescription>
                  Speak it or type it. We&apos;ll tell you what he actually meant.
                </CardDescription>
              </div>

              <TabsList className="grid w-full grid-cols-2 sm:w-auto">
                <TabsTrigger value="voice" className="gap-1.5 px-4">
                  <Mic className="size-4" aria-hidden />
                  Voice
                </TabsTrigger>
                <TabsTrigger value="type" className="gap-1.5 px-4">
                  <Keyboard className="size-4" aria-hidden />
                  Type
                </TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <TabsContent value="voice" className="mt-0">
              <VoiceInputPanel
                disabled={isTranslating}
                onTranscriptChange={setVoiceInput}
                onListeningChange={setIsListening}
              />
            </TabsContent>

            <TabsContent value="type" className="mt-0 space-y-4">
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
                rows={4}
                className="min-h-28 resize-none rounded-2xl border-border/70 bg-background/80 text-base"
              />

              <div className="space-y-2">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Quick samples
                </p>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_PHRASES.map((phrase) => (
                    <Button
                      key={phrase}
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => handleSample(phrase)}
                      disabled={isTranslating}
                    >
                      &ldquo;{phrase}&rdquo;
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <div className="flex flex-col gap-3 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                {isListening
                  ? "Waveform is live — keep talking, then tap the mic to stop."
                  : inputMode === "voice"
                    ? "Stop recording, then translate when you're ready."
                    : "Press ⌘ + Enter to translate quickly."}
              </p>

              <Button
                onClick={handleSubmit}
                disabled={isTranslating || isListening}
                size="lg"
                className="rounded-full px-6"
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
            </div>
          </CardContent>
        </Card>
      </Tabs>

      <AnimatePresence mode="wait">
        {isTranslating && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <Card className="border-dashed border-border/70 bg-muted/10">
              <CardContent className="flex items-center justify-center gap-3 py-10">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/40" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
                </span>
                <p className="text-sm text-muted-foreground">{loadingMessage}</p>
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
                "overflow-hidden border-2 shadow-sm",
                result.isFallback
                  ? "border-border bg-card"
                  : "border-primary/25 bg-gradient-to-br from-primary/8 via-card to-card",
              )}
            >
              <CardHeader className="border-b border-border/50 bg-background/40">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1.5">
                    <CardTitle className="text-xl">What he meant</CardTitle>
                    <CardDescription>
                      {result.isFallback
                        ? "No exact match — still wildly overconfident"
                        : "Decoded with scientifically dubious precision"}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="rounded-full">
                      {result.category === "mystery"
                        ? "🔮 Mystery"
                        : CATEGORY_LABELS[result.category]}
                    </Badge>
                    <Badge variant="secondary" className="rounded-full font-mono">
                      {result.confidence}% confident
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-5 pt-6">
                <div className="rounded-2xl border border-border/60 bg-background/70 px-5 py-4">
                  <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Original
                  </p>
                  <p className="text-sm text-muted-foreground">
                    &ldquo;{result.input}&rdquo;
                  </p>
                </div>

                <blockquote className="rounded-2xl border-l-4 border-primary bg-primary/5 px-5 py-4 text-lg leading-relaxed font-medium text-foreground">
                  &ldquo;{result.translation}&rdquo;
                </blockquote>

                {result.matchedPattern && (
                  <p className="text-xs text-muted-foreground">
                    Matched dialect pattern: &ldquo;{result.matchedPattern}&rdquo;
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={copyResult}
                  >
                    <Copy aria-hidden />
                    Copy translation
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full"
                    onClick={() => {
                      setResult(null)
                      setInput("")
                      setVoiceInput("")
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

      <footer className="space-y-2 text-center text-xs text-muted-foreground">
        <p>
          Not affiliated with any actual men. Results may vary. Side effects
          include eye rolls and improved communication (unlikely).
        </p>
        <p>Voice mode uses your mic locally — we&apos;re not uploading your relationship drama.</p>
      </footer>
    </div>
  )
}
