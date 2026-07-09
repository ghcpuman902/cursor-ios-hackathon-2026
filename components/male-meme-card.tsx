import Image from "next/image"

import type { MaleMeme } from "@/lib/male-memes"
import { cn } from "@/lib/utils"

type MaleMemeCardProps = {
  meme: MaleMeme
  className?: string
}

export function MaleMemeCard({ meme, className }: MaleMemeCardProps) {
  return (
    <div
      className={cn(
        "max-w-[88%] overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl",
        className,
      )}
    >
      <div className="relative aspect-[4/3] w-full bg-black/20">
        <Image
          src={meme.src}
          alt={meme.alt}
          fill
          unoptimized
          className="object-cover"
          sizes="(max-width: 448px) 88vw, 360px"
        />
      </div>
      <p className="border-t border-white/10 px-3 py-2 text-center text-[11px] font-medium tracking-wide text-white/55 uppercase">
        {meme.caption}
      </p>
    </div>
  )
}
