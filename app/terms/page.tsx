import type { Metadata } from "next"

import { LegalPage } from "@/components/legal-page"

export const metadata: Metadata = {
  title: "Terms of Use",
}

const TERMS_BULLETS = [
  "By using this app you agree to these terms and the linked privacy policy.",
  "The app is provided as-is for personal, non-commercial hackathon demo use.",
  "Do not submit unlawful, abusive, or others' private content without permission.",
  "All translation output, branding, and UI remain the property of the authors.",
  "Terms may change; continued use after updates means you accept the revised terms.",
] as const

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      description="Ground rules for using this app. Full terms to be added."
      bullets={[...TERMS_BULLETS]}
    />
  )
}
