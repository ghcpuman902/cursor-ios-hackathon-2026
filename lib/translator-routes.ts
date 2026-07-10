import type { TranslatorGender } from "@/lib/translator"

export const TRANSLATOR_PATHS = {
  male: "/male",
  female: "/female",
} as const satisfies Record<TranslatorGender, string>

export const DEFAULT_TRANSLATOR_PATH = TRANSLATOR_PATHS.male

export const isTranslatorGender = (value: string): value is TranslatorGender =>
  value === "male" || value === "female"

export const genderFromPathname = (pathname: string): TranslatorGender =>
  pathname === TRANSLATOR_PATHS.female ? "female" : "male"
