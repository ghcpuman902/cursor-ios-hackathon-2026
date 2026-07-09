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
          "border-white/90 bg-white/78 shadow-[0_24px_70px_rgba(30,41,59,0.10),inset_0_1px_0_rgba(255,255,255,0.9)]",
        variant === "default" &&
          "border-white/85 bg-white/68 shadow-[0_18px_55px_rgba(30,41,59,0.08),inset_0_1px_0_rgba(255,255,255,0.85)]",
        variant === "subtle" &&
          "border-white/80 bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]",
        className
      )}
    >
      {children}
    </div>
  )
}
