"use client"

import { Button } from "@/components/ui/button"

type PresetChipsProps = {
  phrases: readonly string[]
  disabled?: boolean
  onSelect: (phrase: string) => void
  theme?: "male-translator" | "female-translator"
}

export const PresetChips = ({
  phrases,
  disabled = false,
  onSelect,
  theme = "male-translator",
}: PresetChipsProps) => {
  const label =
    theme === "female-translator" ? "Quest prompts" : "Message examples"

  return (
    <div className="flex flex-wrap gap-2" role="list" aria-label={label}>
      {phrases.map((phrase) => (
        <Button
          key={phrase}
          type="button"
          variant="outline"
          size="sm"
          role="listitem"
          className="translator-control rounded-full border text-foreground/80 backdrop-blur-sm hover:text-foreground"
          onClick={() => onSelect(phrase)}
          disabled={disabled}
        >
          &ldquo;{phrase}&rdquo;
        </Button>
      ))}
    </div>
  )
}
