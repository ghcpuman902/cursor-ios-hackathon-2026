import type { Metadata } from "next"

import { MaleTranslator } from "@/components/male-translator"
import { env } from "@/lib/env"

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_APP_NAME,
  description: env.NEXT_PUBLIC_APP_TAGLINE,
}

export default function Page() {
  return (
    <main className="app-mesh-bg relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-8 sm:py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-violet-500/20 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 size-80 translate-x-1/4 rounded-full bg-cyan-400/15 blur-[90px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-1/3 size-64 rounded-full bg-rose-500/10 blur-[80px]"
      />

      <div className="relative w-full max-w-md">
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
