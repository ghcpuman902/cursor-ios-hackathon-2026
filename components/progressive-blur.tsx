"use client"

import type { CSSProperties } from "react"

import { cn } from "@/lib/utils"

type ProgressiveBlurProps = {
  direction?: "top" | "bottom" | "left" | "right"
  blurLayers?: number
  blurIntensity?: number
  className?: string
  style?: CSSProperties
}

const getMaskGradient = (
  direction: NonNullable<ProgressiveBlurProps["direction"]>,
  index: number,
  total: number
) => {
  const segment = 100 / total
  const blurStart = index * segment
  const blurEnd = Math.min(100, blurStart + segment * 2.25)
  const stops = `transparent 0%, transparent ${blurStart}%, black ${blurEnd}%, black 100%`

  switch (direction) {
    case "top":
      return `linear-gradient(to top, ${stops})`
    case "bottom":
      return `linear-gradient(to bottom, ${stops})`
    case "left":
      return `linear-gradient(to left, ${stops})`
    case "right":
      return `linear-gradient(to right, ${stops})`
  }
}

export const ProgressiveBlur = ({
  direction = "bottom",
  blurLayers = 6,
  blurIntensity = 0.22,
  className,
  style,
}: ProgressiveBlurProps) => {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute overflow-hidden", className)}
      style={style}
    >
      {Array.from({ length: blurLayers }, (_, index) => {
        const blurAmount = (index + 1) * blurIntensity * 14

        return (
          <div
            key={index}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blurAmount}px)`,
              WebkitBackdropFilter: `blur(${blurAmount}px)`,
              maskImage: getMaskGradient(direction, index, blurLayers),
              WebkitMaskImage: getMaskGradient(direction, index, blurLayers),
            }}
          />
        )
      })}
    </div>
  )
}
