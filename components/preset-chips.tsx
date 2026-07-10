"use client"

import { Button } from "@/components/ui/button"

type PresetChipsProps = {
  phrases: readonly string[]
  disabled?: boolean
  onSelect: (phrase: string) => void
}

export const PresetChips = ({
  phrases,
  disabled = false,
  onSelect,
}: PresetChipsProps) => {
  return (
    <div className="flex flex-wrap gap-2" role="list" aria-label="Preset phrases">
      {phrases.map((phrase) => (
        <Button
          key={phrase}
          type="button"
          variant="outline"
          size="sm"
          role="listitem"
          className="rounded-full border-white/12 bg-white/[0.06] text-white/70 hover:bg-white/12 hover:text-white"
          onClick={() => onSelect(phrase)}
          disabled={disabled}
        >
          &ldquo;{phrase}&rdquo;
        </Button>
      ))}
    </div>
  )
}
