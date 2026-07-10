import type { ReactNode } from "react"

type TranslatorPageShellProps = {
  children: ReactNode
}

export const TranslatorPageShell = ({ children }: TranslatorPageShellProps) => {
  return (
    <main className="mobile-app-shell app-shell-bg px-4">
      {children}
    </main>
  )
}
