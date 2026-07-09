import { isAudioConfigured } from "../lib/server-env"
import { transcribeAudioBuffer } from "../lib/transcribe-audio"
import type { TranslatorGender } from "../lib/translator"

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

const requestSpeech = async (
  gender: TranslatorGender,
  text: string
): Promise<Uint8Array> => {
  const { POST } = await import("../app/api/speech/route")
  const response = await POST(
    new Request("http://localhost/api/speech", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gender, text }),
    })
  )

  if (!response.ok) {
    const body = (await response.json()) as { error?: string }
    throw new Error(body.error ?? `Speech route returned ${response.status}`)
  }

  if (!response.headers.get("content-type")?.startsWith("audio/")) {
    throw new Error("Speech route did not return audio")
  }

  const audio = new Uint8Array(await response.arrayBuffer())

  if (audio.byteLength === 0) {
    throw new Error("Speech route returned empty audio")
  }

  return audio
}

const runLiveVoiceCheck = async () => {
  if (!isAudioConfigured()) {
    console.log(
      "⊘ Skipping live voice check — set AI_GATEWAY_API_KEY to run it"
    )
    return
  }

  let maleAudio: Uint8Array | undefined

  for (const gender of ["male", "female"] as const) {
    const audio = await requestSpeech(
      gender,
      gender === "male"
        ? "Bro deployed the affirmative grunt."
        : "The group chat has entered forensic mode."
    )
    maleAudio ??= audio
    console.log(`✓ Live AI Gateway ${gender} speech generation succeeded`)
  }

  if (!maleAudio) {
    throw new Error("Male speech generation did not return audio")
  }

  const transcript = await transcribeAudioBuffer(maleAudio)

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
    const { POST: POSTSpeech } = await import("../app/api/speech/route")
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

    const speechResponse = await POSTSpeech(
      new Request("http://localhost/api/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "Test", gender: "female" }),
      })
    )

    if (speechResponse.status !== 503) {
      throw new Error(
        `Expected speech 503 without Gateway authentication, got ${speechResponse.status}`
      )
    }

    console.log("✓ /api/speech returns 503 without Gateway authentication")
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
