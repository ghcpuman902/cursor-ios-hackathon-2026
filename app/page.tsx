import type { Metadata } from "next"

import { MaleTranslator } from "@/components/male-translator"
import { env } from "@/lib/env"

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_APP_NAME,
  description: env.NEXT_PUBLIC_APP_TAGLINE,
}

export default function Page() {
  return (
    <main className="relative flex min-h-svh items-center justify-center bg-zinc-100 px-4 py-8 dark:bg-zinc-950 sm:py-10">
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
