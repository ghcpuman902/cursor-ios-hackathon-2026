import type { ReactNode } from "react"

type TranslatorPageShellProps = {
  children: ReactNode
}

export const TranslatorPageShell = ({ children }: TranslatorPageShellProps) => {
  return (
    <main className="mobile-app-shell app-shell-bg relative min-h-0 flex-col px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
      {children}
    </main>
  )
}
