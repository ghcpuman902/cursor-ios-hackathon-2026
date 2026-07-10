"use client"

import Image from "next/image"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"

type AttachmentPreviewProps = {
  previewUrl: string
  fileName?: string
  disabled?: boolean
  onRemove: () => void
}

export const AttachmentPreview = ({
  previewUrl,
  fileName,
  disabled = false,
  onRemove,
}: AttachmentPreviewProps) => {
  return (
    <div className="translator-surface inline-flex max-w-full items-center gap-2 rounded-2xl border p-1.5 pr-2 backdrop-blur-xl">
      <div className="relative size-12 overflow-hidden rounded-xl bg-black/30">
        <Image
          src={previewUrl}
          alt={fileName ? `Attached ${fileName}` : "Attached screenshot"}
          width={96}
          height={96}
          unoptimized
          className="size-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-foreground/85">
          {fileName ?? "Screenshot"}
        </p>
        <p className="text-[10px] text-muted-foreground">Attached context</p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="size-7 shrink-0 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        onClick={onRemove}
        disabled={disabled}
        aria-label="Remove screenshot"
      >
        <X className="size-3.5" aria-hidden />
      </Button>
    </div>
  )
}
