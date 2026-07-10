import type { Metadata } from "next"

import { MaleTranslator } from "@/components/male-translator"
import { TranslatorPageShell } from "@/components/translator-page-shell"
import { env } from "@/lib/env"

export const metadata: Metadata = {
  title: "Female Translator™",
  description: "Her subtext, translated into quest markers and bro intel.",
}

export default function FemaleTranslatorPage() {
  return (
    <TranslatorPageShell>
      <MaleTranslator
        gender="female"
        sarcasmLevel={env.NEXT_PUBLIC_SARCASM_LEVEL}
        gruntMode={env.NEXT_PUBLIC_GRUNT_MODE}
        translationDelayMs={env.NEXT_PUBLIC_TRANSLATION_DELAY_MS}
      />
    </TranslatorPageShell>
  )
}
