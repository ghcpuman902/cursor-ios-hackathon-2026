import type { Metadata } from "next"

import { LegalPage } from "@/components/legal-page"

export const metadata: Metadata = {
  title: "Disclaimer",
}

const DISCLAIMER_BULLETS = [
  "Translations are for entertainment and relationship humour, not professional advice.",
  "AI-generated reads may be inaccurate, exaggerated, or miss important context.",
  "Do not rely on this app for decisions about safety, health, or legal matters.",
  "Voice recordings stay on your device until sent for transcription; screenshots are processed server-side.",
  "You use this app at your own risk; the authors are not liable for outcomes from its output.",
] as const

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      description="Important limitations on how to use this translator. Full disclaimer to be added."
      bullets={[...DISCLAIMER_BULLETS]}
    />
  )
}
