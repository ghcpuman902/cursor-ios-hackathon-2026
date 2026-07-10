import type { Metadata } from "next"

import { MaleTranslator } from "@/components/male-translator"
import { TranslatorPageShell } from "@/components/translator-page-shell"
import { env } from "@/lib/env"

export const metadata: Metadata = {
  title: "Male Translator™",
  description: env.NEXT_PUBLIC_APP_TAGLINE,
}

export default function MaleTranslatorPage() {
  return (
    <TranslatorPageShell>
      <MaleTranslator
        gender="male"
        sarcasmLevel={env.NEXT_PUBLIC_SARCASM_LEVEL}
        gruntMode={env.NEXT_PUBLIC_GRUNT_MODE}
        translationDelayMs={env.NEXT_PUBLIC_TRANSLATION_DELAY_MS}
      />
    </TranslatorPageShell>
  )
}
