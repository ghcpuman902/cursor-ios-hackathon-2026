"use client"

import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

type VoiceWaveProps = {
  levels: number[]
  isActive: boolean
  className?: string
}

export function VoiceWave({ levels, isActive, className }: VoiceWaveProps) {
  const reduceMotion = useReducedMotion()
  const midpoint = Math.ceil(levels.length / 2)
  const leftLevels = levels.slice(0, midpoint).reverse()
  const rightLevels = levels.slice(midpoint)

  return (
    <div
      aria-hidden
      className={cn(
        "flex h-16 items-center justify-center gap-[3px] sm:h-20 sm:gap-1",
        className,
      )}
    >
      {leftLevels.map((level, index) => (
        <WaveBar
          key={`left-${index}`}
          level={level}
          isActive={isActive}
          reduceMotion={reduceMotion}
          delay={index * 0.02}
        />
      ))}

      <div
        className={cn(
          "mx-1 size-2 rounded-full bg-primary/20 transition-opacity sm:mx-2 sm:size-2.5",
          isActive ? "opacity-100" : "opacity-30",
        )}
      />

      {rightLevels.map((level, index) => (
        <WaveBar
          key={`right-${index}`}
          level={level}
          isActive={isActive}
          reduceMotion={reduceMotion}
          delay={index * 0.02}
        />
      ))}
    </div>
  )
}

function WaveBar({
  level,
  isActive,
  reduceMotion,
  delay,
}: {
  level: number
  isActive: boolean
  reduceMotion: boolean | null
  delay: number
}) {
  const minHeight = 0.18
  const height = isActive ? Math.max(minHeight, level) : minHeight

  if (reduceMotion) {
    return (
      <span
        className="w-[3px] rounded-full bg-primary/70 sm:w-1"
        style={{ height: `${height * 100}%` }}
      />
    )
  }

  return (
    <motion.span
      className="w-[3px] origin-center rounded-full bg-gradient-to-t from-primary/50 to-primary sm:w-1"
      initial={false}
      animate={{
        height: `${height * 100}%`,
        opacity: isActive ? 0.55 + level * 0.45 : 0.25,
      }}
      transition={{
        type: "spring",
        stiffness: 420,
        damping: 24,
        mass: 0.35,
        delay,
      }}
    />
  )
}
