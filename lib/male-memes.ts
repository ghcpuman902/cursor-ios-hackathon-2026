import type { TranslationCategory } from "@/lib/translations"
import type { TranslationResult } from "@/lib/translator"

export type MaleMeme = {
  src: string
  alt: string
  caption: string
}

type MemeRule = {
  patterns: string[]
  meme: MaleMeme
}

const normalizeInput = (text: string): string =>
  text.trim().toLowerCase().replace(/\s+/g, " ")

const matchesPattern = (normalized: string, pattern: string): boolean => {
  if (pattern === "k") {
    return normalized === "k"
  }

  return normalized === pattern || normalized.includes(pattern)
}

const MALE_MEME_RULES: MemeRule[] = [
  {
    patterns: ["i'm fine", "im fine", "nothing's wrong", "nothings wrong", "it's fine", "its fine"],
    meme: {
      src: "/memes/this-is-fine.svg",
      alt: "This is fine dog sitting in a burning room",
      caption: "This is fine.",
    },
  },
  {
    patterns: ["do whatever you want"],
    meme: {
      src: "/memes/sweating-buttons.svg",
      alt: "Sweating over two buttons meme",
      caption: "Choose wisely.",
    },
  },
  {
    patterns: ["sounds good", "i'm listening", "im listening", "yeah yeah"],
    meme: {
      src: "/memes/distracted-boyfriend.svg",
      alt: "Distracted boyfriend looking away",
      caption: "Not listening.",
    },
  },
  {
    patterns: ["i'm almost there", "im almost there", "hold on", "i'll be ready", "ill be ready"],
    meme: {
      src: "/memes/not-leaving.svg",
      alt: "Person still on the couch not leaving",
      caption: "Still not there.",
    },
  },
  {
    patterns: ["k"],
    meme: {
      src: "/memes/npc-face.svg",
      alt: "Blank NPC expression",
      caption: "NPC response unlocked.",
    },
  },
  {
    patterns: ["bruh"],
    meme: {
      src: "/memes/bruh.svg",
      alt: "Bruh moment",
      caption: "Bruh.",
    },
  },
  {
    patterns: ["sorry"],
    meme: {
      src: "/memes/hide-pain.svg",
      alt: "Smiling through the pain",
      caption: "Sorry (allegedly).",
    },
  },
  {
    patterns: ["let me check", "i'll think about it", "ill think about it", "idk"],
    meme: {
      src: "/memes/thinking.svg",
      alt: "Thinking hard about nothing",
      caption: "Processing…",
    },
  },
  {
    patterns: ["i'm busy", "im busy", "we should hang out"],
    meme: {
      src: "/memes/homer-bush.svg",
      alt: "Backing out of plans into bushes",
      caption: "Nope.",
    },
  },
  {
    patterns: ["no worries"],
    meme: {
      src: "/memes/padme-right.svg",
      alt: "Padme asking if that's really fine",
      caption: "…right?",
    },
  },
]

const CATEGORY_MEMES: Partial<Record<TranslationCategory, MaleMeme>> = {
  plans: {
    src: "/memes/not-leaving.svg",
    alt: "Still not on the way",
    caption: "ETA: undefined.",
  },
  apology: {
    src: "/memes/hide-pain.svg",
    alt: "Apology in progress",
    caption: "My bad (emotionally).",
  },
}

export function getMaleMeme(
  input: string,
  result: TranslationResult,
): MaleMeme | null {
  const normalized = normalizeInput(input)

  if (!normalized) return null

  if (result.matchedPattern) {
    const pattern = result.matchedPattern.toLowerCase()
    const byPattern = MALE_MEME_RULES.find((rule) =>
      rule.patterns.some((p) => p === pattern),
    )
    if (byPattern) return byPattern.meme
  }

  for (const rule of MALE_MEME_RULES) {
    if (rule.patterns.some((pattern) => matchesPattern(normalized, pattern))) {
      return rule.meme
    }
  }

  if (!result.isFallback && result.category !== "mystery") {
    return CATEGORY_MEMES[result.category] ?? null
  }

  return null
}
