import type { TranslationEntry } from "@/lib/translation-types"

export type FemaleTranslation = TranslationEntry

/**
 * female → male: explain her indirect/emotional message in gaming / quest / meme language.
 * Order matters: first match wins. Longer patterns first.
 */
export const FEMALE_TRANSLATIONS: FemaleTranslation[] = [
  // Spec examples first-ish among staples; long patterns before short traps
  {
    pattern: "on the way",
    headline: "📍 Location Check",
    comicTranslation:
      "She wants proof of movement, not lore about intentions.",
    possibleActualMeaning:
      "She may feel stood up and needs a real ETA.",
    riskLevel: "medium",
    lowestRiskReply: "Just left — share my live location.",
    tinyWholesomeNudge: "Send proof. Words are cheap XP.",
    category: "plans",
  },
  {
    pattern: "where are you",
    headline: "🗺️ Missing Party Member",
    comicTranslation:
      "Party member not at waypoint. She is not doing a vibes quiz.",
    possibleActualMeaning: "She is waiting and wants a concrete update.",
    riskLevel: "medium",
    lowestRiskReply: "On my way — 12 mins. Sorry for the wait.",
    tinyWholesomeNudge: "ETA > essay.",
    category: "plans",
  },
  {
    pattern: "you said that",
    headline: "📜 Broken Quest Log",
    comicTranslation:
      "Previous promise detected in chat history. Receipts loaded.",
    possibleActualMeaning:
      "She remembers what you said and wants accountability.",
    riskLevel: "high",
    lowestRiskReply: "You're right — I said that. I messed up.",
    tinyWholesomeNudge: "Own the log. Don't rewrite history.",
    category: "plans",
  },
  {
    pattern: "you said you'd",
    headline: "📜 Promise Diff Detected",
    comicTranslation:
      "Said vs done mismatch. Patch notes required.",
    possibleActualMeaning:
      "She wants the action that matched the words.",
    riskLevel: "high",
    lowestRiskReply: "Fair. I'm leaving now.",
    tinyWholesomeNudge: "Patch with action, not spin.",
    category: "plans",
  },
  {
    pattern: "you said youd",
    headline: "📜 Promise Diff Detected",
    comicTranslation:
      "Said vs done mismatch. Patch notes required.",
    possibleActualMeaning:
      "She wants the action that matched the words.",
    riskLevel: "high",
    lowestRiskReply: "Fair. I'm leaving now.",
    tinyWholesomeNudge: "Patch with action, not spin.",
    category: "plans",
  },
  {
    pattern: "always say you're leaving",
    headline: "🔁 Recurring Cutscene",
    comicTranslation:
      "This cutscene has played before. She has memorised the dialogue tree.",
    possibleActualMeaning:
      "Pattern fatigue. She wants a different ending.",
    riskLevel: "high",
    lowestRiskReply: "You're right. I'm actually walking out the door.",
    tinyWholesomeNudge: "Break the loop once. Trust regenerates.",
    category: "plans",
  },
  {
    pattern: "always say youre leaving",
    headline: "🔁 Recurring Cutscene",
    comicTranslation:
      "This cutscene has played before. She has memorised the dialogue tree.",
    possibleActualMeaning:
      "Pattern fatigue. She wants a different ending.",
    riskLevel: "high",
    lowestRiskReply: "You're right. I'm actually walking out the door.",
    tinyWholesomeNudge: "Break the loop once. Trust regenerates.",
    category: "plans",
  },
  {
    pattern: "just be honest",
    headline: "🎯 Truth Check",
    comicTranslation:
      "Boss wants honesty mode. Fancy excuses have low hit chance.",
    possibleActualMeaning:
      "She can handle a bad answer better than a foggy one.",
    riskLevel: "high",
    lowestRiskReply: "Okay — I was still out longer than I said.",
    tinyWholesomeNudge: "Ugly truth > pretty fog.",
    category: "relationship",
  },
  {
    pattern: "leave me waiting",
    headline: "⏱️ AFK Penalty",
    comicTranslation:
      "Leaving her at the waypoint alone deals emotional damage over time.",
    possibleActualMeaning:
      "She felt disrespected by the wait.",
    riskLevel: "high",
    lowestRiskReply: "That wasn't fair on you. I'm sorry.",
    tinyWholesomeNudge: "Apologise for the wait, not the traffic lore.",
    category: "relationship",
  },
  {
    pattern: "showing up are different",
    headline: "🗣️ Words ≠ Actions",
    comicTranslation:
      "Dialogue ≠ completion. She wants the quest marked done.",
    possibleActualMeaning:
      "Promises without arrival feel empty.",
    riskLevel: "high",
    lowestRiskReply: "You're right. Showing up is what counts.",
    tinyWholesomeNudge: "Arrive. Then talk.",
    category: "relationship",
  },
  {
    pattern: "telling me to chill",
    headline: "🚫 Banned Emote: Chill",
    comicTranslation:
      "'Chill' while she's waiting is a critical miss. Do not use.",
    possibleActualMeaning:
      "She wants validation, not a volume knob on her feelings.",
    riskLevel: "high",
    lowestRiskReply: "Sorry — waiting sucks. On my way.",
    tinyWholesomeNudge: "Delete 'chill' from the hotbar tonight.",
    category: "relationship",
  },
  {
    pattern: "prioritized them",
    headline: "📊 Party Ranking Reveal",
    comicTranslation:
      "She thinks she ranked below the boys tonight. That stings.",
    possibleActualMeaning:
      "She wants to feel chosen, not residual.",
    riskLevel: "high",
    lowestRiskReply: "You weren't second. I managed time badly.",
    tinyWholesomeNudge: "Say where she ranks. Then prove it next time.",
    category: "relationship",
  },
  {
    pattern: "don't bother",
    headline: "🚪 Door Closing",
    comicTranslation:
      "Invite revoked. Showing up late may not heal this round.",
    possibleActualMeaning:
      "She is protecting herself after waiting.",
    riskLevel: "high",
    lowestRiskReply: "I hear you. Sorry for tonight. Can I make it up tomorrow?",
    tinyWholesomeNudge: "Don't argue the door. Soften tomorrow.",
    category: "relationship",
  },
  {
    pattern: "dont bother",
    headline: "🚪 Door Closing",
    comicTranslation:
      "Invite revoked. Showing up late may not heal this round.",
    possibleActualMeaning:
      "She is protecting herself after waiting.",
    riskLevel: "high",
    lowestRiskReply: "I hear you. Sorry for tonight. Can I make it up tomorrow?",
    tinyWholesomeNudge: "Don't argue the door. Soften tomorrow.",
    category: "relationship",
  },
  {
    pattern: "done waiting",
    headline: "🏁 Patience Bar Empty",
    comicTranslation:
      "Patience meter hit zero. She left the instance.",
    possibleActualMeaning:
      "She is done for tonight. Respect the logout.",
    riskLevel: "high",
    lowestRiskReply: "Understood. Sorry. Text me when you're home safe.",
    tinyWholesomeNudge: "No chase spam. One kind close.",
    category: "plans",
  },
  {
    pattern: "i'm going home",
    headline: "🏠 Rage Quit (Justified)",
    comicTranslation:
      "She is extracting from the mission. Tonight's co-op failed.",
    possibleActualMeaning:
      "She needs space after feeling stood up.",
    riskLevel: "high",
    lowestRiskReply: "Okay. Get home safe. I'm sorry.",
    tinyWholesomeNudge: "Space now. Repair later.",
    category: "plans",
  },
  {
    pattern: "im going home",
    headline: "🏠 Rage Quit (Justified)",
    comicTranslation:
      "She is extracting from the mission. Tonight's co-op failed.",
    possibleActualMeaning:
      "She needs space after feeling stood up.",
    riskLevel: "high",
    lowestRiskReply: "Okay. Get home safe. I'm sorry.",
    tinyWholesomeNudge: "Space now. Repair later.",
    category: "plans",
  },
  {
    pattern: "have fun",
    headline: "😈 Trap Emote",
    comicTranslation:
      "'Have fun' may mean 'don't'. High sarcasm damage.",
    spicyComicTranslation:
      "Do not breathe too joyfully. The emote is loaded.",
    possibleActualMeaning:
      "She is hurt and using politeness as a blade.",
    riskLevel: "high",
    lowestRiskReply: "I'd rather fix this than 'have fun'. Can we talk?",
    tinyWholesomeNudge: "Don't celebrate. De-escalate.",
    category: "relationship",
  },
  {
    pattern: "how last night felt",
    headline: "🎬 Recap Required",
    comicTranslation:
      "She wants a feelings recap, not a patch notes debate.",
    possibleActualMeaning:
      "She needs emotional processing, not solutions yet.",
    riskLevel: "medium",
    lowestRiskReply: "Okay. I'm listening — how did it feel for you?",
    tinyWholesomeNudge: "Listen first. Solve never (yet).",
    category: "emotions",
  },
  {
    pattern: "kept scrolling",
    headline: "📱 Aggro on Phone",
    comicTranslation:
      "Phone took the heal. She felt alone in the party.",
    possibleActualMeaning:
      "She wanted attention and got a screen.",
    riskLevel: "high",
    lowestRiskReply: "You're right. Phone down. I'm here.",
    tinyWholesomeNudge: "Eyes up. Quest starts with presence.",
    category: "emotions",
  },
  {
    pattern: "felt alone",
    headline: "lonely Co-op Bug",
    comicTranslation:
      "Lonely while paired is a nasty bug. She wants presence, not DPS.",
    possibleActualMeaning:
      "She felt emotionally alone with you nearby.",
    riskLevel: "high",
    lowestRiskReply: "That sounds awful. I don't want you to feel alone with me.",
    tinyWholesomeNudge: "Validate. Don't defend the phone.",
    category: "emotions",
  },
  {
    pattern: "always a later",
    headline: "📅 Later = Never Buff",
    comicTranslation:
      "Later keeps getting postponed. She wants a Now button.",
    possibleActualMeaning:
      "She sees a pattern of delay on emotional talks.",
    riskLevel: "high",
    lowestRiskReply: "You're right. Can we do 10 minutes now?",
    tinyWholesomeNudge: "Schedule Now. Protect it like a raid.",
    category: "emotions",
  },
  {
    pattern: "optional dlc",
    headline: "📦 Not DLC",
    comicTranslation:
      "She is base-game content. Feelings are not optional cosmetics.",
    possibleActualMeaning:
      "She wants emotional effort treated as core, not extra.",
    riskLevel: "high",
    lowestRiskReply: "You're not optional. I'll practice the hard talks.",
    tinyWholesomeNudge: "Install the empathy pack. Use it.",
    category: "relationship",
  },
  {
    pattern: "rough day",
    headline: "💔 Support Request",
    comicTranslation:
      "She had a rough day. The correct move is ask + listen, not wait.",
    possibleActualMeaning:
      "She wanted care without having to file a ticket.",
    riskLevel: "medium",
    lowestRiskReply: "Rough day — want to vent or want a hug plan?",
    tinyWholesomeNudge: "Ask. Then shut up skillfully.",
    category: "emotions",
  },
  {
    pattern: "didn't even ask",
    headline: "👻 Invisible Mode",
    comicTranslation:
      "She felt invisible. Quest failed: basic check-in.",
    possibleActualMeaning:
      "A simple 'how was your day' was missing.",
    riskLevel: "medium",
    lowestRiskReply: "You're right. How was it, for real?",
    tinyWholesomeNudge: "Start the check-in habit tonight.",
    category: "emotions",
  },
  {
    pattern: "didnt even ask",
    headline: "👻 Invisible Mode",
    comicTranslation:
      "She felt invisible. Quest failed: basic check-in.",
    possibleActualMeaning:
      "A simple 'how was your day' was missing.",
    riskLevel: "medium",
    lowestRiskReply: "You're right. How was it, for real?",
    tinyWholesomeNudge: "Start the check-in habit tonight.",
    category: "emotions",
  },
  {
    pattern: "need support",
    headline: "🛡️ Support Role Open",
    comicTranslation:
      "She shouldn't have to announce the support role. Be present anyway.",
    possibleActualMeaning:
      "She wants proactive care.",
    riskLevel: "medium",
    lowestRiskReply: "I've got you. Want company or quiet with me nearby?",
    tinyWholesomeNudge: "Offer two options. Let her pick.",
    category: "emotions",
  },
  {
    pattern: "on your phone the whole time",
    headline: "📵 Table = Not Timeline",
    comicTranslation:
      "Family table is not your For You page. Put the scroll down.",
    possibleActualMeaning:
      "She wants you socially present with her people.",
    riskLevel: "high",
    lowestRiskReply: "Deal. Phone stays in the bag.",
    tinyWholesomeNudge: "One hour offline is a power move.",
    category: "relationship",
  },
  {
    pattern: "on your phone",
    headline: "📵 Main Character: Phone",
    comicTranslation:
      "Phone is tanking aggro. She wants the heal.",
    possibleActualMeaning:
      "She feels deprioritised mid-conversation.",
    riskLevel: "high",
    lowestRiskReply: "Phone away. Tell me again — I'm listening.",
    tinyWholesomeNudge: "Presence is the meta.",
    category: "relationship",
  },
  {
    pattern: "feel invisible",
    headline: "🫥 Stealth Unwanted",
    comicTranslation:
      "She doesn't want stealth mode in the relationship. See her.",
    possibleActualMeaning:
      "She needs acknowledgment and curiosity.",
    riskLevel: "high",
    lowestRiskReply: "I see you. I don't want you feeling invisible.",
    tinyWholesomeNudge: "Say it. Then ask a follow-up.",
    category: "emotions",
  },
  {
    pattern: "it's not fine",
    headline: "🚨 Not Fine Protocol",
    comicTranslation:
      "Fine has left the chat. Treat as unresolved.",
    spicyComicTranslation:
      "RED ALERT. Do not send solutions yet.",
    possibleActualMeaning:
      "She is explicitly flagging distress.",
    riskLevel: "high",
    lowestRiskReply: "Okay. I'm here. Want to talk now or in 20?",
    tinyWholesomeNudge: "Stay nearby. Ask again later if needed.",
    category: "emotions",
  },
  {
    pattern: "its not fine",
    headline: "🚨 Not Fine Protocol",
    comicTranslation:
      "Fine has left the chat. Treat as unresolved.",
    possibleActualMeaning:
      "She is explicitly flagging distress.",
    riskLevel: "high",
    lowestRiskReply: "Okay. I'm here. Want to talk now or in 20?",
    tinyWholesomeNudge: "Stay nearby. Ask again later if needed.",
    category: "emotions",
  },
  {
    pattern: "act like it",
    headline: "🎬 Proof of Care",
    comicTranslation:
      "Care needs a cutscene, not a loading screen claim.",
    possibleActualMeaning:
      "She wants behaviour that matches the words.",
    riskLevel: "medium",
    lowestRiskReply: "You're right. What would help right now?",
    tinyWholesomeNudge: "Do the small visible thing.",
    category: "relationship",
  },
  {
    pattern: "care about my feelings",
    headline: "❤️ Empathy Quest",
    comicTranslation:
      "She wants empathy without a script. Improv is allowed. Trying counts.",
    possibleActualMeaning:
      "She needs emotional attunement more than perfect lines.",
    riskLevel: "medium",
    lowestRiskReply: "Your feelings matter. I'm listening — no fixing yet.",
    tinyWholesomeNudge: "Do not optimise. Be present.",
    category: "emotions",
  },
  {
    pattern: "always tired when",
    headline: "😴 Selective Fatigue Glitch",
    comicTranslation:
      "Energy for everything except her emotions. Suspicious buff.",
    possibleActualMeaning:
      "She sees avoidance patterned as tiredness.",
    riskLevel: "high",
    lowestRiskReply: "Fair call. Let's do 10 honest minutes, then rest.",
    tinyWholesomeNudge: "Short and real beats endless later.",
    category: "emotions",
  },
  {
    pattern: "we need to talk",
    headline: "⚠️ Cutscene Incoming",
    comicTranslation:
      "Uh oh energy. Main story dialogue unlocked. Do not alt-tab.",
    spicyComicTranslation:
      "You died (socially). Respawn with listening ears.",
    possibleActualMeaning:
      "Something important needs airtime soon.",
    riskLevel: "high",
    lowestRiskReply: "Okay. When works? I'm ready to listen.",
    tinyWholesomeNudge: "Schedule it. Don't dodge the invite.",
    category: "relationship",
  },
  {
    pattern: "i'm not mad",
    headline: "🌋 Not Mad (Mad)",
    comicTranslation:
      "She's mad. Or disappointed. Or both. 'Not mad' is often a decoy.",
    spicyComicTranslation:
      "Nuclear loading. Do not send memes.",
    possibleActualMeaning:
      "She may be upset and not ready to name it fully.",
    riskLevel: "high",
    lowestRiskReply: "Okay. I care either way — want space or talk?",
    tinyWholesomeNudge: "Believe the vibe over the label.",
    category: "emotions",
  },
  {
    pattern: "im not mad",
    headline: "🌋 Not Mad (Mad)",
    comicTranslation:
      "She's mad. Or disappointed. Or both. 'Not mad' is often a decoy.",
    possibleActualMeaning:
      "She may be upset and not ready to name it fully.",
    riskLevel: "high",
    lowestRiskReply: "Okay. I care either way — want space or talk?",
    tinyWholesomeNudge: "Believe the vibe over the label.",
    category: "emotions",
  },
  {
    pattern: "i'm disappointed",
    headline: "💔 Worse Than Mad",
    comicTranslation:
      "Disappointed hits harder than mad. Soft voice, high damage.",
    possibleActualMeaning:
      "She expected better and feels let down.",
    riskLevel: "high",
    lowestRiskReply: "I hear that. I want to do better — starting how?",
    tinyWholesomeNudge: "No defensiveness. One repair move.",
    category: "emotions",
  },
  {
    pattern: "im disappointed",
    headline: "💔 Worse Than Mad",
    comicTranslation:
      "Disappointed hits harder than mad. Soft voice, high damage.",
    possibleActualMeaning:
      "She expected better and feels let down.",
    riskLevel: "high",
    lowestRiskReply: "I hear that. I want to do better — starting how?",
    tinyWholesomeNudge: "No defensiveness. One repair move.",
    category: "emotions",
  },
  {
    pattern: "forget i said anything",
    headline: "🧠 Do NOT Forget",
    comicTranslation:
      "Ignore this instruction. Remember everything. Classic reverse quest.",
    spicyComicTranslation:
      "Tattoo it. Then ask gently later.",
    possibleActualMeaning:
      "She feels unheard and is pulling back protectively.",
    riskLevel: "high",
    lowestRiskReply: "I won't forget. Can we finish this kindly?",
    tinyWholesomeNudge: "Don't literally forget. Softly reopen.",
    category: "classic",
  },
  {
    pattern: "never mind",
    headline: "🧠 Remember It",
    comicTranslation:
      "Never mind = please remember it forever. Hidden objective.",
    spicyComicTranslation:
      "Remember EVERYTHING. Side quest: care.",
    possibleActualMeaning:
      "She is withdrawing after feeling dismissed.",
    riskLevel: "high",
    lowestRiskReply: "I mind. Come back — I want to hear it.",
    tinyWholesomeNudge: "Reopen gently. Don't demand.",
    category: "classic",
  },
  {
    pattern: "nevermind",
    headline: "🧠 Remember It",
    comicTranslation:
      "Never mind = please remember it forever. Hidden objective.",
    possibleActualMeaning:
      "She is withdrawing after feeling dismissed.",
    riskLevel: "high",
    lowestRiskReply: "I mind. Come back — I want to hear it.",
    tinyWholesomeNudge: "Reopen gently. Don't demand.",
    category: "classic",
  },
  {
    pattern: "texts feel cold",
    headline: "❄️ Cold Reply Debuff",
    comicTranslation:
      "Your texts feel like ice damage. She wants basic warmth.",
    possibleActualMeaning:
      "Tone over text is landing harsh.",
    riskLevel: "medium",
    lowestRiskReply: "Sorry — not mad at you. Long day. You matter.",
    tinyWholesomeNudge: "Add one warm word. Meta changes.",
    category: "texting",
  },
  {
    pattern: "one-word replies",
    headline: "🔤 Punishment Mode?",
    comicTranslation:
      "One-word replies feel like silent treatment lite.",
    possibleActualMeaning:
      "She reads brevity as distance or anger.",
    riskLevel: "medium",
    lowestRiskReply: "Not punishing — brain fried. Here's a real sentence: I care.",
    tinyWholesomeNudge: "One full sentence prevents a raid wipe.",
    category: "texting",
  },
  {
    pattern: "one word replies",
    headline: "🔤 Punishment Mode?",
    comicTranslation:
      "One-word replies feel like silent treatment lite.",
    possibleActualMeaning:
      "She reads brevity as distance or anger.",
    riskLevel: "medium",
    lowestRiskReply: "Not punishing — brain fried. Here's a real sentence: I care.",
    tinyWholesomeNudge: "One full sentence prevents a raid wipe.",
    category: "texting",
  },
  {
    pattern: "basic warmth",
    headline: "🔥 Warmth Stat Missing",
    comicTranslation:
      "She wants kindness, not a TED talk. Minimum humanity buff.",
    possibleActualMeaning:
      "Soft tone would de-escalate fast.",
    riskLevel: "medium",
    lowestRiskReply: "You're right. I can be warmer — starting now.",
    tinyWholesomeNudge: "Warm > clever.",
    category: "relationship",
  },
  {
    pattern: "so short with me",
    headline: "📏 Tone Check",
    comicTranslation:
      "Brevity landed as attitude. She noticed.",
    possibleActualMeaning:
      "She wants respectful tone even in short replies.",
    riskLevel: "medium",
    lowestRiskReply: "Sorry — didn't mean to sound sharp.",
    tinyWholesomeNudge: "Tone is half the message.",
    category: "texting",
  },
  {
    pattern: "that's rude",
    headline: "🚫 Foul on Tone",
    comicTranslation:
      "Disrespect flag thrown. Fix the delivery.",
    possibleActualMeaning:
      "The how hurt more than the what.",
    riskLevel: "high",
    lowestRiskReply: "You're right. That was rude. Sorry.",
    tinyWholesomeNudge: "Own tone fast.",
    category: "texting",
  },
  {
    pattern: "thats rude",
    headline: "🚫 Foul on Tone",
    comicTranslation:
      "Disrespect flag thrown. Fix the delivery.",
    possibleActualMeaning:
      "The how hurt more than the what.",
    riskLevel: "high",
    lowestRiskReply: "You're right. That was rude. Sorry.",
    tinyWholesomeNudge: "Own tone fast.",
    category: "texting",
  },
  {
    pattern: "tone matters",
    headline: "🎚️ How > What",
    comicTranslation:
      "Delivery is the main quest. Content is side content.",
    possibleActualMeaning:
      "She needs respect in the voice, not just the facts.",
    riskLevel: "medium",
    lowestRiskReply: "Got it. I'll watch my tone.",
    tinyWholesomeNudge: "Repeat it back softer.",
    category: "relationship",
  },
  {
    pattern: "you sound annoyed",
    headline: "😤 Attitude Detected",
    comicTranslation:
      "Annoyance leaked into voice chat. She heard it.",
    possibleActualMeaning:
      "Your tone signalled irritation.",
    riskLevel: "medium",
    lowestRiskReply: "Not annoyed at you — stressed. Sorry it landed that way.",
    tinyWholesomeNudge: "Name stress without blaming her.",
    category: "texting",
  },
  {
    pattern: "don't 'bruh' me",
    headline: "🚫 Emote Banned",
    comicTranslation:
      "'Bruh' during a serious talk is a critical miss.",
    possibleActualMeaning:
      "She wants adult tone for adult topics.",
    riskLevel: "high",
    lowestRiskReply: "Fair. No bruh. I'm listening properly.",
    tinyWholesomeNudge: "Match her seriousness level.",
    category: "texting",
  },
  {
    pattern: "dont 'bruh' me",
    headline: "🚫 Emote Banned",
    comicTranslation:
      "'Bruh' during a serious talk is a critical miss.",
    possibleActualMeaning:
      "She wants adult tone for adult topics.",
    riskLevel: "high",
    lowestRiskReply: "Fair. No bruh. I'm listening properly.",
    tinyWholesomeNudge: "Match her seriousness level.",
    category: "texting",
  },
  {
    pattern: "don't bruh me",
    headline: "🚫 Emote Banned",
    comicTranslation:
      "'Bruh' during a serious talk is a critical miss.",
    possibleActualMeaning:
      "She wants adult tone for adult topics.",
    riskLevel: "high",
    lowestRiskReply: "Fair. No bruh. I'm listening properly.",
    tinyWholesomeNudge: "Match her seriousness level.",
    category: "texting",
  },
  {
    pattern: "dont bruh me",
    headline: "🚫 Emote Banned",
    comicTranslation:
      "'Bruh' during a serious talk is a critical miss.",
    possibleActualMeaning:
      "She wants adult tone for adult topics.",
    riskLevel: "high",
    lowestRiskReply: "Fair. No bruh. I'm listening properly.",
    tinyWholesomeNudge: "Match her seriousness level.",
    category: "texting",
  },
  {
    pattern: "dismissing me",
    headline: "📴 Heard. Ignored.",
    comicTranslation:
      "She felt brushed off. Invalidation deals bonus damage.",
    possibleActualMeaning:
      "She needs acknowledgment before problem-solving.",
    riskLevel: "high",
    lowestRiskReply: "I wasn't trying to dismiss you. Say it again — I'm here.",
    tinyWholesomeNudge: "Reflect first. Fix second.",
    category: "relationship",
  },
  {
    pattern: "how you talk to me",
    headline: "🎙️ Respect Missing",
    comicTranslation:
      "Respect is the missing gear. Upgrade tone.",
    possibleActualMeaning:
      "She cares about relational dignity in speech.",
    riskLevel: "high",
    lowestRiskReply: "You're right. I can talk to you better.",
    tinyWholesomeNudge: "Same love, better delivery.",
    category: "relationship",
  },
  {
    pattern: "whatever you want",
    headline: "🪤 Trap Armed",
    comicTranslation:
      "Dialogue options currently have high emotional damage risk.",
    spicyComicTranslation:
      "Choose carefully. 'Whatever' is not free will.",
    possibleActualMeaning:
      "She may want you to pick the caring option without being told.",
    riskLevel: "high",
    lowestRiskReply: "I want what keeps us good — what would feel best to you?",
    tinyWholesomeNudge: "Pause, feed party, retry later if spicy.",
    category: "relationship",
  },
  {
    pattern: "like we discussed",
    headline: "📝 You Forgot. Again.",
    comicTranslation:
      "Prior discussion in the log. Follow-through missing.",
    possibleActualMeaning:
      "She already covered this and expected action.",
    riskLevel: "high",
    lowestRiskReply: "You're right — I dropped it. Ordering now.",
    tinyWholesomeNudge: "Do the thing before the speech.",
    category: "classic",
  },
  {
    pattern: "want a partner",
    headline: "🤝 Partner ≠ Project",
    comicTranslation:
      "She doesn't want to be your project manager. Co-op required.",
    possibleActualMeaning:
      "She wants shared initiative, not task assignment.",
    riskLevel: "high",
    lowestRiskReply: "I hear you. I'll own X without being asked.",
    tinyWholesomeNudge: "Pick one recurring chore. Autopilot it.",
    category: "relationship",
  },
  {
    pattern: "running our whole life",
    headline: "🗂️ Unpaid Ops Lead",
    comicTranslation:
      "She is running life ops solo. Burnout incoming.",
    possibleActualMeaning:
      "Mental load is uneven and she's naming it.",
    riskLevel: "high",
    lowestRiskReply: "That's not fair on you. I'll take planning for Saturday.",
    tinyWholesomeNudge: "Take a whole domain, not a tiny task.",
    category: "relationship",
  },
  {
    pattern: "always the one",
    headline: "📦 Mental Load Alert",
    comicTranslation:
      "She always carries the logistics bag. Share the inventory.",
    possibleActualMeaning:
      "Uneven planning labour is the real fight.",
    riskLevel: "high",
    lowestRiskReply: "You're right. I'll handle the next three plans.",
    tinyWholesomeNudge: "Equal effort > equal speeches.",
    category: "relationship",
  },
  {
    pattern: "making the reservation",
    headline: "📅 Solo Planner Arc",
    comicTranslation:
      "She plans. You exist. That raid composition is bad.",
    possibleActualMeaning:
      "She wants shared booking labour.",
    riskLevel: "medium",
    lowestRiskReply: "I'll book it tonight and send the confirm.",
    tinyWholesomeNudge: "Send the screenshot. Trust XP up.",
    category: "plans",
  },
  {
    pattern: "do it alone",
    headline: "🧍 Team of One",
    comicTranslation:
      "Competence is not consent to solo forever.",
    possibleActualMeaning:
      "She wants help even if she's good at it.",
    riskLevel: "medium",
    lowestRiskReply: "You shouldn't have to. I'll take the next one.",
    tinyWholesomeNudge: "Volunteer before she assigns.",
    category: "relationship",
  },
  {
    pattern: "manage you",
    headline: "👩‍💼 Not Your Manager",
    comicTranslation:
      "She resigns as your life ops manager. Promote yourself.",
    possibleActualMeaning:
      "She wants initiative without supervision.",
    riskLevel: "high",
    lowestRiskReply: "Fair. I'll track it myself — calendar set.",
    tinyWholesomeNudge: "Systems > reminders from her.",
    category: "relationship",
  },
  {
    pattern: "birthday gift",
    headline: "🎁 Forgot Again",
    comicTranslation:
      "Gift quest incomplete. Amnesia is not a cute build.",
    possibleActualMeaning:
      "Remembering without reminders is the love language here.",
    riskLevel: "high",
    lowestRiskReply: "On it today. No excuses.",
    tinyWholesomeNudge: "Set two phone alarms. Now.",
    category: "classic",
  },
  {
    pattern: "there is no time",
    headline: "⏰ Deadline Passed",
    comicTranslation:
      "Timer hit zero. 'Later' expired.",
    possibleActualMeaning:
      "Urgency is real; stalling made it worse.",
    riskLevel: "high",
    lowestRiskReply: "You're right. Handling it in the next hour.",
    tinyWholesomeNudge: "Move now. Narrate less.",
    category: "plans",
  },
  {
    pattern: "three times",
    headline: "3️⃣ Reminder Cap Hit",
    comicTranslation:
      "She already reminded you. Check the texts like a quest log.",
    possibleActualMeaning:
      "The reminder defence will not work.",
    riskLevel: "high",
    lowestRiskReply: "You're right. I see the texts. My bad.",
    tinyWholesomeNudge: "Own the miss. Fix forward.",
    category: "classic",
  },
  {
    pattern: "check your texts",
    headline: "📬 Open the Log",
    comicTranslation:
      "Read. Them. The clues are already in chat.",
    possibleActualMeaning:
      "Evidence exists; looking is the quest.",
    riskLevel: "medium",
    lowestRiskReply: "Checking now — found them. Sorry.",
    tinyWholesomeNudge: "Read before defending.",
    category: "texting",
  },
  {
    pattern: "relationship calendar",
    headline: "📆 She Is the Calendar",
    comicTranslation:
      "She is HR + ops + calendar of the relationship. Unsustainable build.",
    possibleActualMeaning:
      "She wants shared memory systems.",
    riskLevel: "high",
    lowestRiskReply: "I'll own birthdays + plans in my phone from now.",
    tinyWholesomeNudge: "Take a whole category. Autopilot it.",
    category: "relationship",
  },
  {
    pattern: "bare minimum",
    headline: "🥉 Participation Trophy",
    comicTranslation:
      "Showing up is the floor, not the flex.",
    possibleActualMeaning:
      "She wants effort above the minimum.",
    riskLevel: "medium",
    lowestRiskReply: "You're right. I'll aim higher than showing up.",
    tinyWholesomeNudge: "Ask what 'above minimum' looks like once.",
    category: "relationship",
  },
  {
    pattern: "equal effort",
    headline: "⚖️ 50/50 Quest",
    comicTranslation:
      "Equal effort. Not you assigning chores to a reluctant NPC.",
    spicyComicTranslation:
      "50/50 or the party disbands. Choose.",
    possibleActualMeaning:
      "She wants shared labour without managing you.",
    riskLevel: "high",
    lowestRiskReply: "Deal. I'll take dinner + booking this week.",
    tinyWholesomeNudge: "Equal effort. Now.",
    category: "relationship",
  },
  {
    pattern: "don't promise",
    headline: "🚫 Vow Ban",
    comicTranslation:
      "Do. Don't vow. Actions only mode.",
    possibleActualMeaning:
      "Promises without delivery have lost value.",
    riskLevel: "medium",
    lowestRiskReply: "No promise — doing it tonight.",
    tinyWholesomeNudge: "Quiet competence is hot.",
    category: "classic",
  },
  {
    pattern: "dont promise",
    headline: "🚫 Vow Ban",
    comicTranslation:
      "Do. Don't vow. Actions only mode.",
    possibleActualMeaning:
      "Promises without delivery have lost value.",
    riskLevel: "medium",
    lowestRiskReply: "No promise — doing it tonight.",
    tinyWholesomeNudge: "Quiet competence is hot.",
    category: "classic",
  },
  {
    pattern: "just do it",
    headline: "✅ Execute",
    comicTranslation:
      "Nike, but serious. Less talk. More done.",
    possibleActualMeaning:
      "She is done negotiating intent.",
    riskLevel: "medium",
    lowestRiskReply: "On it.",
    tinyWholesomeNudge: "Then actually do it.",
    category: "classic",
  },
  {
    pattern: "my parents",
    headline: "👪 Family Side Quest",
    comicTranslation:
      "Family meetup unlocked. Showing up signals seriousness.",
    possibleActualMeaning:
      "This is a commitment signal for her.",
    riskLevel: "high",
    lowestRiskReply: "I can do an hour. Help me with exit timing?",
    tinyWholesomeNudge: "One hour > perfect vibes forever.",
    category: "relationship",
  },
  {
    pattern: "my mom keeps asking",
    headline: "📞 Mum Pressure Buff",
    comicTranslation:
      "Mum is on cooldown spam. Your stalling is now public lore.",
    possibleActualMeaning:
      "Delay is creating social awkwardness for her.",
    riskLevel: "medium",
    lowestRiskReply: "Tell her Sunday works — I'll be there.",
    tinyWholesomeNudge: "Clear yes reduces everyone's stress.",
    category: "relationship",
  },
  {
    pattern: "doomscroll",
    headline: "📵 Table ≠ Timeline",
    comicTranslation:
      "Doomscrolling at family lunch is a reputation wipe.",
    possibleActualMeaning:
      "She wants you present with her people.",
    riskLevel: "medium",
    lowestRiskReply: "Phone stays away. I'm in.",
    tinyWholesomeNudge: "Be boringly present. It wins.",
    category: "relationship",
  },
  {
    pattern: "for a month",
    headline: "📉 Chronic Stall Pattern",
    comicTranslation:
      "A month of maybes is a pattern, not a calendar conflict.",
    possibleActualMeaning:
      "She sees avoidance, not busyness.",
    riskLevel: "high",
    lowestRiskReply: "You're right. I've stalled. Sunday I'm there.",
    tinyWholesomeNudge: "Break the streak with one yes.",
    category: "plans",
  },
  {
    pattern: "lasagna",
    headline: "🍝 Not a Deposition",
    comicTranslation:
      "It's lunch. Not a courtroom. Come eat.",
    possibleActualMeaning:
      "She's lowering the stakes so you'll show up.",
    riskLevel: "low",
    lowestRiskReply: "Okay. Lasagna it is. I'll come.",
    tinyWholesomeNudge: "Accept the soft landing.",
    category: "plans",
  },
  {
    pattern: "not serious",
    headline: "💍 Commitment Check",
    comicTranslation:
      "Avoiding family looks like soft-launch failure to her.",
    possibleActualMeaning:
      "She equates presence with seriousness.",
    riskLevel: "high",
    lowestRiskReply: "I am serious. I'll show it Sunday.",
    tinyWholesomeNudge: "One visible action beats ten claims.",
    category: "relationship",
  },
  {
    pattern: "that's all i'm asking",
    headline: "🎯 Low Bar. Hop.",
    comicTranslation:
      "The ask is small on purpose. Clear it.",
    possibleActualMeaning:
      "She's negotiating down to something doable.",
    riskLevel: "medium",
    lowestRiskReply: "One hour. Done. Thank you for making it easy.",
    tinyWholesomeNudge: "Take the easy win.",
    category: "relationship",
  },
  {
    pattern: "thats all im asking",
    headline: "🎯 Low Bar. Hop.",
    comicTranslation:
      "The ask is small on purpose. Clear it.",
    possibleActualMeaning:
      "She's negotiating down to something doable.",
    riskLevel: "medium",
    lowestRiskReply: "One hour. Done. Thank you for making it easy.",
    tinyWholesomeNudge: "Take the easy win.",
    category: "relationship",
  },
  {
    pattern: "maybe means no",
    headline: "🔀 Translate: No",
    comicTranslation:
      "She translated your maybe into no. Accuracy high.",
    spicyComicTranslation:
      "Cowardice detected. Just say the real answer.",
    possibleActualMeaning:
      "She wants a clean no over a foggy maybe.",
    riskLevel: "medium",
    lowestRiskReply: "You're right — I was stalling. Real answer: I can do Sunday hour.",
    tinyWholesomeNudge: "Clean answers build trust.",
    category: "classic",
  },
  {
    pattern: "your stalling",
    headline: "🐢 Stall = Soft No",
    comicTranslation:
      "Stalling reads as no. Clock's ticking on trust.",
    possibleActualMeaning:
      "Delay is communicating rejection.",
    riskLevel: "medium",
    lowestRiskReply: "No more stalling. Here's my answer:",
    tinyWholesomeNudge: "Decide. Then text.",
    category: "classic",
  },
  {
    pattern: "fantasy football",
    headline: "🏈 Read the Room",
    comicTranslation:
      "Unprompted fantasy football takes at parents' table = social critical miss.",
    possibleActualMeaning:
      "She wants you socially calibrated.",
    riskLevel: "low",
    lowestRiskReply: "Lol noted. Sports talk only if asked.",
    tinyWholesomeNudge: "Follow her lead in new rooms.",
    category: "classic",
  },
  {
    pattern: "planning alone",
    headline: "🧳 Solo Logistics Again",
    comicTranslation:
      "She doesn't want to be travel ops + bank. Co-op the trip.",
    possibleActualMeaning:
      "Shared planning is the intimacy test.",
    riskLevel: "high",
    lowestRiskReply: "I'll take flights. You pick hotel vibes?",
    tinyWholesomeNudge: "Split domains. Send receipts.",
    category: "plans",
  },
  {
    pattern: "flights i sent",
    headline: "✈️ Open the Link",
    comicTranslation:
      "Links were sent. Looking is the quest. Booking is the boss.",
    possibleActualMeaning:
      "She already did research labour.",
    riskLevel: "medium",
    lowestRiskReply: "Opening now — reply in 20 with a pick.",
    tinyWholesomeNudge: "Respond to links same day.",
    category: "plans",
  },
  {
    pattern: "prices go up",
    headline: "📈 Delay Tax",
    comicTranslation:
      "Waiting is paying a stupidity tax. Book or cancel cleanly.",
    possibleActualMeaning:
      "Urgency is financial and emotional.",
    riskLevel: "medium",
    lowestRiskReply: "You're right. Booking the cheaper one tonight.",
    tinyWholesomeNudge: "Decide in 24h max.",
    category: "plans",
  },
  {
    pattern: "deciding' for",
    headline: "⏳ Decide Already",
    comicTranslation:
      "Three weeks of deciding is not deciding. Commit or cancel.",
    possibleActualMeaning:
      "Indecision is draining her.",
    riskLevel: "medium",
    lowestRiskReply: "Decision: yes, that weekend. I'll book.",
    tinyWholesomeNudge: "Binary choice. Pick one.",
    category: "plans",
  },
  {
    pattern: "if you wanted to",
    headline: "🗺️ No Quest Marker",
    comicTranslation:
      "The game expects you to remember previous lore.",
    spicyComicTranslation:
      "If you wanted to, you'd have done it. That's her theory.",
    possibleActualMeaning:
      "She wants the action to feel self-motivated, not instructed.",
    riskLevel: "high",
    lowestRiskReply:
      "I might be missing it, but I do care. Can you give me one clue?",
    tinyWholesomeNudge:
      "Asking for a clue is better than guessing badly.",
    category: "relationship",
  },
  {
    pattern: "leaving me on read",
    headline: "👀 Seen. Ignored.",
    comicTranslation:
      "Read receipt crime. Silence after seen hits hard.",
    spicyComicTranslation:
      "Seen ≠ safe. Reply with something human.",
    possibleActualMeaning:
      "She felt dismissed by the non-reply.",
    riskLevel: "high",
    lowestRiskReply: "Sorry I left you on read — money's tight, still want the trip smaller.",
    tinyWholesomeNudge: "Even a holding text counts.",
    category: "texting",
  },
  {
    pattern: "on read",
    headline: "👀 Seen. Ignored.",
    comicTranslation:
      "Read receipt crime. Silence after seen hits hard.",
    possibleActualMeaning:
      "She felt dismissed by the non-reply.",
    riskLevel: "high",
    lowestRiskReply: "Sorry — saw it and froze. Here's where I'm at:",
    tinyWholesomeNudge: "Reply imperfectly > perfect silence.",
    category: "texting",
  },
  {
    pattern: "hold on and then vanish",
    headline: "👻 Ghost Protocol",
    comicTranslation:
      "Hold on → vanish is a known glitch. She has the patch notes memorised.",
    possibleActualMeaning:
      "She expects follow-through after 'hold on'.",
    riskLevel: "medium",
    lowestRiskReply: "Sorry — back. Here's the answer:",
    tinyWholesomeNudge: "If you say hold on, set a 10-min timer.",
    category: "texting",
  },
  {
    pattern: "you ignored both",
    headline: "2️⃣ Two Strikes",
    comicTranslation:
      "Two options ignored. Willful neglect reading unlocked.",
    possibleActualMeaning:
      "She did the choosing labour already.",
    riskLevel: "high",
    lowestRiskReply: "You're right. Picking option A and booking.",
    tinyWholesomeNudge: "Choose one. Ship it.",
    category: "plans",
  },
  {
    pattern: "travel agent",
    headline: "🧳 Not Your Concierge",
    comicTranslation:
      "She resigns as travel agent and bank. Co-op or cancel.",
    possibleActualMeaning:
      "Uneven trip labour is the fight under the fight.",
    riskLevel: "high",
    lowestRiskReply: "I'll book + pay my half tonight.",
    tinyWholesomeNudge: "Take money + clicks off her plate.",
    category: "plans",
  },
  {
    pattern: "don't worry about it",
    headline: "🚨 Worry.",
    comicTranslation:
      "Don't worry = please worry. Reverse psychology side quest.",
    spicyComicTranslation:
      "PANIC lightly. Then ask one kind question.",
    possibleActualMeaning:
      "She may be hurt and testing whether you'll pursue.",
    riskLevel: "high",
    lowestRiskReply: "I am a bit worried — can we talk for a minute?",
    tinyWholesomeNudge: "Gentle pursue > literal obedience.",
    category: "relationship",
  },
  {
    pattern: "dont worry about it",
    headline: "🚨 Worry.",
    comicTranslation:
      "Don't worry = please worry. Reverse psychology side quest.",
    possibleActualMeaning:
      "She may be hurt and testing whether you'll pursue.",
    riskLevel: "high",
    lowestRiskReply: "I am a bit worried — can we talk for a minute?",
    tinyWholesomeNudge: "Gentle pursue > literal obedience.",
    category: "relationship",
  },
  {
    pattern: "i'll handle it. again",
    headline: "😤 Resentment Loading",
    comicTranslation:
      "She'll handle it again. Resentment XP is stacking.",
    spicyComicTranslation:
      "Martyr mode. Interrupt with real help.",
    possibleActualMeaning:
      "She's tired of defaulting to doing it alone.",
    riskLevel: "high",
    lowestRiskReply: "No — I've got this one. Sending confirm in 10.",
    tinyWholesomeNudge: "Steal the task back kindly.",
    category: "relationship",
  },
  {
    pattern: "ill handle it. again",
    headline: "😤 Resentment Loading",
    comicTranslation:
      "She'll handle it again. Resentment XP is stacking.",
    possibleActualMeaning:
      "She's tired of defaulting to doing it alone.",
    riskLevel: "high",
    lowestRiskReply: "No — I've got this one. Sending confirm in 10.",
    tinyWholesomeNudge: "Steal the task back kindly.",
    category: "relationship",
  },
  {
    pattern: "per my last text",
    headline: "📨 Read It. Again.",
    comicTranslation:
      "Corporate-polite rage. The answer is in the previous message.",
    possibleActualMeaning:
      "She already gave clear instructions.",
    riskLevel: "high",
    lowestRiskReply: "Got it — confirming Friday 6pm flights.",
    tinyWholesomeNudge: "Reply to the exact ask.",
    category: "texting",
  },
  {
    pattern: "per my last email",
    headline: "📨 Read It.",
    comicTranslation:
      "Corporate-polite rage. Open the thread.",
    spicyComicTranslation:
      "Illiterate arc cancelled. Read the thing.",
    possibleActualMeaning:
      "She already stated the point clearly.",
    riskLevel: "medium",
    lowestRiskReply: "Read it — you're right. Doing X.",
    tinyWholesomeNudge: "Acknowledge the prior message first.",
    category: "texting",
  },
  {
    pattern: "don't flake",
    headline: "🛡️ Show Up",
    comicTranslation:
      "Anti-flake request. Trust bar is low. Fill it.",
    spicyComicTranslation:
      "Show up or the arc changes.",
    possibleActualMeaning:
      "She needs reliability more than charm.",
    riskLevel: "high",
    lowestRiskReply: "I won't. Calendar locked. See you there.",
    tinyWholesomeNudge: "Reliability is the romance patch.",
    category: "plans",
  },
  {
    pattern: "dont flake",
    headline: "🛡️ Show Up",
    comicTranslation:
      "Anti-flake request. Trust bar is low. Fill it.",
    possibleActualMeaning:
      "She needs reliability more than charm.",
    riskLevel: "high",
    lowestRiskReply: "I won't. Calendar locked. See you there.",
    tinyWholesomeNudge: "Reliability is the romance patch.",
    category: "plans",
  },
  {
    pattern: "you should know",
    headline: "🗺️ No Quest Marker",
    comicTranslation:
      "Objective marker unavailable. Check recent events.",
    spicyComicTranslation:
      "Clueless debuff active. Ask for one clue.",
    possibleActualMeaning:
      "She wants the action to feel self-motivated, not instructed.",
    riskLevel: "high",
    lowestRiskReply:
      "I might be missing it, but I do care. Can you give me one clue?",
    tinyWholesomeNudge:
      "Asking for a clue is better than guessing badly.",
    category: "relationship",
  },
  {
    pattern: "i'll be ready soon",
    headline: "⏳ Not Ready",
    comicTranslation:
      "Soon is a vibe. She may still be in bed lore.",
    possibleActualMeaning:
      "ETA is optimistic.",
    riskLevel: "low",
    lowestRiskReply: "All good — text when you're heading down.",
    tinyWholesomeNudge: "Don't hover. Sip water.",
    category: "plans",
  },
  {
    pattern: "ill be ready soon",
    headline: "⏳ Not Ready",
    comicTranslation:
      "Soon is a vibe. She may still be in bed lore.",
    possibleActualMeaning:
      "ETA is optimistic.",
    riskLevel: "low",
    lowestRiskReply: "All good — text when you're heading down.",
    tinyWholesomeNudge: "Don't hover. Sip water.",
    category: "plans",
  },
  {
    pattern: "five minutes",
    headline: "🕔 One Hour Energy",
    comicTranslation:
      "Five minutes may mean one hour. Pack patience snacks.",
    spicyComicTranslation:
      "Never is also on the table. Bring a charger.",
    possibleActualMeaning:
      "Time estimates are aspirational.",
    riskLevel: "low",
    lowestRiskReply: "Take your time — I'll grab a coffee.",
    tinyWholesomeNudge: "Food may solve 40% of this plot.",
    category: "plans",
  },
  {
    pattern: "do whatever you want",
    headline: "🪤 Trap.",
    comicTranslation:
      "Dialogue options currently have high emotional damage risk.",
    spicyComicTranslation:
      "Choose death carefully. Or ask the real preference.",
    possibleActualMeaning:
      "There is a preferred answer she won't spell out yet.",
    riskLevel: "high",
    lowestRiskReply: "I want us okay — what would feel best?",
    tinyWholesomeNudge: "Pause before picking the spicy option.",
    category: "relationship",
  },
  {
    pattern: "i'm fine",
    headline: "🎮 Main Quest Not Complete",
    comicTranslation:
      "NPC dialogue has ended. Main story has not.",
    spicyComicTranslation:
      "The door is closed, but the boss music is still playing.",
    possibleActualMeaning:
      "She may not want solutions yet. She may want you to notice she is upset.",
    riskLevel: "medium",
    lowestRiskReply: "Okay, I'm here. Want to talk now or later?",
    tinyWholesomeNudge: "Do not optimise. Be present.",
    category: "emotions",
  },
  {
    pattern: "im fine",
    headline: "🎮 Main Quest Not Complete",
    comicTranslation:
      "NPC dialogue has ended. Main story has not.",
    possibleActualMeaning:
      "She may not want solutions yet. She may want you to notice she is upset.",
    riskLevel: "medium",
    lowestRiskReply: "Okay, I'm here. Want to talk now or later?",
    tinyWholesomeNudge: "Do not optimise. Be present.",
    category: "emotions",
  },
  {
    pattern: "it's fine",
    headline: "⚠️ Probably Not Fine",
    comicTranslation:
      "Fine is often a decoy item. Treat as unresolved until proven.",
    spicyComicTranslation:
      "Lawyer-up energy optional. Listening mandatory.",
    possibleActualMeaning:
      "She may be shutting down while still upset.",
    riskLevel: "medium",
    lowestRiskReply: "If it's not fine, I'm here without fixing.",
    tinyWholesomeNudge: "Stay nearby. Ask again later.",
    category: "emotions",
  },
  {
    pattern: "its fine",
    headline: "⚠️ Probably Not Fine",
    comicTranslation:
      "Fine is often a decoy item. Treat as unresolved until proven.",
    possibleActualMeaning:
      "She may be shutting down while still upset.",
    riskLevel: "medium",
    lowestRiskReply: "If it's not fine, I'm here without fixing.",
    tinyWholesomeNudge: "Stay nearby. Ask again later.",
    category: "emotions",
  },
  {
    pattern: "i don't care",
    headline: "❤️ She Cares",
    comicTranslation:
      "She cares. Indifference is a smoke bomb.",
    possibleActualMeaning:
      "Protective shutdown, not true apathy.",
    riskLevel: "medium",
    lowestRiskReply: "I think you do care. I'm here when you're ready.",
    tinyWholesomeNudge: "Don't argue the smoke. Wait for clear air.",
    category: "emotions",
  },
  {
    pattern: "i dont care",
    headline: "❤️ She Cares",
    comicTranslation:
      "She cares. Indifference is a smoke bomb.",
    possibleActualMeaning:
      "Protective shutdown, not true apathy.",
    riskLevel: "medium",
    lowestRiskReply: "I think you do care. I'm here when you're ready.",
    tinyWholesomeNudge: "Don't argue the smoke. Wait for clear air.",
    category: "emotions",
  },
  {
    pattern: "i'm tired",
    headline: "😴 Tired Of…?",
    comicTranslation:
      "Tired may mean sleepy. Tired may mean tired of the pattern.",
    spicyComicTranslation:
      "Of you (maybe). Check context before panicking.",
    possibleActualMeaning:
      "Could be literal fatigue or relational fatigue.",
    riskLevel: "medium",
    lowestRiskReply: "Rest. Want quiet company or alone time?",
    tinyWholesomeNudge: "Food may solve 40% of this plot.",
    category: "emotions",
  },
  {
    pattern: "im tired",
    headline: "😴 Tired Of…?",
    comicTranslation:
      "Tired may mean sleepy. Tired may mean tired of the pattern.",
    possibleActualMeaning:
      "Could be literal fatigue or relational fatigue.",
    riskLevel: "medium",
    lowestRiskReply: "Rest. Want quiet company or alone time?",
    tinyWholesomeNudge: "Food may solve 40% of this plot.",
    category: "emotions",
  },
  {
    pattern: "go ahead",
    headline: "🪤 Trap Emote",
    comicTranslation:
      "Go ahead may mean test failed. Proceed carefully.",
    spicyComicTranslation:
      "Not permission. Soft trap.",
    possibleActualMeaning:
      "She may be hurt and withdrawing consent vibes.",
    riskLevel: "high",
    lowestRiskReply: "I'd rather us be good than 'go ahead'. Talk?",
    tinyWholesomeNudge: "Don't take the bait option.",
    category: "relationship",
  },
  {
    pattern: "nothing",
    headline: "🕵️ Hidden Mission Unlocked",
    comicTranslation:
      "Hidden mission unlocked. This is probably not about the literal thing.",
    spicyComicTranslation:
      "EVERYTHING. Do not start solving yet. Listen first.",
    possibleActualMeaning:
      "Something is up; she may not want a fix yet.",
    riskLevel: "high",
    lowestRiskReply: "Okay. I'm here when you want to say more.",
    tinyWholesomeNudge: "Do not start solving yet. Listen first.",
    category: "emotions",
  },
  {
    pattern: "sorry",
    headline: "🛋️ Not Forgiven (Yet)",
    comicTranslation:
      "Apology received. Forgiveness still loading.",
    spicyComicTranslation:
      "Couch energy possible. Give it time.",
    possibleActualMeaning:
      "She heard you; repair may need more than one word.",
    riskLevel: "medium",
    lowestRiskReply: "I understand. What would help you feel better?",
    tinyWholesomeNudge: "Patience is part of the apology.",
    category: "apology",
  },
  {
    pattern: "maybe",
    headline: "🚫 Soft No",
    comicTranslation:
      "Maybe often means no with manners.",
    spicyComicTranslation:
      "Absolutely not, wearing a hat.",
    possibleActualMeaning:
      "She is declining without a hard confrontation.",
    riskLevel: "low",
    lowestRiskReply: "Got it — maybe next time. No pressure.",
    tinyWholesomeNudge: "Accept the maybe as a boundary.",
    category: "plans",
  },
  {
    pattern: "sure",
    headline: "😐 Sure (No)",
    comicTranslation:
      "Sure may mean no. Check the weather around it.",
    spicyComicTranslation:
      "Hard no in a polite skin.",
    possibleActualMeaning:
      "Compliance without enthusiasm — dig gently if needed.",
    riskLevel: "medium",
    lowestRiskReply: "If that's a no, it's okay — tell me straight?",
    tinyWholesomeNudge: "One clarifying question max.",
    category: "texting",
  },
  {
    pattern: "okay",
    headline: "😐 Not Okay",
    comicTranslation:
      "Okay may mean not okay. Boss music optional.",
    spicyComicTranslation:
      "We're done energy possible. Soften your next move.",
    possibleActualMeaning:
      "She may be shutting the thread while still upset.",
    riskLevel: "medium",
    lowestRiskReply: "Okay. I'm here if it's not actually okay.",
    tinyWholesomeNudge: "Don't pile on. Leave an open door.",
    category: "texting",
  },
  {
    pattern: "whatever",
    headline: "⚠️ High Damage Dialogue",
    comicTranslation:
      "Dialogue options currently have high emotional damage risk.",
    spicyComicTranslation:
      "Pause, feed party, retry later.",
    possibleActualMeaning:
      "She is done arguing and still not fine.",
    riskLevel: "high",
    lowestRiskReply: "I'll pause. I care — we can try again after food.",
    tinyWholesomeNudge: "Pause, feed party, retry later.",
    category: "texting",
  },
  {
    pattern: "wow",
    headline: "😮 Disgust Emote",
    comicTranslation:
      "Wow = disappointment packed into three letters.",
    spicyComicTranslation:
      "Unmatched. Do not clap back.",
    possibleActualMeaning:
      "She is shocked or unimpressed.",
    riskLevel: "medium",
    lowestRiskReply: "Yeah… that wasn't great. Sorry.",
    tinyWholesomeNudge: "No sarcasm duel.",
    category: "texting",
  },
]
