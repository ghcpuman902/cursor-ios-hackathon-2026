/**
 * Stereotype meme argument scripts for dictionary coverage testing.
 * Couples who do NOT live together — texts / calls about plans, feelings, family, trips.
 *
 * Each line is tagged by who said it so we can run male vs female dictionaries.
 */

export type ScriptLine = {
  speaker: "male" | "female"
  text: string
  /** Optional note for humans reading the fixture */
  note?: string
}

export type ArgumentScript = {
  id: string
  title: string
  theme: string
  lines: ScriptLine[]
}

export const ARGUMENT_SCRIPTS: ArgumentScript[] = [
  {
    id: "home-too-late",
    title: "You said you'd be here an hour ago",
    theme: "lateness / cancelled plans / disappearing",
    lines: [
      {
        speaker: "female",
        text: "Where are you? You said you'd leave at 7.",
      },
      {
        speaker: "male",
        text: "I'm almost there",
      },
      {
        speaker: "female",
        text: "You said that 40 minutes ago.",
      },
      {
        speaker: "male",
        text: "Traffic was crazy, my bad",
      },
      {
        speaker: "female",
        text: "Just be honest. Were you still at the bar?",
      },
      {
        speaker: "male",
        text: "We were wrapping up. It's not that deep",
      },
      {
        speaker: "female",
        text: "It is that deep when you leave me waiting alone.",
      },
      {
        speaker: "male",
        text: "You're overthinking it. I said I was coming",
      },
      {
        speaker: "female",
        text: "Saying you're coming and actually showing up are different.",
      },
      {
        speaker: "male",
        text: "I'll be ready in 5 minutes and then I'm heading over",
      },
      {
        speaker: "female",
        text: "Don't bother. I'm going home.",
      },
      {
        speaker: "male",
        text: "Come on don't be like that",
      },
      {
        speaker: "female",
        text: "Have fun with your friends then.",
      },
      {
        speaker: "male",
        text: "lol okay chill",
      },
      {
        speaker: "female",
        text: "I'm fine. Go ahead.",
      },
      {
        speaker: "male",
        text: "K",
      },
    ],
  },
  {
    id: "not-caring-feelings",
    title: "You never ask how I feel",
    theme: "emotional labor / dismissing feelings",
    lines: [
      {
        speaker: "female",
        text: "I had a really rough day and you didn't even ask.",
      },
      {
        speaker: "male",
        text: "I figured you'd tell me if something was wrong",
      },
      {
        speaker: "female",
        text: "I shouldn't have to announce that I need support.",
      },
      {
        speaker: "male",
        text: "I'm listening. What's up?",
      },
      {
        speaker: "female",
        text: "You say that but you're clearly on your phone.",
      },
      {
        speaker: "male",
        text: "I'm multitasking. It's fine",
      },
      {
        speaker: "female",
        text: "It's not fine. I feel invisible.",
      },
      {
        speaker: "male",
        text: "You're being dramatic. I care about you",
      },
      {
        speaker: "female",
        text: "Then act like it. Ask follow-up questions.",
      },
      {
        speaker: "male",
        text: "Idk what you want me to say",
      },
      {
        speaker: "female",
        text: "I want you to care about my feelings without a script.",
      },
      {
        speaker: "male",
        text: "I do care. I just don't know how to do the feelings talk",
      },
      {
        speaker: "female",
        text: "We need to talk about this properly.",
      },
      {
        speaker: "male",
        text: "Can we do this later? I'm tired",
      },
      {
        speaker: "female",
        text: "You're always tired when it's about my emotions.",
      },
      {
        speaker: "male",
        text: "Nothing's wrong with me wanting to decompress",
      },
      {
        speaker: "female",
        text: "I'm not mad. I'm disappointed.",
      },
      {
        speaker: "male",
        text: "Sorry. I didn't mean to make you feel ignored",
      },
      {
        speaker: "female",
        text: "Never mind. Forget I said anything.",
      },
    ],
  },
  {
    id: "rude-tone",
    title: "Why do you talk to me like that?",
    theme: "tone / disrespect / short replies",
    lines: [
      {
        speaker: "female",
        text: "Why are you being so short with me?",
      },
      {
        speaker: "male",
        text: "I'm not. I just answered the question",
      },
      {
        speaker: "female",
        text: "You answered with 'k'. That's rude.",
      },
      {
        speaker: "male",
        text: "K means okay. You're reading into it",
      },
      {
        speaker: "female",
        text: "Tone matters. You sound annoyed.",
      },
      {
        speaker: "male",
        text: "Bruh I literally just woke up",
      },
      {
        speaker: "female",
        text: "Don't 'bruh' me when I'm trying to communicate.",
      },
      {
        speaker: "male",
        text: "Yeah yeah I get it",
      },
      {
        speaker: "female",
        text: "Do you? Because you keep dismissing me.",
      },
      {
        speaker: "male",
        text: "I don't care about the wording. The answer is the same",
      },
      {
        speaker: "female",
        text: "I care about how you talk to me.",
      },
      {
        speaker: "male",
        text: "Sounds good. Can we drop it?",
      },
      {
        speaker: "female",
        text: "Sure. Whatever you want.",
      },
      {
        speaker: "male",
        text: "Do whatever you want then",
      },
      {
        speaker: "female",
        text: "Wow. Okay.",
      },
      {
        speaker: "male",
        text: "Haha you're funny when you're mad",
      },
      {
        speaker: "female",
        text: "I'm not mad. It's fine.",
      },
    ],
  },
  {
    id: "share-of-responsibility",
    title: "I always plan everything",
    theme: "mental load / planning / remembering",
    lines: [
      {
        speaker: "female",
        text: "Why am I always the one making the reservation?",
      },
      {
        speaker: "male",
        text: "I thought you liked planning. You're good at it",
      },
      {
        speaker: "female",
        text: "Being good at it doesn't mean I want to do it alone.",
      },
      {
        speaker: "male",
        text: "Just tell me what you need and I'll do it",
      },
      {
        speaker: "female",
        text: "That's the point. I shouldn't have to manage you.",
      },
      {
        speaker: "male",
        text: "Let me check my schedule and get back to you",
      },
      {
        speaker: "female",
        text: "You said that last week about the birthday gift.",
      },
      {
        speaker: "male",
        text: "I'll think about it. We still have time",
      },
      {
        speaker: "female",
        text: "The party is Saturday. There is no time.",
      },
      {
        speaker: "male",
        text: "You should've reminded me earlier",
      },
      {
        speaker: "female",
        text: "I did. Three times. Check your texts.",
      },
      {
        speaker: "male",
        text: "My bad. I forgot. It's not a big deal",
      },
      {
        speaker: "female",
        text: "It is a big deal when I carry the whole relationship calendar.",
      },
      {
        speaker: "male",
        text: "Nah I'm good at showing up when it matters",
      },
      {
        speaker: "female",
        text: "Showing up is the bare minimum.",
      },
      {
        speaker: "male",
        text: "What do you want from me then?",
      },
      {
        speaker: "female",
        text: "I want equal effort. Not me assigning you chores.",
      },
      {
        speaker: "male",
        text: "Okay I'll handle dinner this weekend. Promise",
      },
      {
        speaker: "female",
        text: "Don't promise. Just do it.",
      },
    ],
  },
  {
    id: "family-stuff",
    title: "My parents want to meet you",
    theme: "family / holidays / meeting parents",
    lines: [
      {
        speaker: "female",
        text: "My mom keeps asking when you're coming to Sunday lunch.",
      },
      {
        speaker: "male",
        text: "I don't know if I can do family stuff this weekend",
      },
      {
        speaker: "female",
        text: "You've said that for a month.",
      },
      {
        speaker: "male",
        text: "Meeting parents is a big step. I need to prepare",
      },
      {
        speaker: "female",
        text: "Prepare for what? It's lasagna, not a deposition.",
      },
      {
        speaker: "male",
        text: "You know how I get around new people. It's awkward",
      },
      {
        speaker: "female",
        text: "Avoiding them makes it look like you're not serious.",
      },
      {
        speaker: "male",
        text: "I am serious. I just hate forced small talk",
      },
      {
        speaker: "female",
        text: "Then come for an hour. That's all I'm asking.",
      },
      {
        speaker: "male",
        text: "Maybe. Let me see how work goes",
      },
      {
        speaker: "female",
        text: "Maybe means no. Just say no.",
      },
      {
        speaker: "male",
        text: "Don't put words in my mouth",
      },
      {
        speaker: "female",
        text: "I'm translating your stalling. Same thing.",
      },
      {
        speaker: "male",
        text: "Fine. I'll come. But I'm not staying all day",
      },
      {
        speaker: "female",
        text: "Thank you. Please don't be on your phone the whole time.",
      },
      {
        speaker: "male",
        text: "No worries. I'll be present. Promise",
      },
      {
        speaker: "female",
        text: "And don't tell my dad your fantasy football takes unprompted.",
      },
      {
        speaker: "male",
        text: "No promises on that one lol",
      },
    ],
  },
  {
    id: "trip-planning",
    title: "Are we actually booking this trip?",
    theme: "travel planning / commitment / logistics",
    lines: [
      {
        speaker: "female",
        text: "Did you look at the flights I sent?",
      },
      {
        speaker: "male",
        text: "Not yet. I've been busy",
      },
      {
        speaker: "female",
        text: "Prices go up every day we wait.",
      },
      {
        speaker: "male",
        text: "We should hang out sometime and decide together",
      },
      {
        speaker: "female",
        text: "We've been 'deciding' for three weeks.",
      },
      {
        speaker: "male",
        text: "I like the idea. I'm just not ready to book",
      },
      {
        speaker: "female",
        text: "If you wanted to go, you'd have booked by now.",
      },
      {
        speaker: "male",
        text: "That's not fair. Money is tight this month",
      },
      {
        speaker: "female",
        text: "Then say that instead of leaving me on read about hotels.",
      },
      {
        speaker: "male",
        text: "Hold on I was going to reply",
      },
      {
        speaker: "female",
        text: "You always say hold on and then vanish.",
      },
      {
        speaker: "male",
        text: "Pick a weekend and I'll make it work",
      },
      {
        speaker: "female",
        text: "I already picked two. You ignored both.",
      },
      {
        speaker: "male",
        text: "Sorry. Book the cheaper one. I'll pay you back",
      },
      {
        speaker: "female",
        text: "I don't want to be the travel agent and the bank.",
      },
      {
        speaker: "male",
        text: "You're right. I'll book it tonight. For real",
      },
      {
        speaker: "female",
        text: "Don't worry about it. I'll handle it. Again.",
      },
      {
        speaker: "male",
        text: "Come on. I said I'll do it",
      },
      {
        speaker: "female",
        text: "Per my last text: Friday 6pm flights. Confirm or cancel.",
      },
      {
        speaker: "male",
        text: "Sounds good. Confirmed",
      },
      {
        speaker: "female",
        text: "Finally. Don't flake.",
      },
      {
        speaker: "male",
        text: "I won't. Trust me",
      },
    ],
  },

  // ── Round 2: reworded variants (generalization stress test) ───────────
  {
    id: "late-again-v2",
    title: "Running late again (variant)",
    theme: "lateness / excuses",
    lines: [
      { speaker: "female", text: "Are you even on the way?" },
      { speaker: "male", text: "Leaving in a sec, traffic looks rough" },
      { speaker: "female", text: "You always say you're leaving." },
      { speaker: "male", text: "Chill, it's not that deep" },
      { speaker: "female", text: "Stop telling me to chill when I'm waiting outside." },
      { speaker: "male", text: "My bad, got caught up with the guys" },
      { speaker: "female", text: "Just say you prioritized them." },
      { speaker: "male", text: "Don't be like that, I'm coming" },
      { speaker: "female", text: "Have fun. I'm done waiting." },
      { speaker: "male", text: "K." },
    ],
  },
  {
    id: "feelings-v2",
    title: "You shut down every feelings talk (variant)",
    theme: "emotional shutdown",
    lines: [
      { speaker: "female", text: "Can we please talk about how last night felt?" },
      { speaker: "male", text: "Idk, I thought we were good" },
      { speaker: "female", text: "We weren't. I cried and you kept scrolling." },
      { speaker: "male", text: "I wasn't scrolling to hurt you. You're overthinking it" },
      { speaker: "female", text: "I'm not overthinking. I felt alone with you." },
      { speaker: "male", text: "Can we do this later? Long day" },
      { speaker: "female", text: "There's always a later. Never a now." },
      { speaker: "male", text: "I do care. Feelings talk just fries my brain" },
      { speaker: "female", text: "Then practice. I'm not your optional DLC." },
      { speaker: "male", text: "Sorry. I'll try harder" },
      { speaker: "female", text: "Never mind. I already know the pattern." },
    ],
  },
  {
    id: "tone-v2",
    title: "Dry texts feel hostile (variant)",
    theme: "tone / texting",
    lines: [
      { speaker: "female", text: "Did I do something? Your texts feel cold." },
      { speaker: "male", text: "I'm literally just answering. Lol" },
      { speaker: "female", text: "One-word replies feel like punishment." },
      { speaker: "male", text: "You're reading into it again" },
      { speaker: "female", text: "Tone matters even over text." },
      { speaker: "male", text: "Yeah yeah okay I'll use more words" },
      { speaker: "female", text: "Don't mock me for wanting basic warmth." },
      { speaker: "male", text: "Sounds good. Dropping it now" },
      { speaker: "female", text: "Sure." },
      { speaker: "male", text: "Do whatever you want" },
    ],
  },
  {
    id: "mental-load-v2",
    title: "I shouldn't have to assign you tasks (variant)",
    theme: "mental load",
    lines: [
      { speaker: "female", text: "Did you order the cake like we discussed?" },
      { speaker: "male", text: "Oh wait I forgot. You should've reminded me" },
      { speaker: "female", text: "I did. Twice. Check your texts." },
      { speaker: "male", text: "Just tell me what you need next time and I'll handle it" },
      { speaker: "female", text: "I don't want to manage you. I want a partner." },
      { speaker: "male", text: "It's not a big deal, we can still grab something" },
      { speaker: "female", text: "The bare minimum is remembering without a ticket system." },
      { speaker: "male", text: "What do you want from me then?" },
      { speaker: "female", text: "Equal effort. Not me running our whole life ops." },
      { speaker: "male", text: "Okay promise I'll do better" },
      { speaker: "female", text: "Don't promise. Just do it." },
    ],
  },
  {
    id: "family-v2",
    title: "Holiday with my family (variant)",
    theme: "family / holidays",
    lines: [
      { speaker: "female", text: "Christmas lunch is at my parents'. Can you come?" },
      { speaker: "male", text: "Family stuff stresses me out. Maybe next year" },
      { speaker: "female", text: "Maybe means no. We've been dating a year." },
      { speaker: "male", text: "Meeting parents still feels like a big step" },
      { speaker: "female", text: "Avoiding them makes it look like you're not serious." },
      { speaker: "male", text: "I am serious. Forced small talk drains me" },
      { speaker: "female", text: "Come for an hour. That's all I'm asking." },
      { speaker: "male", text: "Fine. But I'm not staying all day" },
      { speaker: "female", text: "Thank you. Please don't doomscroll at the table." },
      { speaker: "male", text: "No worries. I'll be present" },
    ],
  },
  {
    id: "trip-v2",
    title: "Weekend getaway still unbooked (variant)",
    theme: "trip planning",
    lines: [
      { speaker: "female", text: "The Airbnb link is still sitting on read." },
      { speaker: "male", text: "Not yet, I've been busy at work" },
      { speaker: "female", text: "If you wanted to go, the deposit would be paid." },
      { speaker: "male", text: "Money is tight and I'm not ready to book" },
      { speaker: "female", text: "Then say that. Don't leave me planning alone." },
      { speaker: "male", text: "Pick a weekend and I'll make it work" },
      { speaker: "female", text: "I already did. You ignored both options." },
      { speaker: "male", text: "You're right. I'll book it tonight for real" },
      { speaker: "female", text: "I don't want to be the travel agent and the bank." },
      { speaker: "male", text: "Trust me. I won't flake" },
      { speaker: "female", text: "Per my last text: confirm by tonight or we cancel." },
    ],
  },
]

/** Flat list of all lines for quick iteration */
export const allScriptLines = (): Array<
  ScriptLine & { scriptId: string; scriptTitle: string; lineIndex: number }
> =>
  ARGUMENT_SCRIPTS.flatMap((script) =>
    script.lines.map((line, lineIndex) => ({
      ...line,
      scriptId: script.id,
      scriptTitle: script.title,
      lineIndex,
    }))
  )
