import type { MetadataRoute } from "next"

import { env } from "@/lib/env"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: env.NEXT_PUBLIC_APP_NAME,
    short_name: env.NEXT_PUBLIC_APP_NAME,
    description: env.NEXT_PUBLIC_APP_TAGLINE,
    start_url: "/",
    display: "standalone",
    background_color: "#1d1c2d",
    theme_color: "#1d1c2d",
  }
}
