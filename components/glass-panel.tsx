import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type GlassPanelProps = {
  children: ReactNode
  className?: string
  variant?: "default" | "strong" | "subtle"
}

export function GlassPanel({
  children,
  className,
  variant = "default",
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border backdrop-blur-xl",
        variant === "strong" &&
          "translator-surface-strong",
        variant === "default" && "translator-surface",
        variant === "subtle" && "translator-surface-subtle",
        className
      )}
    >
      {children}
    </div>
  )
}
