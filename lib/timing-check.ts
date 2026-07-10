import type { TranslationDirection } from "@/lib/translation-types"

export type TimeWindow =
  | "late_night"
  | "bedtime"
  | "dinner"
  | "lunch"
  | "morning"

export type TimingCheckResult = {
  /** Short label for why the bubble is showing */
  flag: string
  message: string
  window?: TimeWindow
}

type ClockWindowMatch = {
  window: TimeWindow
  flag: string
}

type MessagePattern = {
  pattern: RegExp
  window?: TimeWindow
  flag: string
}

const MESSAGE_TIME_PATTERNS: MessagePattern[] = [
  {
    pattern:
      /\b(1\s*am|2\s*am|3\s*am|midnight|past\s*midnight|late\s*night|late\s*kick[\s-]?off)\b/i,
    window: "late_night",
    flag: "message mentions late night",
  },
  {
    pattern: /\b(kick[\s-]?off|match).*(1\s*am|midnight|late)\b/i,
    window: "late_night",
    flag: "late kick-off in message",
  },
  {
    pattern: /\b(dinner|supper|tea time|what's for dinner)\b/i,
    window: "dinner",
    flag: "dinner in message",
  },
  {
    pattern: /\b(lunch|lunchtime)\b/i,
    window: "lunch",
    flag: "lunch in message",
  },
  {
    pattern: /\b(bed|bedtime|going to sleep|need sleep|can't sleep)\b/i,
    window: "bedtime",
    flag: "sleep / bed in message",
  },
  {
    pattern: /\b(breakfast|just woke|still in bed)\b/i,
    window: "morning",
    flag: "morning in message",
  },
  {
    pattern: /\b(hungry|haven't eaten|havent eaten|starving|need food)\b/i,
    flag: "hunger in message",
  },
]

const formatClockLabel = (now: Date): string => {
  const hours = now.getHours()
  const minutes = now.getMinutes().toString().padStart(2, "0")
  const period = hours >= 12 ? "pm" : "am"
  const displayHour = hours % 12 === 0 ? 12 : hours % 12
  return `${displayHour}:${minutes}${period}`
}

const getClockWindow = (now: Date): ClockWindowMatch | null => {
  const hour = now.getHours()
  const time = formatClockLabel(now)

  if (hour >= 23 || hour < 6) {
    return { window: "late_night", flag: `late night — ${time}` }
  }

  if (hour >= 21) {
    return { window: "bedtime", flag: `bedtime window — ${time}` }
  }

  if (hour >= 17 && hour < 21) {
    return { window: "dinner", flag: `dinner hour — ${time}` }
  }

  if (hour >= 11 && hour < 14) {
    return { window: "lunch", flag: `lunch hour — ${time}` }
  }

  if (hour >= 6 && hour < 10) {
    return { window: "morning", flag: `morning — ${time}` }
  }

  return null
}

const matchMessageTiming = (text: string): MessagePattern | null => {
  const normalized = text.trim()
  if (!normalized) return null

  for (const entry of MESSAGE_TIME_PATTERNS) {
    if (entry.pattern.test(normalized)) {
      return entry
    }
  }

  return null
}

const buildTimingMessage = (params: {
  direction: TranslationDirection
  window?: TimeWindow
  hungerOnly: boolean
  isFallback: boolean
}): string => {
  const { direction, window, hungerOnly, isFallback } = params

  if (direction === "female_to_male") {
    if (hungerOnly) {
      return "hunger might be in the mix — food first, drama second"
    }
    if (window === "late_night" || window === "bedtime") {
      return "late + tired might be making this feel bigger than it is"
    }
    if (window === "dinner" || window === "lunch") {
      return "empty stomach weather — eat first, then decode"
    }
    if (window === "morning") {
      return "early-day brain might be making this land sharper"
    }
    if (isFallback) {
      return "might be simpler than you think — don't invent drama from one line"
    }
    return "bad timing might be colouring this"
  }

  if (hungerOnly) {
    return "Empty stomach weather can make messages land sharper than intended."
  }
  if (window === "late_night" || window === "bedtime") {
    return "Little sleep or late-night brain may be colouring this — let morning land first."
  }
  if (window === "dinner" || window === "lunch") {
    return "Hunger hour can make tone feel sharper — food before the deep read."
  }
  if (window === "morning") {
    return "Early-day pace can make short replies feel colder than they are."
  }
  if (isFallback) {
    return "This may be a plain request, not a secret subplot."
  }
  return "Timing or tiredness could still colour this."
}

/**
 * Only returns a timing check when the clock or message actually warrants one.
 */
export const resolveTimingCheck = (params: {
  direction: TranslationDirection
  messageText: string
  isFallback?: boolean
  now?: Date
}): TimingCheckResult | null => {
  const now = params.now ?? new Date()
  const clock = getClockWindow(now)
  const messageMatch = matchMessageTiming(params.messageText)

  if (!clock && !messageMatch) {
    return null
  }

  const window = messageMatch?.window ?? clock?.window
  const hungerOnly = Boolean(messageMatch && !messageMatch.window)

  let flag: string
  if (clock && messageMatch) {
    flag = `${clock.flag} + ${messageMatch.flag}`
  } else if (messageMatch) {
    flag = messageMatch.flag
  } else {
    flag = clock!.flag
  }

  return {
    flag,
    message: buildTimingMessage({
      direction: params.direction,
      window,
      hungerOnly,
      isFallback: params.isFallback ?? false,
    }),
    window,
  }
}

export const timingCheckToFields = (
  check: TimingCheckResult | null | undefined
): { timingFlag?: string; timingWarning?: string } => {
  if (!check) return {}
  return {
    timingFlag: check.flag,
    timingWarning: check.message,
  }
}
