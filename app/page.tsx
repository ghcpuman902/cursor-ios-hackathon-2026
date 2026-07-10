import { redirect } from "next/navigation"

import { DEFAULT_TRANSLATOR_PATH } from "@/lib/translator-routes"

export default function Page() {
  redirect(DEFAULT_TRANSLATOR_PATH)
}
