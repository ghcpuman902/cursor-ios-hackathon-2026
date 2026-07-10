import type { Metadata } from "next"

import { LegalPage } from "@/components/legal-page"

export const metadata: Metadata = {
  title: "Privacy Policy",
}

const PRIVACY_BULLETS = [
  "What data is collected when you type, record voice, or upload screenshots.",
  "How on-device voice handling differs from server-side transcription.",
  "Which third-party AI services process your inputs and for how long.",
  "How local chat history is stored in your browser and when it is cleared.",
  "Your rights to access, delete, or stop sharing data with this app.",
] as const

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="Key points about how this app handles your data. Full policy to be added."
      bullets={[...PRIVACY_BULLETS]}
    />
  )
}
