export type TranslationCategory =
  "texting" | "relationship" | "plans" | "apology" | "emotions" | "classic"

export type TranslationEntry = {
  /** Case-insensitive substring or exact match */
  pattern: string
  translation: string
  /** Spicier version when sarcasm level >= 8 */
  spicyTranslation?: string
  category: TranslationCategory
  /** Always fake. Always over 100%. */
  confidence: number
}

export type MaleTranslation = TranslationEntry
export type FemaleTranslation = TranslationEntry

export const MALE_TRANSLATIONS: MaleTranslation[] = [
  {
    pattern: "k",
    translation: "I am mildly annoyed but will not elaborate.",
    spicyTranslation: "You have failed a test you didn't know you were taking.",
    category: "texting",
    confidence: 134,
  },
  {
    pattern: "i'm fine",
    translation:
      "I am not fine. This is a test. You are currently failing the test.",
    category: "emotions",
    confidence: 142,
  },
  {
    pattern: "im fine",
    translation:
      "I am not fine. This is a test. You are currently failing the test.",
    category: "emotions",
    confidence: 142,
  },
  {
    pattern: "nothing's wrong",
    translation:
      "Everything is wrong. I will think about it alone in the car for 20 minutes with the engine off.",
    category: "emotions",
    confidence: 138,
  },
  {
    pattern: "nothings wrong",
    translation:
      "Everything is wrong. I will think about it alone in the car for 20 minutes with the engine off.",
    category: "emotions",
    confidence: 138,
  },
  {
    pattern: "we should hang out sometime",
    translation:
      "I will never initiate plans and will act confused if you don't text me first.",
    category: "plans",
    confidence: 129,
  },
  {
    pattern: "i'm almost there",
    translation: "I have not left the couch. I may not be wearing pants.",
    spicyTranslation: "I am in another dimension. ETA: unknown.",
    category: "plans",
    confidence: 156,
  },
  {
    pattern: "im almost there",
    translation: "I have not left the couch. I may not be wearing pants.",
    category: "plans",
    confidence: 156,
  },
  {
    pattern: "sorry",
    translation:
      "I am sorry you are upset. I am not entirely sure what I did, but I am sorry about the upset part.",
    category: "apology",
    confidence: 111,
  },
  {
    pattern: "idk",
    translation:
      "I know. I absolutely know. I just don't want to have this conversation.",
    category: "texting",
    confidence: 147,
  },
  {
    pattern: "sounds good",
    translation:
      "I did not listen to a single word you said. Affirmative noise deployed.",
    category: "texting",
    confidence: 125,
  },
  {
    pattern: "let me check",
    translation:
      "I already know the answer is no, but I need to pretend I thought about it for 48 hours.",
    category: "classic",
    confidence: 133,
  },
  {
    pattern: "i'm listening",
    translation:
      "I am thinking about whether the Vikings would win if they had jetpacks.",
    category: "classic",
    confidence: 119,
  },
  {
    pattern: "im listening",
    translation:
      "I am thinking about whether the Vikings would win if they had jetpacks.",
    category: "classic",
    confidence: 119,
  },
  {
    pattern: "bruh",
    translation: "Profound emotional distress, expressed as a single syllable.",
    category: "emotions",
    confidence: 201,
  },
  {
    pattern: "yeah yeah",
    translation:
      "Please stop talking so I can leave the conversation gracefully.",
    category: "texting",
    confidence: 118,
  },
  {
    pattern: "hold on",
    translation: "I will now disappear for 45 minutes without explanation.",
    category: "texting",
    confidence: 144,
  },
  {
    pattern: "it's not that deep",
    translation:
      "It is extremely deep to me, but I cannot articulate why, so we're calling it shallow.",
    category: "emotions",
    confidence: 136,
  },
  {
    pattern: "its not that deep",
    translation:
      "It is extremely deep to me, but I cannot articulate why, so we're calling it shallow.",
    category: "emotions",
    confidence: 136,
  },
  {
    pattern: "no worries",
    translation: "I will silently catalog this for our next argument.",
    category: "relationship",
    confidence: 127,
  },
  {
    pattern: "do whatever you want",
    translation:
      "Do NOT do whatever you want. There is a correct answer. I will not tell you what it is.",
    spicyTranslation:
      "This is a trap. I repeat: this is a trap. Choose wisely or perish.",
    category: "relationship",
    confidence: 189,
  },
  {
    pattern: "i don't care",
    translation:
      "I care deeply. I am performing indifference for dramatic effect.",
    category: "emotions",
    confidence: 131,
  },
  {
    pattern: "i dont care",
    translation:
      "I care deeply. I am performing indifference for dramatic effect.",
    category: "emotions",
    confidence: 131,
  },
  {
    pattern: "i'm tired",
    translation:
      "I am not tired. I am emotionally unavailable and calling it sleep.",
    category: "emotions",
    confidence: 122,
  },
  {
    pattern: "im tired",
    translation:
      "I am not tired. I am emotionally unavailable and calling it sleep.",
    category: "emotions",
    confidence: 122,
  },
  {
    pattern: "you're overthinking it",
    translation:
      "I am underthinking it and would like you to join me in the shallow end.",
    category: "relationship",
    confidence: 140,
  },
  {
    pattern: "youre overthinking it",
    translation:
      "I am underthinking it and would like you to join me in the shallow end.",
    category: "relationship",
    confidence: 140,
  },
  {
    pattern: "i'll be ready in 5 minutes",
    translation:
      "I have not started getting ready. 5 minutes is a concept, not a timeline.",
    category: "plans",
    confidence: 163,
  },
  {
    pattern: "ill be ready in 5 minutes",
    translation:
      "I have not started getting ready. 5 minutes is a concept, not a timeline.",
    category: "plans",
    confidence: 163,
  },
  {
    pattern: "nah i'm good",
    translation:
      "I am not good. I am suffering in silence with a stiff upper lip and a soft lower snack.",
    category: "emotions",
    confidence: 128,
  },
  {
    pattern: "nah im good",
    translation:
      "I am not good. I am suffering in silence with a stiff upper lip and a soft lower snack.",
    category: "emotions",
    confidence: 128,
  },
  {
    pattern: "lol",
    translation: "I am uncomfortable and deploying humor as a smoke bomb.",
    category: "texting",
    confidence: 115,
  },
  {
    pattern: "haha",
    translation:
      "That was not funny but I appreciate the effort and want this to end peacefully.",
    category: "texting",
    confidence: 112,
  },
  {
    pattern: "i'll think about it",
    translation:
      "I have already decided no. I am buying time so you forget you asked.",
    category: "classic",
    confidence: 137,
  },
  {
    pattern: "ill think about it",
    translation:
      "I have already decided no. I am buying time so you forget you asked.",
    category: "classic",
    confidence: 137,
  },
  {
    pattern: "it's fine",
    translation:
      "It is not fine. I am choosing peace over honesty. Temporarily.",
    category: "emotions",
    confidence: 126,
  },
  {
    pattern: "its fine",
    translation:
      "It is not fine. I am choosing peace over honesty. Temporarily.",
    category: "emotions",
    confidence: 126,
  },
  {
    pattern: "i'm busy",
    translation:
      "I am watching a 45-minute video about a guy restoring a rusty lawnmower.",
    category: "plans",
    confidence: 121,
  },
  {
    pattern: "im busy",
    translation:
      "I am watching a 45-minute video about a guy restoring a rusty lawnmower.",
    category: "plans",
    confidence: 121,
  },
]

export const FEMALE_TRANSLATIONS: FemaleTranslation[] = [
  {
    pattern: "i'm fine",
    translation: "Not fine.",
    spicyTranslation: "Run.",
    category: "emotions",
    confidence: 149,
  },
  {
    pattern: "im fine",
    translation: "Not fine.",
    spicyTranslation: "Run.",
    category: "emotions",
    confidence: 149,
  },
  {
    pattern: "it's fine",
    translation: "It's not.",
    spicyTranslation: "Lawyer up.",
    category: "emotions",
    confidence: 146,
  },
  {
    pattern: "its fine",
    translation: "It's not.",
    spicyTranslation: "Lawyer up.",
    category: "emotions",
    confidence: 146,
  },
  {
    pattern: "nothing",
    translation: "Everything.",
    spicyTranslation: "EVERYTHING.",
    category: "emotions",
    confidence: 141,
  },
  {
    pattern: "do whatever you want",
    translation: "Trap.",
    spicyTranslation: "Choose death.",
    category: "relationship",
    confidence: 192,
  },
  {
    pattern: "sure",
    translation: "No.",
    spicyTranslation: "Hard no.",
    category: "texting",
    confidence: 128,
  },
  {
    pattern: "okay",
    translation: "Not okay.",
    spicyTranslation: "We're done.",
    category: "texting",
    confidence: 132,
  },
  {
    pattern: "we need to talk",
    translation: "Uh oh.",
    spicyTranslation: "You died.",
    category: "relationship",
    confidence: 176,
  },
  {
    pattern: "i don't care",
    translation: "She cares.",
    spicyTranslation: "She cares.",
    category: "emotions",
    confidence: 139,
  },
  {
    pattern: "i dont care",
    translation: "She cares.",
    spicyTranslation: "She cares.",
    category: "emotions",
    confidence: 139,
  },
  {
    pattern: "you should know",
    translation: "You don't.",
    spicyTranslation: "Clueless.",
    category: "relationship",
    confidence: 158,
  },
  {
    pattern: "i'm not mad",
    translation: "She's mad.",
    spicyTranslation: "Nuclear.",
    category: "emotions",
    confidence: 151,
  },
  {
    pattern: "im not mad",
    translation: "She's mad.",
    spicyTranslation: "Nuclear.",
    category: "emotions",
    confidence: 151,
  },
  {
    pattern: "five minutes",
    translation: "One hour.",
    spicyTranslation: "Never.",
    category: "plans",
    confidence: 137,
  },
  {
    pattern: "i'll be ready soon",
    translation: "She's not.",
    spicyTranslation: "Still bed.",
    category: "plans",
    confidence: 143,
  },
  {
    pattern: "ill be ready soon",
    translation: "She's not.",
    spicyTranslation: "Still bed.",
    category: "plans",
    confidence: 143,
  },
  {
    pattern: "don't worry about it",
    translation: "Worry.",
    spicyTranslation: "PANIC.",
    category: "relationship",
    confidence: 164,
  },
  {
    pattern: "dont worry about it",
    translation: "Worry.",
    spicyTranslation: "PANIC.",
    category: "relationship",
    confidence: 164,
  },
  {
    pattern: "sorry",
    translation: "Not forgiven.",
    spicyTranslation: "Couch tonight.",
    category: "apology",
    confidence: 124,
  },
  {
    pattern: "maybe",
    translation: "No.",
    spicyTranslation: "Absolutely not.",
    category: "plans",
    confidence: 126,
  },
  {
    pattern: "have fun",
    translation: "Don't.",
    spicyTranslation: "Don't breathe.",
    category: "relationship",
    confidence: 135,
  },
  {
    pattern: "i'm tired",
    translation: "You're tired.",
    spicyTranslation: "Of you.",
    category: "emotions",
    confidence: 138,
  },
  {
    pattern: "im tired",
    translation: "You're tired.",
    spicyTranslation: "Of you.",
    category: "emotions",
    confidence: 138,
  },
  {
    pattern: "never mind",
    translation: "Remember it.",
    spicyTranslation: "Remember EVERYTHING.",
    category: "classic",
    confidence: 155,
  },
  {
    pattern: "nevermind",
    translation: "Remember it.",
    spicyTranslation: "Remember EVERYTHING.",
    category: "classic",
    confidence: 155,
  },
  {
    pattern: "per my last email",
    translation: "Read it.",
    spicyTranslation: "Illiterate.",
    category: "texting",
    confidence: 167,
  },
  {
    pattern: "if you wanted to",
    translation: "You should.",
    spicyTranslation: "You failed.",
    category: "relationship",
    confidence: 161,
  },
]

export const SAMPLE_PHRASES = [
  "k",
  "I'm fine",
  "Do whatever you want",
  "I'm almost there",
  "Sounds good",
  "Bruh",
] as const

export const FEMALE_SAMPLE_PHRASES = [
  "I'm fine",
  "Do whatever you want",
  "We need to talk",
  "I just think it's funny how you never listen when I talk about my day but then you wonder why I'm quiet",
  "Never mind",
  "Per my last email",
] as const

export const LOADING_MESSAGES = [
  "Consulting the Council of Dudes…",
  "Decoding shrug intensity…",
  "Cross-referencing ESPN with emotional availability…",
  "Running it through the Grunt-to-English pipeline…",
  "Asking his mom what he meant…",
  "Checking if he was actually listening…",
  "Translating passive-aggressive subtext…",
  "Measuring testosterone-to-words ratio…",
] as const

export const FEMALE_LOADING_MESSAGES = [
  "Condensing 400 words…",
  "TL;DR-ing the monologue…",
  "Extracting one word…",
  "Skipping to the point…",
  "Consulting the group chat…",
  "Finding the real headline…",
  "Compressing the essay…",
] as const

export const FALLBACK_TRANSLATIONS = [
  "Unclear transmission. Possible causes: hunger, sports, or fear of vulnerability.",
  "He said words. Whether they meant anything is still under peer review.",
  "Translation failed. Input may be too emotionally honest for the male dialect.",
  "Signal lost. He may have been distracted by a bird or a cool truck.",
  "Insufficient data. Try again after he finishes his 'quick' 3-hour gaming session.",
] as const

export const FEMALE_FALLBACK_TRANSLATIONS = [
  "It's fine.",
  "Whatever.",
  "K.",
  "Sure.",
  "Anyway.",
  "Noted.",
  "Go ahead.",
  "I'm listening.",
  "Do better.",
] as const

/** Ultra-short decodes when she talked forever */
export const FEMALE_LONG_INPUT_TRANSLATIONS = [
  "I'm fine.",
  "K.",
  "Whatever.",
  "Sure.",
  "Anyway.",
  "Not mad.",
  "It's fine.",
  "Go ahead.",
  "You forgot.",
  "Do better.",
  "I'm tired.",
  "Pick one.",
  "Remember that.",
  "Wow.",
  "Interesting.",
] as const

export const GRUNT_ANNOTATIONS = [
  " *[grunt]*",
  " *[exhales through nose]*",
  " *[stares at wall]*",
  " *[single eyebrow raise]*",
] as const

export const CATEGORY_LABELS: Record<TranslationCategory, string> = {
  texting: "📱 Texting",
  relationship: "💔 Relationship",
  plans: "📅 Plans",
  apology: "🙏 Apology (alleged)",
  emotions: "🎭 Emotions (buried)",
  classic: "🏛️ Classic",
}
