import type {
  RiskLevel,
  TranslationCategory,
  TranslationEntry,
} from "@/lib/translation-types"

export type { TranslationEntry, RiskLevel, TranslationCategory }
export type MaleTranslation = TranslationEntry

/**
 * male → female: explain his short/direct message in warm mystical receiver language.
 * Order matters: first match wins. Longer patterns first.
 */
export const MALE_TRANSLATIONS: MaleTranslation[] = [
  // Spec examples + classics
  {
    pattern: "what do you want me to do",
    headline: "🃏 The Literal Creature Card",
    comicTranslation:
      "A literal creature appears. He may genuinely need the wish spoken aloud.",
    spicyComicTranslation:
      "The oracle shrugs: he cannot read unspoken wishes. Words, please.",
    possibleActualMeaning:
      "He may be asking for a clear action, not failing a vibes exam.",
    riskLevel: "low",
    lowestRiskReply: "Could you do X by Y? That would help a lot.",
    tinyWholesomeNudge: "Specific wishes manifest faster.",
    category: "relationship",
  },
  {
    pattern: "make me a tea",
    headline: "🍵 The Kettle Omen",
    comicTranslation:
      "The tea leaves are refreshingly boring: he would like tea. Possibly now.",
    spicyComicTranslation:
      "No secret subplot in the mug. Today's reading: hot water + leaf + you.",
    possibleActualMeaning:
      "This may be a literal hospitality request, not a coded emotional novel.",
    riskLevel: "low",
    lowestRiskReply: "On it — tea incoming.",
    tinyWholesomeNudge: "Sometimes care is just boiling water.",
    category: "classic",
  },
  {
    pattern: "make me tea",
    headline: "🍵 The Kettle Omen",
    comicTranslation:
      "The tea leaves are refreshingly boring: he would like tea. Possibly now.",
    spicyComicTranslation:
      "No secret subplot in the mug. Today's reading: hot water + leaf + you.",
    possibleActualMeaning:
      "This may be a literal hospitality request, not a coded emotional novel.",
    riskLevel: "low",
    lowestRiskReply: "On it — tea incoming.",
    tinyWholesomeNudge: "Sometimes care is just boiling water.",
    category: "classic",
  },
  // World Cup 2026 / late kick-offs / mates night — longer patterns first
  {
    pattern: "the match kicks off at 1am",
    headline: "🌙 Midnight Kick-Off",
    comicTranslation:
      "He wants a late-night match ritual — not a breakup.",
    spicyComicTranslation:
      "FIFA booked 1am. He wants permission, not a tribunal.",
    possibleActualMeaning:
      "A 1am kick-off is brutal but real — he may want company, silence, or grace tomorrow.",
    riskLevel: "medium",
    lowestRiskReply:
      "I know it's late — want me nearby, or want the room dark and peaceful?",
    tinyWholesomeNudge:
      "Negotiate sleep vs match once. Then pick a side.",
    category: "plans",
  },
  {
    pattern: "kick off is at 1am",
    headline: "🌙 Midnight Kick-Off",
    comicTranslation:
      "He wants a late-night match ritual — not a breakup.",
    spicyComicTranslation:
      "FIFA booked 1am. He wants permission, not a tribunal.",
    possibleActualMeaning:
      "A 1am kick-off is brutal but real — he may want company, silence, or grace tomorrow.",
    riskLevel: "medium",
    lowestRiskReply:
      "I know it's late — want me nearby, or want the room dark and peaceful?",
    tinyWholesomeNudge:
      "Negotiate sleep vs match once. Then pick a side.",
    category: "plans",
  },
  {
    pattern: "it's a late kick off tonight",
    headline: "⏰ Late Fixture Weather",
    comicTranslation:
      "The clock card sighs. 'Late kick-off' may mean he already knows tomorrow will be tender.",
    possibleActualMeaning:
      "He may be warning you the night runs long — extra time, penalties, and post-match debrief included.",
    riskLevel: "medium",
    lowestRiskReply: "How late are we talking — and do you want company or solo viewing?",
    tinyWholesomeNudge: "Late fixtures are a schedule fact, not a loyalty test.",
    category: "plans",
  },
  {
    pattern: "late kick off tonight",
    headline: "⏰ Late Fixture Weather",
    comicTranslation:
      "The clock card sighs. 'Late kick-off' may mean he already knows tomorrow will be tender.",
    possibleActualMeaning:
      "He may be warning you the night runs long — extra time, penalties, and post-match debrief included.",
    riskLevel: "medium",
    lowestRiskReply: "How late are we talking — and do you want company or solo viewing?",
    tinyWholesomeNudge: "Late fixtures are a schedule fact, not a loyalty test.",
    category: "plans",
  },
  {
    pattern: "fifa changed the kick off",
    headline: "🃏 Schedule Chaos Card",
    comicTranslation:
      "The fixture card flipped mid-reading. He may be stressed about plans, travel, and sleep all at once.",
    spicyComicTranslation:
      "Even the oracle got a push notification. Kick-off drama is real; relationship drama is optional.",
    possibleActualMeaning:
      "Late schedule changes wreck fan plans — he may need patience, not a lecture about caring more.",
    riskLevel: "medium",
    lowestRiskReply: "That's annoying — what time is it now?",
    tinyWholesomeNudge: "Match chaos is external. Don't make him defend FIFA to you.",
    category: "plans",
  },
  {
    pattern: "kick off got moved",
    headline: "🃏 Schedule Chaos Card",
    comicTranslation:
      "The fixture card flipped mid-reading. He may be stressed about plans, travel, and sleep all at once.",
    possibleActualMeaning:
      "A moved kick-off can trash a whole evening — he may be venting logistics, not picking a fight.",
    riskLevel: "medium",
    lowestRiskReply: "Ugh — earlier or later now?",
    tinyWholesomeNudge: "React to the new time, not the drama spiral.",
    category: "plans",
  },
  {
    pattern: "if it goes to extra time",
    headline: "➕ Injury-Time Omen",
    comicTranslation:
      "The spread adds bonus chapters. He may already be budgeting another thirty to sixty emotional minutes.",
    possibleActualMeaning:
      "Extra time means a later night — he may want you to expect overrun, not treat it as betrayal.",
    riskLevel: "low",
    lowestRiskReply: "Got it — I'll assume bedtime is fuzzy tonight.",
    tinyWholesomeNudge: "Football overrun is predictable. Surprise is the only sin.",
    category: "plans",
  },
  {
    pattern: "might go to penalties",
    headline: "🎯 Shootout Suspense",
    comicTranslation:
      "The final card is dramatic by design. Penalties may mean he cannot look away until fate decides.",
    possibleActualMeaning:
      "A shootout extends the night and the adrenaline — he may need grace, not a countdown glare.",
    riskLevel: "medium",
    lowestRiskReply: "If it goes to pens, text me when it's over?",
    tinyWholesomeNudge: "High-stakes endings are short. The snoring can wait.",
    category: "plans",
  },
  {
    pattern: "i'm staying up for the world cup",
    headline: "🏆 Tournament Vigil",
    comicTranslation:
      "The World Cup card glows. He may be claiming one rare season of national ritual.",
    spicyComicTranslation:
      "Cosmic rule: this tournament happens every four years. He thinks that matters. It might.",
    possibleActualMeaning:
      "He may want to watch a big match live even if sleep dies tomorrow — negotiate, don't moralise.",
    riskLevel: "medium",
    lowestRiskReply: "Which match — and do you want snacks, silence, or company?",
    tinyWholesomeNudge: "Pick your boundary once. Then let the tournament be the tournament.",
    category: "plans",
  },
  {
    pattern: "staying up for england tonight",
    headline: "🏴 National Ritual Night",
    comicTranslation:
      "The patriotism card is upright and caffeinated. He may be asking for one night of shared chaos.",
    possibleActualMeaning:
      "England nights can run past midnight with delays and drama — he may want understanding, not a debate.",
    riskLevel: "medium",
    lowestRiskReply: "Alright — want me in or want the sofa to yourself?",
    tinyWholesomeNudge: "National matches are loud weather. You can still set one sleep boundary.",
    category: "plans",
  },
  {
    pattern: "it's the world cup final",
    headline: "👑 Final Spread",
    comicTranslation:
      "The crown card appears once every four years. He may not be asking to cancel life — just this one night.",
    possibleActualMeaning:
      "Finals feel non-negotiable to many fans — he may want a plan, not permission warfare.",
    riskLevel: "medium",
    lowestRiskReply: "Okay — what's the kick-off and what do you need from me?",
    tinyWholesomeNudge: "Treat it like a known eclipse: rare, scheduled, survivable.",
    category: "plans",
  },
  {
    pattern: "world cup final tonight",
    headline: "👑 Final Spread",
    comicTranslation:
      "The crown card appears once every four years. He may not be asking to cancel life — just this one night.",
    possibleActualMeaning:
      "He may have cleared mental space for a very late night — clarify company vs solo early.",
    riskLevel: "medium",
    lowestRiskReply: "What time does it start — and are we watching or are you solo?",
    tinyWholesomeNudge: "One final, one plan, one gentle boundary.",
    category: "plans",
  },
  {
    pattern: "meeting the lads for the match",
    headline: "🍻 Away-Fan Constellation",
    comicTranslation:
      "The social card points out the door. He may want pub energy, not a relationship referendum.",
    possibleActualMeaning:
      "Watch parties with mates are often about belonging — he may still want to come home to you after.",
    riskLevel: "medium",
    lowestRiskReply: "Have fun — text me when you're heading back?",
    tinyWholesomeNudge: "Ask for a rough return time. Skip the guilt constellation.",
    category: "plans",
  },
  {
    pattern: "watching at dave's",
    headline: "📺 Mate-House Broadcast",
    comicTranslation:
      "The telly card is in another castle. He may be choosing crisps, banter, and a familiar sofa.",
    possibleActualMeaning:
      "Watching at a mate's is usually low drama — he may want a simple ETA, not suspicion.",
    riskLevel: "low",
    lowestRiskReply: "Nice — enjoy. Ping me when you're on your way back.",
    tinyWholesomeNudge: "Dave is not a rival oracle. He's a venue.",
    category: "plans",
  },
  {
    pattern: "mates are coming over for the game",
    headline: "🏠 Home Watch Party",
    comicTranslation:
      "The hearth card expands. He may be hosting, not hiding — noise levels may rise temporarily.",
    possibleActualMeaning:
      "Home watch parties can feel inclusive if framed right — he may want help or space, not a fight.",
    riskLevel: "medium",
    lowestRiskReply: "Cool — want me in the room or want me spared the commentary?",
    tinyWholesomeNudge: "Set one noise/space boundary before kick-off.",
    category: "plans",
  },
  {
    pattern: "going to the pub for the match",
    headline: "🍺 Pub Ritual Portal",
    comicTranslation:
      "The pint card beckons. He may want collective screaming, not emotional exile.",
    possibleActualMeaning:
      "Pub trips are often social + football blended — he may want a return time and zero interrogation.",
    riskLevel: "medium",
    lowestRiskReply: "Have fun — what time do you think you'll be back?",
    tinyWholesomeNudge: "Pub nights need ETA, not mind-reading.",
    category: "plans",
  },
  {
    pattern: "i'll be tired tomorrow but it's worth it",
    headline: "☕ Future-Exhaustion Pact",
    comicTranslation:
      "He has already signed the tiredness waiver. He may be asking you not to file the complaint tonight.",
    possibleActualMeaning:
      "He knows the cost and accepts it — he may want support, not a lecture about sleep hygiene.",
    riskLevel: "low",
    lowestRiskReply: "Fair — I'll let tomorrow-you be grumpy in peace.",
    tinyWholesomeNudge: "Let him enjoy the match. Save the debrief for brunch.",
    category: "plans",
  },
  {
    pattern: "just one more match",
    headline: "📺 One-More-Match Mirage",
    comicTranslation:
      "The binge card winks. 'One more' may mean ninety minutes plus injury time plus replays.",
    possibleActualMeaning:
      "He may be negotiating for one more fixture — set a real end time if you need sleep.",
    riskLevel: "medium",
    lowestRiskReply: "Which match — and hard stop after full time?",
    tinyWholesomeNudge: "Clarify 'one more' in actual minutes, not vibes.",
    category: "plans",
  },
  {
    pattern: "can't miss this game",
    headline: "🔥 Must-Watch Omen",
    comicTranslation:
      "The urgency card is loud. He may feel this fixture is a once-a-era event, not everyday telly.",
    possibleActualMeaning:
      "Knockout football can feel non-optional to fans — he may want grace around a late night.",
    riskLevel: "medium",
    lowestRiskReply: "Okay — how late are we on the clock?",
    tinyWholesomeNudge: "Ask for kick-off and expected end. Then choose your energy.",
    category: "plans",
  },
  {
    pattern: "watching the world cup",
    headline: "🌍 Tournament Season",
    comicTranslation:
      "The globe card is on for a month. He may be entering a recurring match-night weather pattern.",
    possibleActualMeaning:
      "World Cup season means repeated late nights — negotiate a sustainable rhythm early.",
    riskLevel: "medium",
    lowestRiskReply: "Which game tonight — and do you want company?",
    tinyWholesomeNudge: "Seasons have schedules. Couples can too.",
    category: "plans",
  },
  {
    pattern: "world cup 2026",
    headline: "🌎 North America Tournament Arc",
    comicTranslation:
      "Three countries, many time zones, one man staring at a fixture list like it's astrology.",
    spicyComicTranslation:
      "The cards say Seattle 7pm is not the same omen as Miami 7pm. He may be confused too.",
    possibleActualMeaning:
      "USA/Mexico/Canada time zones make kick-offs messy — he may need patience around planning.",
    riskLevel: "low",
    lowestRiskReply: "Which city is the match in — and what time here?",
    tinyWholesomeNudge: "Convert kick-off together once. Then stop debating FIFA maths.",
    category: "plans",
  },
  {
    pattern: "quarter final tonight",
    headline: "🗡️ Knockout Moon",
    comicTranslation:
      "The stakes card is upright. He may treat this like a lunar eclipse — rare, loud, scheduled.",
    possibleActualMeaning:
      "Later rounds often mean later kick-offs — he may want a plan for sleep and company.",
    riskLevel: "medium",
    lowestRiskReply: "What time's kick-off — want me in or want quiet?",
    tinyWholesomeNudge: "Knockout nights are finite. Boundaries can be too.",
    category: "plans",
  },
  {
    pattern: "i want to watch football",
    headline: "⚽ Match Day Spread",
    comicTranslation:
      "The stadium card is upright. He wants football on the screen, not a summit.",
    spicyComicTranslation:
      "Cosmic forecast: ninety minutes of ball, zero secret relationship DLC.",
    possibleActualMeaning:
      "He may be stating a leisure plan. Context decides if it's also 'please join' or 'please don't schedule drama'.",
    riskLevel: "low",
    lowestRiskReply: "Cool — want company, snacks, or solo match vibes?",
    tinyWholesomeNudge: "Ask the one gentle clarifying question. Then let the match be the match.",
    category: "plans",
  },
  {
    pattern: "watch football",
    headline: "⚽ Match Day Spread",
    comicTranslation:
      "The stadium card is upright. He wants football on the screen, not a summit.",
    spicyComicTranslation:
      "Cosmic forecast: ninety minutes of ball, zero secret relationship DLC.",
    possibleActualMeaning:
      "He may be stating a leisure plan. Context decides if it's also 'please join' or 'please don't schedule drama'.",
    riskLevel: "low",
    lowestRiskReply: "Cool — want company, snacks, or solo match vibes?",
    tinyWholesomeNudge: "Ask the one gentle clarifying question. Then let the match be the match.",
    category: "plans",
  },
  {
    pattern: "i'll be ready in 5 minutes",
    headline: "⏳ The Soft Time Mirage",
    comicTranslation:
      "The clock card is upside down. 'Five minutes' may be a mood, not a schedule.",
    possibleActualMeaning:
      "He may not have started getting ready yet, and is estimating hopefully.",
    riskLevel: "medium",
    lowestRiskReply: "Text me when you're actually leaving?",
    tinyWholesomeNudge: "Hopeful ETAs are cute. Confirmations are kinder.",
    category: "plans",
  },
  {
    pattern: "ill be ready in 5 minutes",
    headline: "⏳ The Soft Time Mirage",
    comicTranslation:
      "The clock card is upside down. 'Five minutes' may be a mood, not a schedule.",
    possibleActualMeaning:
      "He may not have started getting ready yet, and is estimating hopefully.",
    riskLevel: "medium",
    lowestRiskReply: "Text me when you're actually leaving?",
    tinyWholesomeNudge: "Hopeful ETAs are cute. Confirmations are kinder.",
    category: "plans",
  },
  {
    pattern: "i'm almost there",
    headline: "🌙 Transit in Progress (Allegedly)",
    comicTranslation:
      "The journey card flickers. 'Almost there' may mean 'still assembling shoes'.",
    spicyComicTranslation:
      "The stars say he is emotionally en route. Physically? Ask the shoes.",
    possibleActualMeaning:
      "He may still be leaving, and is trying to keep you from worrying.",
    riskLevel: "medium",
    lowestRiskReply: "No rush — just send a pin when you head out.",
    tinyWholesomeNudge: "Save the detective work for a stronger omen.",
    category: "plans",
  },
  {
    pattern: "im almost there",
    headline: "🌙 Transit in Progress (Allegedly)",
    comicTranslation:
      "The journey card flickers. 'Almost there' may mean 'still assembling shoes'.",
    possibleActualMeaning:
      "He may still be leaving, and is trying to keep you from worrying.",
    riskLevel: "medium",
    lowestRiskReply: "No rush — just send a pin when you head out.",
    tinyWholesomeNudge: "Save the detective work for a stronger omen.",
    category: "plans",
  },
  {
    pattern: "traffic was crazy",
    headline: "🚗 The Convenient Weather Card",
    comicTranslation:
      "Today's chart blames traffic. Traffic may be real. Traffic may also be a cosy excuse blanket.",
    possibleActualMeaning:
      "He may be late and reaching for the least dramatic explanation.",
    riskLevel: "medium",
    lowestRiskReply: "Glad you're safe. Next time a heads-up helps.",
    tinyWholesomeNudge: "Ask for honesty gently, not a courtroom.",
    category: "plans",
  },
  {
    pattern: "traffic looks",
    headline: "🔮 Pre-Blamed Transit",
    comicTranslation:
      "He is casting a traffic spell before the delay even arrives. Ambitious astrology.",
    possibleActualMeaning:
      "He may already expect to be late and is softening the landing.",
    riskLevel: "low",
    lowestRiskReply: "Okay — text when you leave?",
    tinyWholesomeNudge: "One check-in beats three hidden meanings.",
    category: "plans",
  },
  {
    pattern: "leaving in a sec",
    headline: "✨ The Eternal Sec",
    comicTranslation:
      "A 'sec' in his sky may last longer than a moon phase. Still, the intention sparkles.",
    possibleActualMeaning: "He probably means soon-ish, not literally one second.",
    riskLevel: "low",
    lowestRiskReply: "Cool — ping me when you're in the car.",
    tinyWholesomeNudge: "Do not build a cathedral from 'a sec'.",
    category: "plans",
  },
  {
    pattern: "got caught up",
    headline: "🌀 Distraction Weather",
    comicTranslation:
      "His aura got tangled in friends / snacks / a story. The plot thickened without you.",
    possibleActualMeaning:
      "He may have lost track of time and is naming it after the fact.",
    riskLevel: "medium",
    lowestRiskReply: "I get it. I just felt a bit left waiting.",
    tinyWholesomeNudge: "Name the feeling once. Skip the novel.",
    category: "plans",
  },
  {
    pattern: "we were wrapping up",
    headline: "🍷 The Nacho Eclipse",
    comicTranslation:
      "Wrapping up may include one more round. The universe loves a bonus chapter.",
    possibleActualMeaning:
      "He may still have been socialising and underplayed how long it took.",
    riskLevel: "medium",
    lowestRiskReply: "Next time just say you'll be later — I'd rather know.",
    tinyWholesomeNudge: "Clarity is hotter than a perfect excuse.",
    category: "plans",
  },
  {
    pattern: "still at the bar",
    headline: "🍸 Confession Orbit",
    comicTranslation:
      "If the cards are honest: yes, still at the bar. If not: he fears the trial.",
    possibleActualMeaning:
      "He may avoid a direct yes because it sounds worse out loud.",
    riskLevel: "high",
    lowestRiskReply: "I just need honesty. Were you still out?",
    tinyWholesomeNudge: "Ask once. Believe the answer you get today.",
    category: "relationship",
  },
  {
    pattern: "don't be like that",
    headline: "🫧 Please Soften Your Valid Feelings",
    comicTranslation:
      "He is requesting your emotions use an indoor voice. The request is… optimistic.",
    spicyComicTranslation:
      "The comfort card wants your standards on mute. Decline politely.",
    possibleActualMeaning:
      "He may feel defensive and is trying to shrink the conflict.",
    riskLevel: "medium",
    lowestRiskReply: "I'm not being dramatic — I felt waited on.",
    tinyWholesomeNudge: "Your feeling can be small and still real.",
    category: "relationship",
  },
  {
    pattern: "dont be like that",
    headline: "🫧 Please Soften Your Valid Feelings",
    comicTranslation:
      "He is requesting your emotions use an indoor voice. The request is… optimistic.",
    possibleActualMeaning:
      "He may feel defensive and is trying to shrink the conflict.",
    riskLevel: "medium",
    lowestRiskReply: "I'm not being dramatic — I felt waited on.",
    tinyWholesomeNudge: "Your feeling can be small and still real.",
    category: "relationship",
  },
  {
    pattern: "feelings talk",
    headline: "💬 Emotional Weather Advisory",
    comicTranslation:
      "Feelings talk may register as a storm warning on his chart. He might need a smaller umbrella first.",
    possibleActualMeaning:
      "He may care and still feel clumsy naming emotions out loud.",
    riskLevel: "medium",
    lowestRiskReply: "We can keep it short — I just need you to hear me.",
    tinyWholesomeNudge: "Tiny check-ins beat annual monologues.",
    category: "emotions",
  },
  {
    pattern: "you're being dramatic",
    headline: "🎭 The Shrink-Ray Card",
    comicTranslation:
      "He may be trying to resize your feeling to fit his comfort pocket.",
    spicyComicTranslation:
      "The drama card was drawn… by him, about your perfectly normal reaction.",
    possibleActualMeaning:
      "He may feel overwhelmed and is dismissing instead of engaging.",
    riskLevel: "high",
    lowestRiskReply: "I'm not trying to be dramatic. Can you just listen for a minute?",
    tinyWholesomeNudge: "You do not need a courtroom. You need a witness.",
    category: "relationship",
  },
  {
    pattern: "youre being dramatic",
    headline: "🎭 The Shrink-Ray Card",
    comicTranslation:
      "He may be trying to resize your feeling to fit his comfort pocket.",
    possibleActualMeaning:
      "He may feel overwhelmed and is dismissing instead of engaging.",
    riskLevel: "high",
    lowestRiskReply: "I'm not trying to be dramatic. Can you just listen for a minute?",
    tinyWholesomeNudge: "You do not need a courtroom. You need a witness.",
    category: "relationship",
  },
  {
    pattern: "i do care",
    headline: "💗 Care in Theory Mode",
    comicTranslation:
      "Care has been declared. Delivery may still be in the post.",
    possibleActualMeaning:
      "He may mean it, and still not know the next caring action.",
    riskLevel: "low",
    lowestRiskReply: "I believe you — show me with one small thing?",
    tinyWholesomeNudge: "Ask for one pebble, not a quarry.",
    category: "emotions",
  },
  {
    pattern: "i care about you",
    headline: "💌 Soft Declaration",
    comicTranslation:
      "A warm card appears: he cares. The instruction manual may be missing.",
    possibleActualMeaning:
      "He may be sincere and short on emotional vocabulary.",
    riskLevel: "low",
    lowestRiskReply: "That means a lot. Tonight I needed a bit more presence.",
    tinyWholesomeNudge: "Receive the care. Still name the need.",
    category: "emotions",
  },
  {
    pattern: "figured you'd tell me",
    headline: "📡 Outsourced Intuition",
    comicTranslation:
      "He may have outsourced mind-reading to you and is surprised the wifi dropped.",
    possibleActualMeaning:
      "He may wait for explicit asks instead of offering support proactively.",
    riskLevel: "medium",
    lowestRiskReply: "Sometimes I need you to ask, not wait.",
    tinyWholesomeNudge: "Nobody is a mind reader. Including the stars.",
    category: "emotions",
  },
  {
    pattern: "figured youd tell me",
    headline: "📡 Outsourced Intuition",
    comicTranslation:
      "He may have outsourced mind-reading to you and is surprised the wifi dropped.",
    possibleActualMeaning:
      "He may wait for explicit asks instead of offering support proactively.",
    riskLevel: "medium",
    lowestRiskReply: "Sometimes I need you to ask, not wait.",
    tinyWholesomeNudge: "Nobody is a mind reader. Including the stars.",
    category: "emotions",
  },
  {
    pattern: "can we do this later",
    headline: "📅 The Infinite Later",
    comicTranslation:
      "Later is a misty valley on his map. It may never get a pin.",
    possibleActualMeaning:
      "He may be flooded and delaying, not necessarily dismissing forever.",
    riskLevel: "medium",
    lowestRiskReply: "Okay — when specifically? Tomorrow after work?",
    tinyWholesomeNudge: "Book a tiny time. Mist hates calendars.",
    category: "emotions",
  },
  {
    pattern: "i don't know how to",
    headline: "🧭 Lost Without a Script",
    comicTranslation:
      "He may be standing in the feelings aisle with no shopping list.",
    possibleActualMeaning:
      "He may want to help and lack practice, not lack care.",
    riskLevel: "low",
    lowestRiskReply: "You could start with: 'That sounds hard. I'm here.'",
    tinyWholesomeNudge: "Give him one line to try. Coaching is allowed.",
    category: "emotions",
  },
  {
    pattern: "i dont know how to",
    headline: "🧭 Lost Without a Script",
    comicTranslation:
      "He may be standing in the feelings aisle with no shopping list.",
    possibleActualMeaning:
      "He may want to help and lack practice, not lack care.",
    riskLevel: "low",
    lowestRiskReply: "You could start with: 'That sounds hard. I'm here.'",
    tinyWholesomeNudge: "Give him one line to try. Coaching is allowed.",
    category: "emotions",
  },
  {
    pattern: "you're reading into it",
    headline: "🔍 The Anti-Detective Card",
    comicTranslation:
      "He insists the omen is tiny. Your detective hat may still be justified.",
    possibleActualMeaning:
      "He may want the tone conversation to end quickly.",
    riskLevel: "medium",
    lowestRiskReply: "Maybe. The short reply still landed cold for me.",
    tinyWholesomeNudge: "Name the impact once. Skip the full investigation.",
    category: "texting",
  },
  {
    pattern: "youre reading into it",
    headline: "🔍 The Anti-Detective Card",
    comicTranslation:
      "He insists the omen is tiny. Your detective hat may still be justified.",
    possibleActualMeaning:
      "He may want the tone conversation to end quickly.",
    riskLevel: "medium",
    lowestRiskReply: "Maybe. The short reply still landed cold for me.",
    tinyWholesomeNudge: "Name the impact once. Skip the full investigation.",
    category: "texting",
  },
  {
    pattern: "i just answered the question",
    headline: "📐 Technically Correct Moon",
    comicTranslation:
      "Technically correct. Emotionally… a bit like a weather report with no coat advice.",
    possibleActualMeaning:
      "He may think content matters more than tone.",
    riskLevel: "medium",
    lowestRiskReply: "The answer helped. The tone felt a bit sharp.",
    tinyWholesomeNudge: "Ask for warmth, not a thesis.",
    category: "texting",
  },
  {
    pattern: "i literally just woke up",
    headline: "😴 Diplomatic Nap Immunity",
    comicTranslation:
      "Sleep is being used as a soft force field. Morning humans are half-translated.",
    possibleActualMeaning:
      "He may actually be groggy and texting below his usual care level.",
    riskLevel: "low",
    lowestRiskReply: "Fair — coffee first, then we chat?",
    tinyWholesomeNudge: "Food and sleep solve surprising percentages of plot.",
    category: "classic",
  },
  {
    pattern: "can we drop it",
    headline: "🏳️ Conflict Evaporation Spell",
    comicTranslation:
      "He would like this weather system to dissolve. You may still need one rainbow of closure.",
    possibleActualMeaning:
      "He may be conflict-avoidant, not necessarily uncaring.",
    riskLevel: "medium",
    lowestRiskReply: "We can pause — I just need one acknowledgment first.",
    tinyWholesomeNudge: "Closure can be tiny and still count.",
    category: "relationship",
  },
  {
    pattern: "you're funny when you're mad",
    headline: "🔥 Extinguisher Full of Gasoline",
    comicTranslation:
      "Humour was deployed as a fire extinguisher. The fire may have grown.",
    spicyComicTranslation:
      "He poked the bear and called it a bit. Evacuate the bit.",
    possibleActualMeaning:
      "He may be nervous and using jokes to dodge tension.",
    riskLevel: "high",
    lowestRiskReply: "I'm not joking about this. Can we be serious for a sec?",
    tinyWholesomeNudge: "Jokes after repair. Not instead of repair.",
    category: "relationship",
  },
  {
    pattern: "youre funny when youre mad",
    headline: "🔥 Extinguisher Full of Gasoline",
    comicTranslation:
      "Humour was deployed as a fire extinguisher. The fire may have grown.",
    possibleActualMeaning:
      "He may be nervous and using jokes to dodge tension.",
    riskLevel: "high",
    lowestRiskReply: "I'm not joking about this. Can we be serious for a sec?",
    tinyWholesomeNudge: "Jokes after repair. Not instead of repair.",
    category: "relationship",
  },
  {
    pattern: "the answer is the same",
    headline: "📦 Delivery Method Denied",
    comicTranslation:
      "He thinks the package matters, not the wrapping. You may disagree (correctly).",
    possibleActualMeaning:
      "He may undervalue tone while focusing on facts.",
    riskLevel: "medium",
    lowestRiskReply: "Same answer, softer tone would feel better.",
    tinyWholesomeNudge: "How often lands louder than what.",
    category: "texting",
  },
  {
    pattern: "just tell me what you need",
    headline: "📋 Please Ticket Your Heart",
    comicTranslation:
      "He may want a clear request form. Romance as customer support — oddly sincere.",
    possibleActualMeaning:
      "He may do better with concrete asks than implied ones.",
    riskLevel: "low",
    lowestRiskReply: "I need you to handle X without me chasing.",
    tinyWholesomeNudge: "One clear ask beats a vibes scavenger hunt.",
    category: "relationship",
  },
  {
    pattern: "you should've reminded me",
    headline: "🧠 External Brain Warranty Void",
    comicTranslation:
      "He may have appointed you Reminder Spirit without asking. The stars are unimpressed.",
    spicyComicTranslation:
      "Forgot → therefore you failed at reminding. Creative cosmology.",
    possibleActualMeaning:
      "He may be deflecting forgetfulness onto shared memory labour.",
    riskLevel: "high",
    lowestRiskReply: "I did remind you. I need you to own this one.",
    tinyWholesomeNudge: "You are a partner, not a calendar app.",
    category: "classic",
  },
  {
    pattern: "you shouldve reminded me",
    headline: "🧠 External Brain Warranty Void",
    comicTranslation:
      "He may have appointed you Reminder Spirit without asking. The stars are unimpressed.",
    possibleActualMeaning:
      "He may be deflecting forgetfulness onto shared memory labour.",
    riskLevel: "high",
    lowestRiskReply: "I did remind you. I need you to own this one.",
    tinyWholesomeNudge: "You are a partner, not a calendar app.",
    category: "classic",
  },
  {
    pattern: "i thought you liked planning",
    headline: "📅 Competence ≠ Consent",
    comicTranslation:
      "Being good at planning is not the same as wanting to plan forever. Soft but firm omen.",
    possibleActualMeaning:
      "He may have mistaken your skill for endless willingness.",
    riskLevel: "medium",
    lowestRiskReply: "I like plans. I don't like doing them alone every time.",
    tinyWholesomeNudge: "Share the clipboard. Romance improves.",
    category: "plans",
  },
  {
    pattern: "it's not a big deal",
    headline: "⚖️ Deal-Size Dispute",
    comicTranslation:
      "He is negotiating the deal size down. Your chart may still say medium.",
    possibleActualMeaning:
      "He may minimise to reduce guilt or conflict.",
    riskLevel: "medium",
    lowestRiskReply: "It's a big deal to me. Can we meet in the middle?",
    tinyWholesomeNudge: "Size is subjective. Impact is not.",
    category: "relationship",
  },
  {
    pattern: "its not a big deal",
    headline: "⚖️ Deal-Size Dispute",
    comicTranslation:
      "He is negotiating the deal size down. Your chart may still say medium.",
    possibleActualMeaning:
      "He may minimise to reduce guilt or conflict.",
    riskLevel: "medium",
    lowestRiskReply: "It's a big deal to me. Can we meet in the middle?",
    tinyWholesomeNudge: "Size is subjective. Impact is not.",
    category: "relationship",
  },
  {
    pattern: "what do you want from me",
    headline: "🎯 Please Hand Me the Wish List",
    comicTranslation:
      "A literal creature returns. He may need the wish spoken in plain language.",
    possibleActualMeaning:
      "He may feel lost and is asking for a concrete next step.",
    riskLevel: "low",
    lowestRiskReply: "I want equal effort on planning — starting this weekend.",
    tinyWholesomeNudge: "Specific wishes manifest faster.",
    category: "relationship",
  },
  {
    pattern: "i'll handle",
    headline: "🛠️ Volunteer Under Pressure",
    comicTranslation:
      "He has raised a hand. Follow-through is a separate constellation.",
    possibleActualMeaning:
      "He may be agreeing to end the tension; action still pending.",
    riskLevel: "medium",
    lowestRiskReply: "Thanks — can you send a screenshot when it's done?",
    tinyWholesomeNudge: "Gentle accountability is not nagging.",
    category: "plans",
  },
  {
    pattern: "ill handle",
    headline: "🛠️ Volunteer Under Pressure",
    comicTranslation:
      "He has raised a hand. Follow-through is a separate constellation.",
    possibleActualMeaning:
      "He may be agreeing to end the tension; action still pending.",
    riskLevel: "medium",
    lowestRiskReply: "Thanks — can you send a screenshot when it's done?",
    tinyWholesomeNudge: "Gentle accountability is not nagging.",
    category: "plans",
  },
  {
    pattern: "i forgot",
    headline: "🌫️ Memory Fog",
    comicTranslation:
      "A fog rolled in over the important thing. Fog is common. Ownership still helps.",
    possibleActualMeaning: "He may have genuinely forgotten and feels awkward.",
    riskLevel: "medium",
    lowestRiskReply: "Okay. Please put it in your phone now so it sticks.",
    tinyWholesomeNudge: "Accept the fog. Ask for a system.",
    category: "classic",
  },
  {
    pattern: "my bad",
    headline: "🪨 Minimum Viable Pebble",
    comicTranslation:
      "He has placed one small apology pebble in the basket.",
    spicyComicTranslation:
      "Tiny pebble detected. You may request pebble seasoning.",
    possibleActualMeaning:
      "He may be sincere but under-elaborated.",
    riskLevel: "medium",
    lowestRiskReply: "Thanks. I appreciate that — a bit more reassurance would help.",
    tinyWholesomeNudge: "Tiny apology can be real. Tiny apology can also need seasoning.",
    category: "apology",
  },
  {
    pattern: "showing up when it matters",
    headline: "🏁 Big Moments Only",
    comicTranslation:
      "He may define 'matters' as the finale only. Quiet planning days still count in the chart.",
    possibleActualMeaning:
      "He may undervalue the quiet labour between big moments.",
    riskLevel: "medium",
    lowestRiskReply: "Showing up early in the planning also matters to me.",
    tinyWholesomeNudge: "Love is often logistics in cute clothing.",
    category: "relationship",
  },
  {
    pattern: "family stuff",
    headline: "🏠 Family Orbit Anxiety",
    comicTranslation:
      "Family gatherings may feel like a thunderstorm in a cosy jumper. His social battery is blinking.",
    possibleActualMeaning:
      "He may be nervous about small talk, not rejecting your family.",
    riskLevel: "medium",
    lowestRiskReply: "Even an hour would mean a lot. Want an exit plan?",
    tinyWholesomeNudge: "Offer an exit hatch. Bravery loves exits.",
    category: "plans",
  },
  {
    pattern: "meeting parents",
    headline: "👪 The Big Step Card",
    comicTranslation:
      "Meeting parents may feel like a job interview with lasagna. Butterflies are allowed.",
    possibleActualMeaning:
      "He may need reassurance more than pressure.",
    riskLevel: "medium",
    lowestRiskReply: "No speeches required — just be you for a bit.",
    tinyWholesomeNudge: "Warm invites beat ultimatums.",
    category: "relationship",
  },
  {
    pattern: "forced small talk",
    headline: "💬 Small Talk Storm Cloud",
    comicTranslation:
      "His conversation deck may only have three cards, and two are weather.",
    possibleActualMeaning:
      "He may find new-people chat draining, not disrespectful.",
    riskLevel: "low",
    lowestRiskReply: "I'll help with intros. You just need to show up warm.",
    tinyWholesomeNudge: "Pair him with one easy person first.",
    category: "classic",
  },
  {
    pattern: "i am serious",
    headline: "💍 Serious (Private Mode)",
    comicTranslation:
      "Seriousness may be installed. Public proof is still buffering.",
    possibleActualMeaning:
      "He may feel committed and still avoid symbolic gestures.",
    riskLevel: "medium",
    lowestRiskReply: "I hear you. Showing up Sunday would help me feel that.",
    tinyWholesomeNudge: "Ask for one visible action, not a speech.",
    category: "relationship",
  },
  {
    pattern: "i'm not staying all day",
    headline: "🚪 Pre-Planned Escape Hatch",
    comicTranslation:
      "He will attend, with an exit strategy already packed like a picnic.",
    possibleActualMeaning:
      "He may be willing if the visit has a clear end time.",
    riskLevel: "low",
    lowestRiskReply: "Deal — one hour is perfect.",
    tinyWholesomeNudge: "Boundaries can be loving.",
    category: "plans",
  },
  {
    pattern: "im not staying all day",
    headline: "🚪 Pre-Planned Escape Hatch",
    comicTranslation:
      "He will attend, with an exit strategy already packed like a picnic.",
    possibleActualMeaning:
      "He may be willing if the visit has a clear end time.",
    riskLevel: "low",
    lowestRiskReply: "Deal — one hour is perfect.",
    tinyWholesomeNudge: "Boundaries can be loving.",
    category: "plans",
  },
  {
    pattern: "don't put words in my mouth",
    headline: "👄 Accuracy Offense",
    comicTranslation:
      "You may have summarised his stalling too well. Accuracy can sting.",
    possibleActualMeaning:
      "He may feel cornered by a fair interpretation.",
    riskLevel: "medium",
    lowestRiskReply: "Okay — tell me in your words what you mean.",
    tinyWholesomeNudge: "Invite his version. Then compare gently.",
    category: "relationship",
  },
  {
    pattern: "dont put words in my mouth",
    headline: "👄 Accuracy Offense",
    comicTranslation:
      "You may have summarised his stalling too well. Accuracy can sting.",
    possibleActualMeaning:
      "He may feel cornered by a fair interpretation.",
    riskLevel: "medium",
    lowestRiskReply: "Okay — tell me in your words what you mean.",
    tinyWholesomeNudge: "Invite his version. Then compare gently.",
    category: "relationship",
  },
  {
    pattern: "let me see how work goes",
    headline: "🌫️ Vague Exit Ramp",
    comicTranslation:
      "A foggy maybe appears so he can cancel later without looking like he cancelled.",
    possibleActualMeaning:
      "He may be hedging to keep options open.",
    riskLevel: "medium",
    lowestRiskReply: "I need a yes or no by Thursday so I can tell my mum.",
    tinyWholesomeNudge: "Deadlines turn fog into weather reports.",
    category: "plans",
  },
  {
    pattern: "i'll be present",
    headline: "📍 Body Yes, Mind Maybe",
    comicTranslation:
      "Physical presence is promised. Mental presence is a bonus constellation.",
    possibleActualMeaning:
      "He may try, and still need a phone-away nudge.",
    riskLevel: "low",
    lowestRiskReply: "Amazing — phones in the bag for the first hour?",
    tinyWholesomeNudge: "Agree the phone rule before arrival.",
    category: "classic",
  },
  {
    pattern: "ill be present",
    headline: "📍 Body Yes, Mind Maybe",
    comicTranslation:
      "Physical presence is promised. Mental presence is a bonus constellation.",
    possibleActualMeaning:
      "He may try, and still need a phone-away nudge.",
    riskLevel: "low",
    lowestRiskReply: "Amazing — phones in the bag for the first hour?",
    tinyWholesomeNudge: "Agree the phone rule before arrival.",
    category: "classic",
  },
  {
    pattern: "no promises",
    headline: "🃏 Pre-Apology Draft",
    comicTranslation:
      "He is already drafting the apology for the thing he might do. Honest chaos.",
    possibleActualMeaning:
      "He may warn you because self-control feels shaky.",
    riskLevel: "low",
    lowestRiskReply: "Lol noted. Try anyway?",
    tinyWholesomeNudge: "Laugh, then set one clear boundary.",
    category: "classic",
  },
  {
    pattern: "how i get around new people",
    headline: "🔋 Social Battery Low",
    comicTranslation:
      "New-people weather: cloudy with a chance of awkward. Not personal — just shy electricity.",
    possibleActualMeaning:
      "He may need warm-up time in groups.",
    riskLevel: "low",
    lowestRiskReply: "I'll stay close at the start. You've got this.",
    tinyWholesomeNudge: "Be his soft landing, not his coach with a whistle.",
    category: "emotions",
  },
  {
    pattern: "it's awkward",
    headline: "😳 Awkward Moon Rising",
    comicTranslation:
      "Awkwardness detected. Mild human interaction may feel louder to him than it looks.",
    possibleActualMeaning:
      "He may be anxious, not unwilling.",
    riskLevel: "low",
    lowestRiskReply: "Awkward is fine. Showing up is the win.",
    tinyWholesomeNudge: "Celebrate presence over performance.",
    category: "emotions",
  },
  {
    pattern: "its awkward",
    headline: "😳 Awkward Moon Rising",
    comicTranslation:
      "Awkwardness detected. Mild human interaction may feel louder to him than it looks.",
    possibleActualMeaning:
      "He may be anxious, not unwilling.",
    riskLevel: "low",
    lowestRiskReply: "Awkward is fine. Showing up is the win.",
    tinyWholesomeNudge: "Celebrate presence over performance.",
    category: "emotions",
  },
  {
    pattern: "not ready to book",
    headline: "✈️ Fantasy Trip, Real Card",
    comicTranslation:
      "He may love the dream trip and fear the adulting of the deposit.",
    possibleActualMeaning:
      "He may want the idea more than the commitment right now.",
    riskLevel: "medium",
    lowestRiskReply: "Want to pause the trip, or split a cheaper option?",
    tinyWholesomeNudge: "Name money plainly. Fog hates numbers.",
    category: "plans",
  },
  {
    pattern: "money is tight",
    headline: "💸 Budget Weather",
    comicTranslation:
      "This may be true. It may also be a shield against deciding. Both can coexist.",
    possibleActualMeaning:
      "He may have a real constraint and poor communication timing.",
    riskLevel: "low",
    lowestRiskReply: "Thanks for saying that. Let's pick a cheaper plan.",
    tinyWholesomeNudge: "Honesty about money is intimacy, weirdly.",
    category: "plans",
  },
  {
    pattern: "i'll make it work",
    headline: "🪄 Vague Commitment Sparkles",
    comicTranslation:
      "Sparkly words appear. Calendar and budget are still loading behind a velvet curtain.",
    possibleActualMeaning:
      "He may be soothing you without a concrete plan yet.",
    riskLevel: "medium",
    lowestRiskReply: "Love that — can you confirm a date by Friday?",
    tinyWholesomeNudge: "Sparkle + deadline = usable plan.",
    category: "plans",
  },
  {
    pattern: "ill make it work",
    headline: "🪄 Vague Commitment Sparkles",
    comicTranslation:
      "Sparkly words appear. Calendar and budget are still loading behind a velvet curtain.",
    possibleActualMeaning:
      "He may be soothing you without a concrete plan yet.",
    riskLevel: "medium",
    lowestRiskReply: "Love that — can you confirm a date by Friday?",
    tinyWholesomeNudge: "Sparkle + deadline = usable plan.",
    category: "plans",
  },
  {
    pattern: "i'll book it",
    headline: "🎫 Verbal Booking Ritual",
    comicTranslation:
      "He has spoken the booking into existence. The website may not have heard yet.",
    spicyComicTranslation:
      "Consider it verbally booked. Physically booked? Ask the stars tomorrow.",
    possibleActualMeaning:
      "He may be ending the argument with intent, not a confirmation email.",
    riskLevel: "medium",
    lowestRiskReply: "Send me the confirmation when it's done?",
    tinyWholesomeNudge: "Receipts are romantic.",
    category: "plans",
  },
  {
    pattern: "ill book it",
    headline: "🎫 Verbal Booking Ritual",
    comicTranslation:
      "He has spoken the booking into existence. The website may not have heard yet.",
    possibleActualMeaning:
      "He may be ending the argument with intent, not a confirmation email.",
    riskLevel: "medium",
    lowestRiskReply: "Send me the confirmation when it's done?",
    tinyWholesomeNudge: "Receipts are romantic.",
    category: "plans",
  },
  {
    pattern: "i'll pay you back",
    headline: "💳 Friendship Loan Tarot",
    comicTranslation:
      "A soft IOU appears. APR: vibes. Still, the intention is neighbourly.",
    possibleActualMeaning:
      "He may mean it and still need a reminder system.",
    riskLevel: "medium",
    lowestRiskReply: "Okay — Venmo me when you can this week?",
    tinyWholesomeNudge: "Agree a when, not just a whether.",
    category: "plans",
  },
  {
    pattern: "ill pay you back",
    headline: "💳 Friendship Loan Tarot",
    comicTranslation:
      "A soft IOU appears. APR: vibes. Still, the intention is neighbourly.",
    possibleActualMeaning:
      "He may mean it and still need a reminder system.",
    riskLevel: "medium",
    lowestRiskReply: "Okay — Venmo me when you can this week?",
    tinyWholesomeNudge: "Agree a when, not just a whether.",
    category: "plans",
  },
  {
    pattern: "for real",
    headline: "✨ Emphasis Charm",
    comicTranslation:
      "Extra sparkles added because previous promises felt like wet cardboard.",
    possibleActualMeaning:
      "He knows trust is thin and is trying to reinforce this one.",
    riskLevel: "medium",
    lowestRiskReply: "Okay. I'll believe this one when I see the booking.",
    tinyWholesomeNudge: "Trust rebuilds in actions, not adjectives.",
    category: "classic",
  },
  {
    pattern: "i said i'll do it",
    headline: "🗣️ Intent ≠ Done",
    comicTranslation:
      "Announcing the plan is not completing the plan. A classic mix-up.",
    possibleActualMeaning:
      "He may think saying it counts as progress.",
    riskLevel: "medium",
    lowestRiskReply: "I heard you. Ping me when it's actually done?",
    tinyWholesomeNudge: "Celebrate done, not declared.",
    category: "classic",
  },
  {
    pattern: "i said ill do it",
    headline: "🗣️ Intent ≠ Done",
    comicTranslation:
      "Announcing the plan is not completing the plan. A classic mix-up.",
    possibleActualMeaning:
      "He may think saying it counts as progress.",
    riskLevel: "medium",
    lowestRiskReply: "I heard you. Ping me when it's actually done?",
    tinyWholesomeNudge: "Celebrate done, not declared.",
    category: "classic",
  },
  {
    pattern: "trust me",
    headline: "🤞 The Trust Me Card",
    comicTranslation:
      "Please ignore the track record and believe this specific sentence. Bold magic.",
    spicyComicTranslation:
      "Famous last words. Frame them next to 'I'm almost there'.",
    possibleActualMeaning:
      "He may be sincere this time and still owes proof.",
    riskLevel: "medium",
    lowestRiskReply: "I want to. Show me with the follow-through?",
    tinyWholesomeNudge: "Hope is allowed. Blind faith is optional.",
    category: "classic",
  },
  {
    pattern: "i won't",
    headline: "🛡️ Anti-Flake Charm",
    comicTranslation:
      "A promise not to flake, spoken by a mouth that has flaked before. Today's theory: try believing lightly.",
    possibleActualMeaning:
      "He may be trying to reassure under pressure.",
    riskLevel: "medium",
    lowestRiskReply: "Okay. I'll hold you to tonight.",
    tinyWholesomeNudge: "Light accountability, heavy kindness.",
    category: "plans",
  },
  {
    pattern: "i wont",
    headline: "🛡️ Anti-Flake Charm",
    comicTranslation:
      "A promise not to flake, spoken by a mouth that has flaked before. Today's theory: try believing lightly.",
    possibleActualMeaning:
      "He may be trying to reassure under pressure.",
    riskLevel: "medium",
    lowestRiskReply: "Okay. I'll hold you to tonight.",
    tinyWholesomeNudge: "Light accountability, heavy kindness.",
    category: "plans",
  },
  {
    pattern: "you're right",
    headline: "🏳️ Strategic Surrender",
    comicTranslation:
      "Agreement deployed to end the weather event. Change may still be packing its bags.",
    possibleActualMeaning:
      "He may be de-escalating rather than fully processing.",
    riskLevel: "low",
    lowestRiskReply: "Thanks — what will you do differently next time?",
    tinyWholesomeNudge: "Accept the yes. Ask for one next step.",
    category: "relationship",
  },
  {
    pattern: "youre right",
    headline: "🏳️ Strategic Surrender",
    comicTranslation:
      "Agreement deployed to end the weather event. Change may still be packing its bags.",
    possibleActualMeaning:
      "He may be de-escalating rather than fully processing.",
    riskLevel: "low",
    lowestRiskReply: "Thanks — what will you do differently next time?",
    tinyWholesomeNudge: "Accept the yes. Ask for one next step.",
    category: "relationship",
  },
  {
    pattern: "that's not fair",
    headline: "⚖️ Foul Called",
    comicTranslation:
      "You connected dots he preferred as abstract art. He is calling foul.",
    possibleActualMeaning:
      "He may feel mischaracterised even if the pattern is real.",
    riskLevel: "medium",
    lowestRiskReply: "Fair — tell me how you see it.",
    tinyWholesomeNudge: "Curiosity cools heat faster than winning.",
    category: "relationship",
  },
  {
    pattern: "thats not fair",
    headline: "⚖️ Foul Called",
    comicTranslation:
      "You connected dots he preferred as abstract art. He is calling foul.",
    possibleActualMeaning:
      "He may feel mischaracterised even if the pattern is real.",
    riskLevel: "medium",
    lowestRiskReply: "Fair — tell me how you see it.",
    tinyWholesomeNudge: "Curiosity cools heat faster than winning.",
    category: "relationship",
  },
  {
    pattern: "i like the idea",
    headline: "💭 Idea Yes, Logistics Maybe",
    comicTranslation:
      "Emotional support for the trip: high. Logistical support: still consulting the moon.",
    possibleActualMeaning:
      "He may want the vibe and fear the commitment.",
    riskLevel: "medium",
    lowestRiskReply: "Love that — can we decide by Sunday?",
    tinyWholesomeNudge: "Separate dream-yes from book-yes.",
    category: "plans",
  },
  {
    pattern: "not yet",
    headline: "👀 Seen From a Distance",
    comicTranslation:
      "He saw the message. He respected it from across the room. Action pending.",
    possibleActualMeaning:
      "He may be avoiding a decision, not ignoring you personally.",
    riskLevel: "medium",
    lowestRiskReply: "When can you look? I need a timeline.",
    tinyWholesomeNudge: "A when turns 'not yet' into a plan.",
    category: "plans",
  },
  {
    pattern: "we should hang out sometime",
    headline: "📅 Infinite Sometime",
    comicTranslation:
      "Sometime is a beautiful empty calendar. Initiation may be waiting on you.",
    possibleActualMeaning:
      "He may like you and still not drive the planning.",
    riskLevel: "low",
    lowestRiskReply: "Free Thursday? I'll pick a place.",
    tinyWholesomeNudge: "Concrete > cosmic.",
    category: "plans",
  },
  {
    pattern: "pick a weekend",
    headline: "🎲 Decision Boomerang",
    comicTranslation:
      "He returns the decision ball so he can later have feelings about the choice. Sporty.",
    possibleActualMeaning:
      "He may want you to lead logistics.",
    riskLevel: "low",
    lowestRiskReply: "Okay — 12–14th. Confirm by tonight?",
    tinyWholesomeNudge: "Pick one. Ask for a yes.",
    category: "plans",
  },
  {
    pattern: "come on",
    headline: "🫠 Charm Escape Attempt",
    comicTranslation:
      "A soft 'come on' appears — possibly an attempt to charm out of accountability.",
    possibleActualMeaning:
      "He may want the tension to dissolve quickly.",
    riskLevel: "medium",
    lowestRiskReply: "I hear you. I still need the follow-through.",
    tinyWholesomeNudge: "Warmth yes. Amnesia no.",
    category: "relationship",
  },
  {
    pattern: "do whatever you want",
    headline: "🪤 The Polite Trap Card",
    comicTranslation:
      "Do NOT do whatever you want. There is a correct answer hiding behind the curtain.",
    spicyComicTranslation:
      "This is a trap dressed as freedom. Choose carefully, traveller.",
    possibleActualMeaning:
      "He may be upset and testing whether you can read the room.",
    riskLevel: "high",
    lowestRiskReply: "I want us both happy — what would feel good to you?",
    tinyWholesomeNudge: "Ask the real preference. Skip the minefield stroll.",
    category: "relationship",
  },
  {
    pattern: "it's not that deep",
    headline: "🌊 Shallow End Invitation",
    comicTranslation:
      "It may be deep to someone. He is inviting you to the paddling pool.",
    possibleActualMeaning:
      "He may lack words for why it bothers him, so he shrinks it.",
    riskLevel: "medium",
    lowestRiskReply: "It feels a bit deep to me. Can we talk anyway?",
    tinyWholesomeNudge: "Depth is allowed in small doses.",
    category: "emotions",
  },
  {
    pattern: "its not that deep",
    headline: "🌊 Shallow End Invitation",
    comicTranslation:
      "It may be deep to someone. He is inviting you to the paddling pool.",
    possibleActualMeaning:
      "He may lack words for why it bothers him, so he shrinks it.",
    riskLevel: "medium",
    lowestRiskReply: "It feels a bit deep to me. Can we talk anyway?",
    tinyWholesomeNudge: "Depth is allowed in small doses.",
    category: "emotions",
  },
  {
    pattern: "you're overthinking it",
    headline: "🧠 Underthinking Alliance",
    comicTranslation:
      "He may be underthinking and would like company in the shallow end.",
    possibleActualMeaning:
      "He wants less analysis, not necessarily that you're wrong.",
    riskLevel: "medium",
    lowestRiskReply: "Maybe. I still need one clear answer.",
    tinyWholesomeNudge: "One question is not a novel.",
    category: "relationship",
  },
  {
    pattern: "youre overthinking it",
    headline: "🧠 Underthinking Alliance",
    comicTranslation:
      "He may be underthinking and would like company in the shallow end.",
    possibleActualMeaning:
      "He wants less analysis, not necessarily that you're wrong.",
    riskLevel: "medium",
    lowestRiskReply: "Maybe. I still need one clear answer.",
    tinyWholesomeNudge: "One question is not a novel.",
    category: "relationship",
  },
  {
    pattern: "nothing's wrong",
    headline: "🚗 Car Park Meditation",
    comicTranslation:
      "Everything may be wrong. He might process it alone in a parked car with the engine off.",
    possibleActualMeaning:
      "He may need solitude before he can talk.",
    riskLevel: "medium",
    lowestRiskReply: "Okay. I'm here when you want to share.",
    tinyWholesomeNudge: "Space can be care. Silence isn't always a test.",
    category: "emotions",
  },
  {
    pattern: "nothings wrong",
    headline: "🚗 Car Park Meditation",
    comicTranslation:
      "Everything may be wrong. He might process it alone in a parked car with the engine off.",
    possibleActualMeaning:
      "He may need solitude before he can talk.",
    riskLevel: "medium",
    lowestRiskReply: "Okay. I'm here when you want to share.",
    tinyWholesomeNudge: "Space can be care. Silence isn't always a test.",
    category: "emotions",
  },
  {
    pattern: "i'll think about it",
    headline: "⏳ Soft No Buffer",
    comicTranslation:
      "He may have decided no and is buying time for you to forget you asked.",
    possibleActualMeaning:
      "Delay can be avoidance dressed as consideration.",
    riskLevel: "medium",
    lowestRiskReply: "When should I check back — Wednesday?",
    tinyWholesomeNudge: "A deadline turns fog into weather.",
    category: "classic",
  },
  {
    pattern: "ill think about it",
    headline: "⏳ Soft No Buffer",
    comicTranslation:
      "He may have decided no and is buying time for you to forget you asked.",
    possibleActualMeaning:
      "Delay can be avoidance dressed as consideration.",
    riskLevel: "medium",
    lowestRiskReply: "When should I check back — Wednesday?",
    tinyWholesomeNudge: "A deadline turns fog into weather.",
    category: "classic",
  },
  {
    pattern: "let me check",
    headline: "🕵️ 48-Hour Theatre",
    comicTranslation:
      "He may already know the answer is no, and needs 48 hours of theatre.",
    possibleActualMeaning:
      "Checking can be a polite stall.",
    riskLevel: "low",
    lowestRiskReply: "Okay — text me either way tomorrow?",
    tinyWholesomeNudge: "Ask for a when with the check.",
    category: "classic",
  },
  {
    pattern: "nah i'm good",
    headline: "🍪 Soft Suffering",
    comicTranslation:
      "He may not be good. He may be suffering politely with a snack.",
    possibleActualMeaning:
      "He may decline help while still wanting care.",
    riskLevel: "low",
    lowestRiskReply: "Alright. I'm around if that changes.",
    tinyWholesomeNudge: "Leave the door open. Don't kick it in.",
    category: "emotions",
  },
  {
    pattern: "nah im good",
    headline: "🍪 Soft Suffering",
    comicTranslation:
      "He may not be good. He may be suffering politely with a snack.",
    possibleActualMeaning:
      "He may decline help while still wanting care.",
    riskLevel: "low",
    lowestRiskReply: "Alright. I'm around if that changes.",
    tinyWholesomeNudge: "Leave the door open. Don't kick it in.",
    category: "emotions",
  },
  {
    pattern: "i'm fine",
    headline: "🌤️ Suspicious Sunshine",
    comicTranslation:
      "The sky says fine. The sky may be lying. Or it may simply be fine. Today's theory: soft check-in.",
    possibleActualMeaning:
      "He may actually be fine — or using fine as a force field.",
    riskLevel: "medium",
    lowestRiskReply: "Okay. If you're not, I'm here.",
    tinyWholesomeNudge: "One gentle offer. No interrogation lamp.",
    category: "emotions",
  },
  {
    pattern: "im fine",
    headline: "🌤️ Suspicious Sunshine",
    comicTranslation:
      "The sky says fine. The sky may be lying. Or it may simply be fine. Today's theory: soft check-in.",
    possibleActualMeaning:
      "He may actually be fine — or using fine as a force field.",
    riskLevel: "medium",
    lowestRiskReply: "Okay. If you're not, I'm here.",
    tinyWholesomeNudge: "One gentle offer. No interrogation lamp.",
    category: "emotions",
  },
  {
    pattern: "i don't care",
    headline: "🎭 Indifference Performance",
    comicTranslation:
      "He may care deeply and is performing indifference for dramatic effect.",
    possibleActualMeaning:
      "Protective numbness is a common short-term spell.",
    riskLevel: "medium",
    lowestRiskReply: "I think you do care. Want to talk when it's quieter?",
    tinyWholesomeNudge: "Don't chase the performance. Offer a seat.",
    category: "emotions",
  },
  {
    pattern: "i dont care",
    headline: "🎭 Indifference Performance",
    comicTranslation:
      "He may care deeply and is performing indifference for dramatic effect.",
    possibleActualMeaning:
      "Protective numbness is a common short-term spell.",
    riskLevel: "medium",
    lowestRiskReply: "I think you do care. Want to talk when it's quieter?",
    tinyWholesomeNudge: "Don't chase the performance. Offer a seat.",
    category: "emotions",
  },
  {
    pattern: "i'm tired",
    headline: "😴 Availability Eclipse",
    comicTranslation:
      "Tired may mean sleepy. Tired may mean emotionally offline and calling it sleep.",
    possibleActualMeaning:
      "He may need rest before relational bandwidth returns.",
    riskLevel: "low",
    lowestRiskReply: "Rest. We can talk tomorrow?",
    tinyWholesomeNudge: "Food and sleep solve surprising plot points.",
    category: "emotions",
  },
  {
    pattern: "im tired",
    headline: "😴 Availability Eclipse",
    comicTranslation:
      "Tired may mean sleepy. Tired may mean emotionally offline and calling it sleep.",
    possibleActualMeaning:
      "He may need rest before relational bandwidth returns.",
    riskLevel: "low",
    lowestRiskReply: "Rest. We can talk tomorrow?",
    tinyWholesomeNudge: "Food and sleep solve surprising plot points.",
    category: "emotions",
  },
  {
    pattern: "i'm busy",
    headline: "📅 Aura of Busyness",
    comicTranslation:
      "Today's aura suggests he may, shockingly, be busy.",
    spicyComicTranslation:
      "Busy omen confirmed. Do not summon three hidden meanings yet.",
    possibleActualMeaning:
      "He may literally be busy — or using busy as a soft boundary.",
    riskLevel: "low",
    lowestRiskReply: "No worries — ping me when free.",
    tinyWholesomeNudge: "Do not summon three hidden meanings yet.",
    category: "plans",
  },
  {
    pattern: "im busy",
    headline: "📅 Aura of Busyness",
    comicTranslation:
      "Today's aura suggests he may, shockingly, be busy.",
    possibleActualMeaning:
      "He may literally be busy — or using busy as a soft boundary.",
    riskLevel: "low",
    lowestRiskReply: "No worries — ping me when free.",
    tinyWholesomeNudge: "Do not summon three hidden meanings yet.",
    category: "plans",
  },
  {
    pattern: "it's fine",
    headline: "🕊️ Temporary Peace Treaty",
    comicTranslation:
      "It may not be fine. He may be choosing peace over honesty. Temporarily.",
    possibleActualMeaning:
      "He may be shelving conflict to keep the evening calm.",
    riskLevel: "medium",
    lowestRiskReply: "If it's not fine, we can talk lightly later.",
    tinyWholesomeNudge: "Leave a door open without forcing it.",
    category: "emotions",
  },
  {
    pattern: "its fine",
    headline: "🕊️ Temporary Peace Treaty",
    comicTranslation:
      "It may not be fine. He may be choosing peace over honesty. Temporarily.",
    possibleActualMeaning:
      "He may be shelving conflict to keep the evening calm.",
    riskLevel: "medium",
    lowestRiskReply: "If it's not fine, we can talk lightly later.",
    tinyWholesomeNudge: "Leave a door open without forcing it.",
    category: "emotions",
  },
  {
    pattern: "i'm listening",
    headline: "🎧 Half-Presence Charm",
    comicTranslation:
      "Ears may be open. Mind may be visiting a distant meadow about jetpacks.",
    possibleActualMeaning:
      "He may be trying and still distracted.",
    riskLevel: "low",
    lowestRiskReply: "Can I get your eyes for two minutes?",
    tinyWholesomeNudge: "Ask for presence, not perfection.",
    category: "classic",
  },
  {
    pattern: "im listening",
    headline: "🎧 Half-Presence Charm",
    comicTranslation:
      "Ears may be open. Mind may be visiting a distant meadow about jetpacks.",
    possibleActualMeaning:
      "He may be trying and still distracted.",
    riskLevel: "low",
    lowestRiskReply: "Can I get your eyes for two minutes?",
    tinyWholesomeNudge: "Ask for presence, not perfection.",
    category: "classic",
  },
  {
    pattern: "sounds good",
    headline: "👍 Affirmative Noise",
    comicTranslation:
      "Affirmative noise deployed. Listening levels: unknown. Harmony: temporary.",
    possibleActualMeaning:
      "He may be agreeing to end the thread, not confirming details.",
    riskLevel: "low",
    lowestRiskReply: "Great — so we're on for 7?",
    tinyWholesomeNudge: "Confirm the one detail that matters.",
    category: "texting",
  },
  {
    pattern: "no worries",
    headline: "📓 Silent Catalogue",
    comicTranslation:
      "No worries spoken. A tiny note may still be filed for later weather.",
    possibleActualMeaning:
      "He may truly be fine — or politely shelving it.",
    riskLevel: "low",
    lowestRiskReply: "Thanks. Still sorry it happened.",
    tinyWholesomeNudge: "Take it at face value unless patterns say otherwise.",
    category: "relationship",
  },
  {
    pattern: "yeah yeah",
    headline: "🚪 Exit Ramp Humming",
    comicTranslation:
      "Please stop talking so he can leave the conversation gracefully. Soft eject.",
    possibleActualMeaning:
      "He may be overloaded and winding down.",
    riskLevel: "medium",
    lowestRiskReply: "Okay — last thing, then I'll let you go.",
    tinyWholesomeNudge: "One closing line. Then release.",
    category: "texting",
  },
  {
    pattern: "hold on",
    headline: "👻 Brief Disappearance Spell",
    comicTranslation:
      "He may now vanish for 45 minutes without a subplot explanation.",
    possibleActualMeaning:
      "He got distracted mid-thread. Probably not a secret society.",
    riskLevel: "low",
    lowestRiskReply: "Ok — ping me when you're back.",
    tinyWholesomeNudge: "Do not invent a saga from a pause.",
    category: "texting",
  },
  {
    pattern: "promise",
    headline: "🥠 Fortune Cookie Vow",
    comicTranslation:
      "A verbal IOU with the legal weight of a fortune cookie. Still sweet.",
    possibleActualMeaning:
      "He may mean it in the moment more than across time.",
    riskLevel: "medium",
    lowestRiskReply: "Love a promise — love a done even more.",
    tinyWholesomeNudge: "Cheer the promise. Track the done.",
    category: "classic",
  },
  {
    pattern: "sorry",
    headline: "🃏 The Small Apology Card",
    comicTranslation:
      "He has offered one apology pebble and believes the bridge has reopened.",
    spicyComicTranslation:
      "One pebble in the basket. You may ask for more pebbles if needed.",
    possibleActualMeaning:
      "He may be sincere, but not very expressive.",
    riskLevel: "medium",
    lowestRiskReply:
      "Thanks. I appreciate that. I just need a bit more reassurance.",
    tinyWholesomeNudge:
      "Tiny apology can be real. Tiny apology can also need seasoning.",
    category: "apology",
  },
  {
    pattern: "haha",
    headline: "😅 Smoke Bomb Chuckle",
    comicTranslation:
      "Humour smoke bomb deployed. Tension may still be in the room.",
    possibleActualMeaning:
      "He may be uncomfortable and trying to keep things light.",
    riskLevel: "low",
    lowestRiskReply: "Lol. Also though — can we finish the serious bit?",
    tinyWholesomeNudge: "Laugh, then land the plane.",
    category: "texting",
  },
  {
    pattern: "bruh",
    headline: "😮‍💨 One-Syllable Weather",
    comicTranslation:
      "Profound emotional weather, compressed into one syllable.",
    possibleActualMeaning:
      "He may be overwhelmed, amused, or both.",
    riskLevel: "low",
    lowestRiskReply: "That bad, huh?",
    tinyWholesomeNudge: "Match the brevity. Offer an ear.",
    category: "emotions",
  },
  {
    pattern: "idk",
    headline: "🙈 Known Unknown",
    comicTranslation:
      "He may know. He may simply not want this conversation right now.",
    possibleActualMeaning:
      "Avoidance dressed as uncertainty is a common outfit.",
    riskLevel: "medium",
    lowestRiskReply: "No pressure — want to revisit tonight?",
    tinyWholesomeNudge: "Don't force a map out of fog.",
    category: "texting",
  },
  {
    pattern: "lol",
    headline: "😂 Discomfort Confetti",
    comicTranslation:
      "Uncomfortable and deploying humour as confetti. Sweep carefully.",
    possibleActualMeaning:
      "He may be nervous, not mocking.",
    riskLevel: "low",
    lowestRiskReply: "Haha. For real though —",
    tinyWholesomeNudge: "Steer back gently.",
    category: "texting",
  },
  {
    pattern: "ok",
    headline: "🌙 Tiny Omen Detected",
    comicTranslation: "The universe offers one small stone: ok.",
    spicyComicTranslation:
      "The stars are unusually quiet. This may simply mean 'ok'.",
    possibleActualMeaning:
      "He acknowledged the message and may not be carrying extra emotional cargo.",
    riskLevel: "low",
    lowestRiskReply: "No worries x",
    tinyWholesomeNudge:
      "Maybe do not build a cathedral of meaning from two letters.",
    category: "texting",
  },
  {
    pattern: "k",
    headline: "🌙 Tiny Omen Detected",
    comicTranslation:
      "The stars are unusually quiet. This may simply mean 'ok'.",
    spicyComicTranslation:
      "A single letter arrives. Detective work can wait for a stronger omen.",
    possibleActualMeaning:
      "He may be mildly annoyed — or just efficient. Today's theory: efficient.",
    riskLevel: "low",
    lowestRiskReply: "No worries x",
    tinyWholesomeNudge: "Save the detective work for a stronger omen.",
    category: "texting",
  },
]
