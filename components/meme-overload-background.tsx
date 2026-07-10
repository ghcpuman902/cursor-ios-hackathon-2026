"use client"

/* eslint-disable @next/next/no-img-element -- Remote community images are rendered as decorative background tiles. */

import { useEffect, useState } from "react"

type MemeTile = {
  id: string
  title: string
  imageUrl: string
  source: "relationship-memes" | "classic"
}

let cachedMemes: MemeTile[] | null = null
let cachedMemesAt = 0

const MEME_CACHE_MS = 60 * 60 * 1000

const isMemeCacheFresh = () =>
  cachedMemes !== null && Date.now() - cachedMemesAt < MEME_CACHE_MS

const BRO_STRIPS = [
  { text: "QUEST LOG UPDATED", side: "left" as const, top: "10%" },
  { text: "BRO, READ THE ROOM", side: "right" as const, top: "22%" },
  { text: "RELATIONSHIP RAID BOSS", side: "left" as const, top: "48%" },
  { text: "NO SKIP CUTSCENES", side: "right" as const, top: "58%" },
  { text: "EMOTIONAL DAMAGE: AVOIDABLE", side: "left" as const, top: "74%" },
  { text: "TACTICAL HONESTY +10", side: "right" as const, top: "86%" },
]

const MEME_SLOTS = [
  { top: "5%", left: "1%", rotate: -7 },
  { top: "34%", left: "2%", rotate: 5 },
  { top: "63%", left: "0.5%", rotate: -4 },
  { top: "7%", right: "1%", rotate: 8 },
  { top: "36%", right: "2%", rotate: -6 },
  { top: "65%", right: "0.5%", rotate: 6 },
] as const

const MEME_COUNT = MEME_SLOTS.length

export const MemeOverloadBackground = () => {
  const [memes, setMemes] = useState<MemeTile[]>(cachedMemes ?? [])

  useEffect(() => {
    if (isMemeCacheFresh()) return

    const controller = new AbortController()

    const loadMemes = async () => {
      try {
        const response = await fetch("/api/memes", {
          signal: controller.signal,
          cache: "default",
        })
        if (!response.ok) return

        const data = (await response.json()) as { memes?: MemeTile[] }
        if (!Array.isArray(data.memes)) return

        cachedMemes = data.memes
        cachedMemesAt = Date.now()
        setMemes(data.memes)
      } catch {
        // The Roman theme remains fully usable without a live meme feed.
      }
    }

    void loadMemes()

    return () => controller.abort()
  }, [])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-visible bg-[radial-gradient(circle_at_15%_18%,rgba(145,87,20,0.36),transparent_28%),radial-gradient(circle_at_84%_70%,rgba(112,23,15,0.34),transparent_26%),linear-gradient(135deg,#120e09_0%,#241709_48%,#100d0a_100%)]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,215,131,0.12)_50%,transparent_100%)] opacity-30" />

      {BRO_STRIPS.map((strip) => (
        <p
          key={strip.text}
          className="absolute max-w-[38vw] font-mono text-[10px] font-bold tracking-[0.28em] text-amber-100/25 uppercase sm:max-w-[9rem] sm:text-[11px]"
          style={{
            top: strip.top,
            left: strip.side === "left" ? "1%" : undefined,
            right: strip.side === "right" ? "1%" : undefined,
            transform: `rotate(${strip.side === "left" ? -9 : 9}deg)`,
          }}
        >
          {strip.text}
        </p>
      ))}

      {memes.slice(0, MEME_COUNT).map((meme, index) => {
        const slot = MEME_SLOTS[index]

        return (
          <figure
            key={meme.id}
            className="meme-tile absolute w-fit max-w-[42vw] overflow-visible border border-amber-100/20 bg-stone-950/55 p-1.5 shadow-[0_16px_34px_rgba(0,0,0,0.45)] sm:max-w-none"
            style={{
              top: slot.top,
              left: "left" in slot ? slot.left : undefined,
              right: "right" in slot ? slot.right : undefined,
              ["--meme-rotate" as string]: `${slot.rotate}deg`,
            }}
          >
            <img
              src={meme.imageUrl}
              alt=""
              className="block h-auto max-h-44 w-auto max-w-44 object-contain opacity-90 grayscale-[0.1] sepia-[0.1] sm:max-h-56 sm:max-w-52 md:max-h-64 md:max-w-56"
            />
            <figcaption className="sr-only">
              {meme.source === "classic" ? "Classic wisdom" : meme.title}
            </figcaption>
          </figure>
        )
      })}

      <div className="absolute -top-24 left-1/2 size-136 -translate-x-1/2 rounded-full border border-amber-200/10 bg-amber-400/5 blur-3xl" />
    </div>
  )
}
