import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

import { generateSpeech } from "ai"

import { getSpeechModel } from "../lib/ai"
import { getServerEnv, isAudioConfigured } from "../lib/server-env"
import { transcribeAudioBuffer } from "../lib/transcribe-audio"

const createTestWav = () => {
  const sampleRate = 16_000
  const durationSeconds = 1
  const numSamples = sampleRate * durationSeconds
  const dataSize = numSamples * 2
  const buffer = Buffer.alloc(44 + dataSize)

  buffer.write("RIFF", 0)
  buffer.writeUInt32LE(36 + dataSize, 4)
  buffer.write("WAVE", 8)
  buffer.write("fmt ", 12)
  buffer.writeUInt32LE(16, 16)
  buffer.writeUInt16LE(1, 20)
  buffer.writeUInt16LE(1, 22)
  buffer.writeUInt32LE(sampleRate, 24)
  buffer.writeUInt32LE(sampleRate * 2, 28)
  buffer.writeUInt16LE(2, 32)
  buffer.writeUInt16LE(16, 34)
  buffer.write("data", 36)
  buffer.writeUInt32LE(dataSize, 40)

  return new Uint8Array(buffer)
}

const runLiveVoiceCheck = async () => {
  if (!isAudioConfigured()) {
    console.log(
      "⊘ Skipping live voice check — set AI_GATEWAY_API_KEY to run it"
    )
    return
  }

  const fixturePath = resolve("scripts/fixtures/grunt-sample.wav")
  let audio: Uint8Array | undefined

  try {
    audio = new Uint8Array(await readFile(fixturePath))
  } catch {
    console.log("ℹ No voice fixture found — generating one through AI Gateway")
  }

  if (!audio) {
    const { AI_GATEWAY_SPEECH_VOICE } = getServerEnv()
    const speech = await generateSpeech({
      model: getSpeechModel(),
      text: "AI Gateway voice test.",
      voice: AI_GATEWAY_SPEECH_VOICE,
      outputFormat: "mp3",
      abortSignal: AbortSignal.timeout(30_000),
    })
    audio = speech.audio.uint8Array
    console.log("✓ Live AI Gateway speech generation succeeded")
  }

  const transcript = await transcribeAudioBuffer(audio)

  console.log("✓ Live AI Gateway transcription succeeded")
  console.log(`  text: ${transcript.text || "(empty)"}`)
  console.log(`  language: ${transcript.language ?? "unknown"}`)
  console.log(
    `  duration: ${transcript.durationInSeconds?.toFixed(2) ?? "unknown"}s`
  )
}

const runRouteChecks = async () => {
  const previousApiKey = process.env.AI_GATEWAY_API_KEY
  const previousOidcToken = process.env.VERCEL_OIDC_TOKEN
  delete process.env.AI_GATEWAY_API_KEY
  delete process.env.VERCEL_OIDC_TOKEN

  try {
    const { POST } = await import("../app/api/transcribe/route")
    const wav = createTestWav()
    const formData = new FormData()
    formData.append(
      "audio",
      new Blob([wav], { type: "audio/wav" }),
      "grunt.wav"
    )

    const response = await POST(
      new Request("http://localhost/api/transcribe", {
        method: "POST",
        body: formData,
      })
    )

    const body = (await response.json()) as { error?: string }

    if (response.status !== 503) {
      throw new Error(
        `Expected 503 when Gateway authentication is missing, got ${response.status}`
      )
    }

    if (!body.error?.includes("AI Gateway")) {
      throw new Error(
        "Expected a helpful missing Gateway authentication message"
      )
    }

    console.log("✓ /api/transcribe returns 503 without Gateway authentication")
  } finally {
    if (previousApiKey) {
      process.env.AI_GATEWAY_API_KEY = previousApiKey
    } else {
      delete process.env.AI_GATEWAY_API_KEY
    }

    if (previousOidcToken) {
      process.env.VERCEL_OIDC_TOKEN = previousOidcToken
    } else {
      delete process.env.VERCEL_OIDC_TOKEN
    }
  }
}

const main = async () => {
  await runRouteChecks()
  await runLiveVoiceCheck()
}

main().catch((error) => {
  console.error("AI Gateway audio test failed:", error)
  process.exitCode = 1
})
