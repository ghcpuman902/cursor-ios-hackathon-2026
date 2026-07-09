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
    translation:
      "Something is wrong. Ask one thoughtful follow-up question, then listen.",
    spicyTranslation:
      "This is an emotional fire alarm. Do not explain why the building is technically still standing.",
    category: "emotions",
    confidence: 149,
  },
  {
    pattern: "im fine",
    translation:
      "Something is wrong. Ask one thoughtful follow-up question, then listen.",
    category: "emotions",
    confidence: 149,
  },
  {
    pattern: "it's fine",
    translation:
      "It is not fine, but the conversation has been temporarily adjourned.",
    spicyTranslation:
      "The issue has entered long-term storage and will be retrieved with receipts.",
    category: "emotions",
    confidence: 146,
  },
  {
    pattern: "its fine",
    translation:
      "It is not fine, but the conversation has been temporarily adjourned.",
    category: "emotions",
    confidence: 146,
  },
  {
    pattern: "nothing",
    translation:
      "There is definitely something. Create space for her to say it without guessing.",
    category: "emotions",
    confidence: 141,
  },
  {
    pattern: "do whatever you want",
    translation:
      "You may choose freely, but your choice will reveal whether you understood the assignment.",
    spicyTranslation:
      "This is not permission. This is the final question on an exam you forgot to study for.",
    category: "relationship",
    confidence: 192,
  },
  {
    pattern: "sure",
    translation:
      "I acknowledge your proposal. Enthusiasm has not been included.",
    category: "texting",
    confidence: 128,
  },
  {
    pattern: "okay",
    translation:
      "Message received. Further emotional processing is happening off-screen.",
    category: "texting",
    confidence: 132,
  },
  {
    pattern: "we need to talk",
    translation:
      "Please give me your full attention. This matters, and multitasking will make it worse.",
    spicyTranslation:
      "Pause the game, close the laptop, and prepare to discover a plotline you somehow missed.",
    category: "relationship",
    confidence: 176,
  },
  {
    pattern: "i don't care",
    translation: "I care, but I am tired of carrying the entire decision.",
    category: "emotions",
    confidence: 139,
  },
  {
    pattern: "i dont care",
    translation: "I care, but I am tired of carrying the entire decision.",
    category: "emotions",
    confidence: 139,
  },
  {
    pattern: "you should know",
    translation:
      "I wanted you to notice without needing a detailed instruction manual.",
    spicyTranslation:
      "The clues were highlighted, underlined, and delivered to your home address.",
    category: "relationship",
    confidence: 158,
  },
  {
    pattern: "i'm not mad",
    translation:
      "I may not be angry, but I am disappointed and would like acknowledgment.",
    category: "emotions",
    confidence: 151,
  },
  {
    pattern: "im not mad",
    translation:
      "I may not be angry, but I am disappointed and would like acknowledgment.",
    category: "emotions",
    confidence: 151,
  },
  {
    pattern: "five minutes",
    translation:
      "I need a little more time. Please stop asking for minute-by-minute telemetry.",
    category: "plans",
    confidence: 137,
  },
  {
    pattern: "i'll be ready soon",
    translation:
      "I am actively getting ready. The departure time remains a flexible estimate.",
    category: "plans",
    confidence: 143,
  },
  {
    pattern: "ill be ready soon",
    translation:
      "I am actively getting ready. The departure time remains a flexible estimate.",
    category: "plans",
    confidence: 143,
  },
  {
    pattern: "don't worry about it",
    translation:
      "Please worry about it enough to take responsibility without being managed.",
    spicyTranslation:
      "I have promoted myself from project manager to silent observer. Your performance review is pending.",
    category: "relationship",
    confidence: 164,
  },
  {
    pattern: "dont worry about it",
    translation:
      "Please worry about it enough to take responsibility without being managed.",
    category: "relationship",
    confidence: 164,
  },
  {
    pattern: "sorry",
    translation:
      "I value the relationship and want us to repair this, not pretend it did not happen.",
    category: "apology",
    confidence: 124,
  },
  {
    pattern: "maybe",
    translation:
      "I am not convinced. More information or a better plan may change the answer.",
    category: "plans",
    confidence: 126,
  },
  {
    pattern: "have fun",
    translation:
      "Enjoy yourself, and also remember that consideration still applies while I am not there.",
    category: "relationship",
    confidence: 135,
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
  "Reading between all available lines…",
  "Checking tone, timing, and punctuation…",
  "Consulting the group chat archives…",
  "Separating words from subtext…",
  "Reviewing the emotional footnotes…",
  "Locating the detail you were supposed to notice…",
] as const

export const FALLBACK_TRANSLATIONS = [
  "Unclear transmission. Possible causes: hunger, sports, or fear of vulnerability.",
  "He said words. Whether they meant anything is still under peer review.",
  "Translation failed. Input may be too emotionally honest for the male dialect.",
  "Signal lost. He may have been distracted by a bird or a cool truck.",
  "Insufficient data. Try again after he finishes his 'quick' 3-hour gaming session.",
] as const

export const FEMALE_FALLBACK_TRANSLATIONS = [
  "No exact match. Ask what she means, then listen to the answer.",
  "Subtext inconclusive. Context and a sincere follow-up question are required.",
  "Translation unavailable. Do not guess when direct communication is still an option.",
  "Insufficient context. Tone and timing may contain the missing information.",
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
