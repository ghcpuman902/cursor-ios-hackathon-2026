import type { Metadata } from "next"

import { MaleTranslator } from "@/components/male-translator"
import { env } from "@/lib/env"

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_APP_NAME,
  description: env.NEXT_PUBLIC_APP_TAGLINE,
  appleWebApp: {
    capable: true,
    title: env.NEXT_PUBLIC_APP_NAME,
    statusBarStyle: "black-translucent",
  },
}

export default function Page() {
  return (
    <main className="app-shell-bg relative isolate flex min-h-full flex-col px-4 py-6 sm:items-center sm:justify-center sm:py-12">
      <div className="relative z-10 mx-auto w-full max-w-md sm:my-auto">
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
