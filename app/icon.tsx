import { ImageResponse } from "next/og"

import { AppIconMarkup } from "@/lib/app-icon-markup"

export const size = {
  width: 512,
  height: 512,
}

export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(<AppIconMarkup size={512} />, {
    ...size,
  })
}
