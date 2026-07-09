import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

import { isAudioConfigured } from "../lib/server-env"
import {
  resolveAudioMediaType,
  transcribeAudioBuffer,
} from "../lib/transcribe-audio"

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

const assert = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(message)
  }
}

const runUnitChecks = () => {
  const wav = createTestWav()

  assert(
    resolveAudioMediaType(undefined, wav) === "audio/wav",
    "Expected WAV signature detection",
  )
  assert(
    resolveAudioMediaType("audio/webm;codecs=opus", wav) === "audio/wav",
    "Declared webm type should not override mismatched WAV bytes",
  )
  assert(
    resolveAudioMediaType("audio/webm", wav) === "audio/wav",
    "Declared webm type should fall back to detected WAV bytes",
  )

  console.log("✓ resolveAudioMediaType unit checks passed")
}

const runLiveWhisperCheck = async () => {
  if (!isAudioConfigured()) {
    console.log(
      "⊘ Skipping live Whisper check — set OPENAI_API_KEY to run end-to-end transcription",
    )
    return
  }

  const fixturePath = resolve("scripts/fixtures/grunt-sample.wav")
  let audio: Uint8Array

  try {
    audio = new Uint8Array(await readFile(fixturePath))
  } catch {
    audio = createTestWav()
    console.log(
      "ℹ No scripts/fixtures/grunt-sample.wav found — using generated silent WAV fixture",
    )
  }

  const transcript = await transcribeAudioBuffer(audio, "audio/wav")

  console.log("✓ Live Whisper transcription succeeded")
  console.log(`  text: ${transcript.text || "(empty)"}`)
  console.log(`  language: ${transcript.language ?? "unknown"}`)
  console.log(
    `  duration: ${transcript.durationInSeconds?.toFixed(2) ?? "unknown"}s`,
  )
}

const runRouteChecks = async () => {
  const previousKey = process.env.OPENAI_API_KEY
  delete process.env.OPENAI_API_KEY

  try {
    const { POST } = await import("../app/api/transcribe/route")
    const wav = createTestWav()
    const formData = new FormData()
    formData.append(
      "audio",
      new Blob([wav], { type: "audio/wav" }),
      "grunt.wav",
    )

    const response = await POST(
      new Request("http://localhost/api/transcribe", {
        method: "POST",
        body: formData,
      }),
    )

    const body = (await response.json()) as { error?: string }

    if (response.status !== 503) {
      throw new Error(
        `Expected 503 when OPENAI_API_KEY is missing, got ${response.status}`,
      )
    }

    if (!body.error?.includes("OPENAI_API_KEY")) {
      throw new Error("Expected a helpful missing API key error message")
    }

    console.log("✓ /api/transcribe returns 503 when OPENAI_API_KEY is missing")
  } finally {
    if (previousKey) {
      process.env.OPENAI_API_KEY = previousKey
    } else {
      delete process.env.OPENAI_API_KEY
    }
  }
}

const main = async () => {
  runUnitChecks()
  await runRouteChecks()
  await runLiveWhisperCheck()
}

main().catch((error) => {
  console.error("Whisper test failed:", error)
  process.exitCode = 1
})
