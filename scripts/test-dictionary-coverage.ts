/**
 * Dictionary coverage runner against argument chat scripts.
 * Pure Node — no UI, no API, no AI Gateway.
 *
 * Usage:
 *   pnpm test:dictionary
 *   pnpm test:dictionary -- --verbose
 *   pnpm test:dictionary -- --misses-only
 */

import {
  ARGUMENT_SCRIPTS,
  allScriptLines,
} from "./fixtures/argument-scripts"
import {
  translateFemale,
  translateMale,
  type TranslationResult,
} from "../lib/translator"

const OPTIONS = { sarcasmLevel: 7, gruntMode: false } as const

type LineResult = {
  scriptId: string
  scriptTitle: string
  lineIndex: number
  speaker: "male" | "female"
  text: string
  result: TranslationResult
}

const args = new Set(process.argv.slice(2))
const verbose = args.has("--verbose")
const missesOnly = args.has("--misses-only")

const runLine = (
  line: ReturnType<typeof allScriptLines>[number]
): LineResult => {
  const result =
    line.speaker === "female"
      ? translateFemale(line.text, OPTIONS)
      : translateMale(line.text, OPTIONS)

  return {
    scriptId: line.scriptId,
    scriptTitle: line.scriptTitle,
    lineIndex: line.lineIndex,
    speaker: line.speaker,
    text: line.text,
    result,
  }
}

const formatLine = (row: LineResult): string => {
  const status = row.result.isFallback ? "MISS" : "HIT "
  const pattern = row.result.matchedPattern
    ? ` ← "${row.result.matchedPattern}"`
    : ""
  const comic = row.result.comicTranslation.replace(/\n/g, " ")
  return `[${status}] ${row.speaker.padEnd(6)} "${row.text}"${pattern}\n         ${row.result.headline}\n         → ${comic}\n         risk=${row.result.riskLevel} | reply: ${row.result.lowestRiskReply}`
}

const main = () => {
  const rows = allScriptLines().map(runLine)

  const hits = rows.filter((r) => !r.result.isFallback)
  const misses = rows.filter((r) => r.result.isFallback)
  const maleRows = rows.filter((r) => r.speaker === "male")
  const femaleRows = rows.filter((r) => r.speaker === "female")
  const maleHits = maleRows.filter((r) => !r.result.isFallback)
  const femaleHits = femaleRows.filter((r) => !r.result.isFallback)

  console.log("═══ Dictionary coverage vs argument scripts ═══\n")
  console.log(
    "Direction: male lines → male_to_female (astrology)\n          female lines → female_to_male (quests)\n"
  )

  for (const script of ARGUMENT_SCRIPTS) {
    const scriptRows = rows.filter((r) => r.scriptId === script.id)
    const scriptHits = scriptRows.filter((r) => !r.result.isFallback)
    const pct = Math.round((scriptHits.length / scriptRows.length) * 100)

    console.log(
      `▸ ${script.title} [${script.id}] — ${scriptHits.length}/${scriptRows.length} (${pct}%)`
    )

    for (const row of scriptRows) {
      if (missesOnly && !row.result.isFallback) continue
      if (!verbose && !missesOnly && !row.result.isFallback) continue
      console.log(formatLine(row))
    }

    if (!verbose && !missesOnly) {
      const missCount = scriptRows.length - scriptHits.length
      if (missCount === 0) {
        console.log("  ✓ full coverage")
      } else {
        console.log(
          `  … ${missCount} miss(es) — re-run with --verbose or --misses-only`
        )
      }
    }
    console.log()
  }

  const pct = (n: number, d: number) =>
    d === 0 ? "0%" : `${Math.round((n / d) * 100)}%`

  console.log("═══ Summary ═══")
  console.log(
    `Total:  ${hits.length}/${rows.length} hits (${pct(hits.length, rows.length)})`
  )
  console.log(
    `Male→♀: ${maleHits.length}/${maleRows.length} hits (${pct(maleHits.length, maleRows.length)})`
  )
  console.log(
    `Female→♂: ${femaleHits.length}/${femaleRows.length} hits (${pct(femaleHits.length, femaleRows.length)})`
  )

  // Voice sanity: male_to_female should not sound like gaming; female_to_male should not sound like astrology
  const maleVoiceViolations = maleHits.filter((r) => {
    const t = r.result.comicTranslation.toLowerCase()
    return (
      t.includes("dlc") ||
      t.includes("npc") ||
      t.includes("quest marker") ||
      t.includes("boss music") ||
      t.includes("xp ")
    )
  })
  const femaleVoiceViolations = femaleHits.filter((r) => {
    const t = r.result.comicTranslation.toLowerCase()
    return (
      t.includes("horoscope") ||
      t.includes("tarot") ||
      t.includes("constellation") ||
      t.includes("astrology")
    )
  })

  if (maleVoiceViolations.length > 0) {
    console.log("\n⚠ male→female voice leaks (gaming terms):")
    for (const row of maleVoiceViolations.slice(0, 8)) {
      console.log(`  - "${row.text}" → ${row.result.comicTranslation}`)
    }
  }
  if (femaleVoiceViolations.length > 0) {
    console.log("\n⚠ female→male voice leaks (astrology terms):")
    for (const row of femaleVoiceViolations.slice(0, 8)) {
      console.log(`  - "${row.text}" → ${row.result.comicTranslation}`)
    }
  }

  if (misses.length > 0) {
    console.log("\n═══ Misses to expand dictionary for ═══")
    for (const row of misses) {
      console.log(`- [${row.speaker}] (${row.scriptId}) "${row.text}"`)
    }
  }

  const overall = hits.length / rows.length
  if (overall < 0.7) {
    console.error(
      `\n✗ Coverage ${pct(hits.length, rows.length)} is below 70% floor`
    )
    process.exitCode = 1
    return
  }

  if (overall < 0.85) {
    console.log(
      `\n⚠ Coverage ${pct(hits.length, rows.length)} — expand dictionary toward 85%+`
    )
    return
  }

  console.log(`\n✓ Coverage ${pct(hits.length, rows.length)} looks solid`)
}

main()
