import { NoOutputGeneratedError } from "ai"

/**
 * Reads structured output from generateText without throwing when the model
 * finishes without a parseable object (truncation, refusal, empty stream).
 */
export const readStructuredOutput = <T>(
  getOutput: () => T,
  context: string
): T | null => {
  try {
    return getOutput()
  } catch (error) {
    if (NoOutputGeneratedError.isInstance(error)) {
      console.warn(`${context}: model returned no structured output`)
      return null
    }

    throw error
  }
}
