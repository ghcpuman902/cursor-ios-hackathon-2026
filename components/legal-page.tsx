import Link from "next/link"

import { Button } from "@/components/ui/button"

type LegalPageProps = {
  title: string
  description: string
  bullets: string[]
}

export const LegalPage = ({ title, description, bullets }: LegalPageProps) => {
  return (
    <main className="relative flex min-h-dvh flex-col px-4 py-[max(0.75rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto w-full max-w-md space-y-6 pt-4">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 rounded-full px-2.5 text-xs text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link href="/">← Back</Link>
        </Button>

        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </header>

        <ul className="list-disc space-y-3 pl-5 text-sm text-foreground/90">
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </div>
    </main>
  )
}
