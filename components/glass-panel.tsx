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
          "border-white/15 bg-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.12)]",
        variant === "default" &&
          "border-white/10 bg-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)]",
        variant === "subtle" &&
          "border-white/8 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
        className,
      )}
    >
      {children}
    </div>
  )
}
