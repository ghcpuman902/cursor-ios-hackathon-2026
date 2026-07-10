/**
 * Comedy-first rant de-escalation (no therapy, no diagnosis).
 * Helps the user pause, reframe, and pick a lowest-risk reply.
 */

export type RantInput = {
  vent: string
  originalMessage?: string
  timeOfDay?: "morning" | "afternoon" | "evening" | "late_night"
  direction?: "male_to_female" | "female_to_male"
}

export type RantResult = {
  whatHappened: string
  whatYourBrainAdded: string
  likelyNonSeriousExplanations: string[]
  comicTranslation: string
  pauseSuggestion: string
  lowestRiskReply: string
}

const truncate = (text: string, max: number): string => {
  const trimmed = text.trim().replace(/\s+/g, " ")
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, max - 1)}…`
}

export const deescalateRant = (input: RantInput): RantResult => {
  const vent = input.vent.trim()
  const wordCount = vent ? vent.split(/\s+/).length : 0
  const isLate = input.timeOfDay === "late_night"
  const isIntense = wordCount >= 80

  const whatHappened = input.originalMessage
    ? `They said something like: “${truncate(input.originalMessage, 120)}”. You are now carrying a longer story about it.`
    : `You are holding a vent (${wordCount || 0} words). The original spark may be smaller than the current weather.`

  const whatYourBrainAdded = isIntense
    ? "Your brain may have cast a full season finale from one scene. That is human. It is also optional."
    : "A few extra plot twists may have joined the party. Today's theory: not all of them were invited."

  const likelyNonSeriousExplanations = [
    "They were brief, busy, or bad at texting — not casting a curse.",
    "Hunger, tiredness, or late-night brain may be guest-starring.",
    "You care, so the volume knob turned up. Care is cute. Cathedrals are optional.",
    ...(isLate ? ["It is late. Almost everything sounds louder after midnight."] : []),
  ]

  const comicTranslation =
    input.direction === "female_to_male"
      ? "Boss music feels loud. The actual boss may still be a snack-sized misunderstanding."
      : "The cards look dramatic. The real spread may just be 'short reply + soft overthinking'."

  const pauseSuggestion = isIntense
    ? "Pause before replying. Drink water. If possible, eat. Then send one gentle line."
    : "One breath. Then the lowest-risk reply — not the spicy paragraph."

  const lowestRiskReply = input.originalMessage
    ? "Hey — I might be reading into this. Are we okay, or do you want space?"
    : "I care about this. Can we talk lightly when we both have a minute?"

  return {
    whatHappened,
    whatYourBrainAdded,
    likelyNonSeriousExplanations,
    comicTranslation,
    pauseSuggestion,
    lowestRiskReply,
  }
}
