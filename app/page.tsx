import type { Metadata } from "next"

import { MaleTranslator } from "@/components/male-translator"
import { env } from "@/lib/env"

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_APP_NAME,
  description: env.NEXT_PUBLIC_APP_TAGLINE,
}

export default function Page() {
  return (
    <main className="min-h-svh bg-gradient-to-b from-background to-muted/40 px-4 py-10 sm:px-6 sm:py-16">
      <MaleTranslator
        appName={env.NEXT_PUBLIC_APP_NAME}
        tagline={env.NEXT_PUBLIC_APP_TAGLINE}
        sarcasmLevel={env.NEXT_PUBLIC_SARCASM_LEVEL}
        gruntMode={env.NEXT_PUBLIC_GRUNT_MODE}
        translationDelayMs={env.NEXT_PUBLIC_TRANSLATION_DELAY_MS}
      />
    </main>
  )
}
