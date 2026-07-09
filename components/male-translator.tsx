"use client"

import { useCallback, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowRight,
  Copy,
  Keyboard,
  Mic,
  RefreshCw,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
              ? "Record a voice note first."
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
    <div className="mx-auto flex w-full max-w-md flex-col gap-5">
      <header className="space-y-3 px-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{appName}</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">{tagline}</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-[11px]">
            Sarcasm {sarcasmLevel}/10 · {sarcasmLabel}
          </Badge>
          {gruntMode && (
            <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-[11px]">
              Grunt mode
            </Badge>
          )}
        </div>
      </header>

      <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-sm">
        <Tabs
          value={inputMode}
          onValueChange={(value) => setInputMode(value as InputMode)}
        >
          <div className="border-b border-border/60 bg-muted/20 px-4 py-3">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="voice" className="gap-1.5">
                <Mic className="size-4" aria-hidden />
                Voice note
              </TabsTrigger>
              <TabsTrigger value="type" className="gap-1.5">
                <Keyboard className="size-4" aria-hidden />
                Type
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="space-y-5 px-4 py-5">
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
                className="min-h-28 resize-none rounded-2xl border-border/70 bg-muted/20 text-base"
              />

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
            </TabsContent>

            <Button
              onClick={handleSubmit}
              disabled={isTranslating || isListening}
              className="h-11 w-full rounded-full"
              size="lg"
            >
              {isTranslating ? (
                <>
                  <RefreshCw className="animate-spin" aria-hidden />
                  Decoding…
                </>
              ) : (
                <>
                  <Sparkles aria-hidden />
                  Translate voice note
                  <ArrowRight aria-hidden />
                </>
              )}
            </Button>
          </div>
        </Tabs>
      </div>

      <AnimatePresence mode="wait">
        {isTranslating && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-3xl border border-dashed border-border/70 bg-muted/20 px-4 py-8 text-center"
          >
            <p className="text-sm text-muted-foreground">{loadingMessage}</p>
          </motion.div>
        )}

        {result && !isTranslating && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <div className="flex justify-start">
              <div
                className={cn(
                  "max-w-[92%] rounded-3xl rounded-bl-md px-4 py-3 text-sm",
                  "bg-muted text-muted-foreground",
                )}
              >
                <p className="text-[11px] font-medium tracking-wide uppercase opacity-70">
                  He said
                </p>
                <p className="mt-1">&ldquo;{result.input}&rdquo;</p>
              </div>
            </div>

            <div className="flex justify-end">
              <div
                className={cn(
                  "max-w-[92%] rounded-3xl rounded-br-md px-4 py-4",
                  result.isFallback
                    ? "bg-muted text-foreground"
                    : "bg-primary text-primary-foreground",
                )}
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <p className="text-[11px] font-medium tracking-wide uppercase opacity-70">
                    What he meant
                  </p>
                  <Badge
                    variant="secondary"
                    className="h-5 rounded-full px-2 text-[10px]"
                  >
                    {result.category === "mystery"
                      ? "🔮 Mystery"
                      : CATEGORY_LABELS[result.category]}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="h-5 rounded-full px-2 font-mono text-[10px]"
                  >
                    {result.confidence}%
                  </Badge>
                </div>

                <p className="text-base leading-relaxed font-medium">
                  &ldquo;{result.translation}&rdquo;
                </p>

                {result.matchedPattern && (
                  <p className="mt-2 text-[11px] opacity-70">
                    Matched: &ldquo;{result.matchedPattern}&rdquo;
                  </p>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 rounded-full"
                    onClick={copyResult}
                  >
                    <Copy aria-hidden />
                    Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-full"
                    onClick={() => {
                      setResult(null)
                      setInput("")
                      setVoiceInput("")
                    }}
                  >
                    New note
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="px-2 text-center text-[11px] leading-relaxed text-muted-foreground">
        <p>
          Voice notes stay on your device. Not affiliated with any actual men.
        </p>
      </footer>
    </div>
  )
}
