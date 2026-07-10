export type AudioCaptureBlockReason = "insecure-context" | "unsupported-browser"

export type AudioCaptureSupport = {
  isSupported: boolean
  blockReason: AudioCaptureBlockReason | null
  isSecureContext: boolean
  hasGetUserMedia: boolean
  hasMediaRecorder: boolean
}

const SSR_FALLBACK: AudioCaptureSupport = {
  isSupported: true,
  blockReason: null,
  isSecureContext: true,
  hasGetUserMedia: true,
  hasMediaRecorder: true,
}

export const getAudioCaptureSupport = (): AudioCaptureSupport => {
  if (typeof window === "undefined") {
    return SSR_FALLBACK
  }

  const isSecureContext = window.isSecureContext
  const hasGetUserMedia = Boolean(navigator.mediaDevices?.getUserMedia)
  const hasMediaRecorder = typeof MediaRecorder !== "undefined"

  if (!isSecureContext) {
    return {
      isSupported: false,
      blockReason: "insecure-context",
      isSecureContext,
      hasGetUserMedia,
      hasMediaRecorder,
    }
  }

  if (!hasGetUserMedia || !hasMediaRecorder) {
    return {
      isSupported: false,
      blockReason: "unsupported-browser",
      isSecureContext,
      hasGetUserMedia,
      hasMediaRecorder,
    }
  }

  return {
    isSupported: true,
    blockReason: null,
    isSecureContext,
    hasGetUserMedia,
    hasMediaRecorder,
  }
}

export const getSupportedAudioMimeType = () => {
  if (typeof MediaRecorder === "undefined") return ""

  const prefersAppleFormats = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const candidates = prefersAppleFormats
    ? ["audio/mp4", "audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus"]
    : [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/ogg;codecs=opus",
      ]

  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? ""
}

export const getSecureMicUrl = () => {
  if (typeof window === "undefined") return "https://<your-mac-ip>:3000"

  const { hostname, port, pathname, search, hash } = window.location
  const securePort = port || "3000"

  return `https://${hostname}:${securePort}${pathname}${search}${hash}`
}
