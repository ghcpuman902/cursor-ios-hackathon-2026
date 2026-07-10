export type {
  FemaleTranslation,
  MaleTranslation,
  RiskLevel,
  TranslationCategory,
  TranslationDirection,
  TranslationEntry,
} from "@/lib/translation-types"

export {
  CATEGORY_LABELS,
  RISK_ACTIONS,
  RISK_LABELS,
} from "@/lib/translation-types"

export { MALE_TRANSLATIONS } from "@/lib/translations-male"
export { FEMALE_TRANSLATIONS } from "@/lib/translations-female"

import type { TranslationEntry } from "@/lib/translation-types"

/** Presets for male → female (“what he said”). */
export const MALE_SAMPLE_PHRASES = [
  "k",
  "I'm almost there",
  "Trust me",
  "You should've reminded me",
  "It's not that deep",
  "Family stuff",
  "The match kicks off at 1am",
  "Meeting the lads for the match",
  "Make me a tea",
  "What do you want me to do",
] as const

/** Presets for female → male (“what she said”). */
export const FEMALE_SAMPLE_PHRASES = [
  "I'm fine",
  "Do whatever you want",
  "Never mind",
  "Where are you",
  "On the way",
  "You said that",
  "It's fine",
  "We need to talk",
  "Just be honest",
  "Have fun with your friends then",
] as const

/** @deprecated Prefer MALE_SAMPLE_PHRASES or FEMALE_SAMPLE_PHRASES */
export const SAMPLE_PHRASES = MALE_SAMPLE_PHRASES

export const LOADING_MESSAGES = [
  "Consulting the cosy horoscope…",
  "Shuffling the soft tarot…",
  "Reading his emotional weather…",
  "Checking today's tiny omen…",
  "Warming up the personality quiz…",
  "Asking the moon about 'k'…",
  "Translating shrug into starlight…",
] as const

export const FEMALE_LOADING_MESSAGES = [
  "Scanning for quest markers…",
  "Checking boss music levels…",
  "Opening the meme decoder…",
  "Mapping hidden side quests…",
  "Consulting bro explanations…",
  "Measuring emotional damage risk…",
  "Loading lowest-risk reply…",
] as const

/** male→female fallbacks when no pattern matches */
export const FALLBACK_ENTRIES: TranslationEntry[] = [
  {
    pattern: "",
    headline: "🌙 Soft Static",
    comicTranslation:
      "The signal is fuzzy. Today's theory: he said words, and they may mean roughly those words.",
    possibleActualMeaning:
      "Without a clearer omen, he may not be carrying a secret novel.",
    riskLevel: "low",
    lowestRiskReply: "Got it — thanks for saying.",
    tinyWholesomeNudge:
      "Do not invent a cathedral of meaning from unclear weather.",
    category: "classic",
  },
  {
    pattern: "",
    headline: "🃏 Incomplete Spread",
    comicTranslation:
      "Not enough cards for a full reading. He may simply be… existing.",
    possibleActualMeaning:
      "Hunger, tiredness, or mild human vagueness could explain a lot.",
    riskLevel: "low",
    lowestRiskReply: "All good. Ping me if there's more.",
    tinyWholesomeNudge: "Food may solve 40% of this plot.",
    category: "classic",
  },
]

/** female→male fallbacks when no pattern matches */
export const FEMALE_FALLBACK_ENTRIES: TranslationEntry[] = [
  {
    pattern: "",
    headline: "🎮 Signal Fuzzy",
    comicTranslation:
      "Quest log incomplete. Do not invent the whole campaign from one line.",
    possibleActualMeaning:
      "Could be light. Could be loaded. Context decides.",
    riskLevel: "medium",
    lowestRiskReply: "Want to say more, or want space?",
    tinyWholesomeNudge: "One gentle question. Then pause.",
    category: "classic",
  },
  {
    pattern: "",
    headline: "🗺️ No Clear Marker",
    comicTranslation:
      "Objective unclear. Listen first. Solve never (yet).",
    possibleActualMeaning:
      "She may want presence more than a patch.",
    riskLevel: "medium",
    lowestRiskReply: "I'm here. No fixing unless you want it.",
    tinyWholesomeNudge: "Do not optimise. Be present.",
    category: "classic",
  },
]

/** Long female vents — still quest-coded, still short */
export const FEMALE_LONG_INPUT_ENTRIES: TranslationEntry[] = [
  {
    pattern: "",
    headline: "📜 Long Quest Log",
    comicTranslation:
      "She talked forever. Headline: something matters and she wants you to notice.",
    possibleActualMeaning:
      "The length is the signal. Presence > perfect summary.",
    riskLevel: "medium",
    lowestRiskReply: "I heard you. The part that stuck is you felt unheard — did I get that right?",
    tinyWholesomeNudge: "Reflect one line. Don't debate the essay.",
    category: "emotions",
  },
  {
    pattern: "",
    headline: "🎬 Extended Cutscene",
    comicTranslation:
      "Long monologue boss fight. She may want empathy, not a strategy guide.",
    possibleActualMeaning:
      "Venting can be the request. Solutions can wait.",
    riskLevel: "medium",
    lowestRiskReply: "That sounds heavy. Want comfort or ideas?",
    tinyWholesomeNudge: "Ask the mode. Then match it.",
    category: "emotions",
  },
]

/** @deprecated Prefer FALLBACK_ENTRIES — kept for any stray imports */
export const FALLBACK_TRANSLATIONS = FALLBACK_ENTRIES.map(
  (e) => e.comicTranslation
)

/** @deprecated Prefer FEMALE_FALLBACK_ENTRIES */
export const FEMALE_FALLBACK_TRANSLATIONS = FEMALE_FALLBACK_ENTRIES.map(
  (e) => e.comicTranslation
)

/** @deprecated Prefer FEMALE_LONG_INPUT_ENTRIES */
export const FEMALE_LONG_INPUT_TRANSLATIONS = FEMALE_LONG_INPUT_ENTRIES.map(
  (e) => e.comicTranslation
)

export const GRUNT_ANNOTATIONS = [
  " ✦",
  " 🌙",
  " *[soft shuffle of cards]*",
  " *[the candles flicker]*",
] as const
