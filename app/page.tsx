import type { Metadata } from "next"

import { MaleTranslator } from "@/components/male-translator"
import { env } from "@/lib/env"

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_APP_NAME,
  description: env.NEXT_PUBLIC_APP_TAGLINE,
  applicationName: env.NEXT_PUBLIC_APP_NAME,
  manifest: "/manifest.webmanifest",
  formatDetection: {
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    title: env.NEXT_PUBLIC_APP_NAME,
    statusBarStyle: "black-translucent",
  },
}

export default function Page() {
  return (
    <main className="relative min-h-dvh px-4 py-6 sm:py-12">
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
