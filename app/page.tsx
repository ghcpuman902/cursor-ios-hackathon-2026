import type { Metadata } from "next"

import { MaleTranslator } from "@/components/male-translator"
import { env } from "@/lib/env"

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_APP_NAME,
  description: env.NEXT_PUBLIC_APP_TAGLINE,
}

export default function Page() {
  return (
    <main className="relative min-h-svh overflow-hidden px-4 py-10 sm:px-6 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.04),transparent_42%),linear-gradient(to_bottom,var(--background),color-mix(in_oklch,var(--muted),transparent_70%))]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-16 left-1/2 size-72 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 size-80 translate-x-1/4 rounded-full bg-muted/60 blur-3xl"
      />

      <div className="relative">
        <MaleTranslator
          appName={env.NEXT_PUBLIC_APP_NAME}
          tagline={env.NEXT_PUBLIC_APP_TAGLINE}
          sarcasmLevel={env.NEXT_PUBLIC_SARCASM_LEVEL}
          gruntMode={env.NEXT_PUBLIC_GRUNT_MODE}
          translationDelayMs={env.NEXT_PUBLIC_TRANSLATION_DELAY_MS}
        />
      </div>
    </main>
  )
}
