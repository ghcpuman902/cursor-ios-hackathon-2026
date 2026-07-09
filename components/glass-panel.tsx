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
          "border-white/15 bg-white/12 shadow-[0_20px_60px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.14)]",
        variant === "default" &&
          "border-white/12 bg-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.10)]",
        variant === "subtle" &&
          "border-white/10 bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
        className
      )}
    >
      {children}
    </div>
  )
}
