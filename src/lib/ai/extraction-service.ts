import {
  aiExtractionResponseSchema,
  type AIExtractionResponse,
} from "@/schemas/ai-extraction.schema";

import { gemini } from "@/lib/ai/gemini-client";
import {
  createHouseholdExtractionPrompt,
  HOUSEHOLD_EXTRACTION_SYSTEM_PROMPT,
} from "@/lib/ai/prompts";

const MODEL_NAME = "gemini-3.8-flash";
const MAX_ATTEMPTS = 3;

function getErrorStatus(error: unknown): number | null {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number"
  ) {
    return error.status;
  }

  const errorText = error instanceof Error ? error.message : String(error);
  const statusMatch = errorText.match(/"code"\s*:\s*(\d{3})/);

  return statusMatch ? Number(statusMatch[1]) : null;
}

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export async function extractHouseholdTasks(
  note: string,
  selectedCategory: string,
): Promise<AIExtractionResponse> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await gemini.models.generateContent({
        model: MODEL_NAME,
        contents: createHouseholdExtractionPrompt(note, selectedCategory),
        config: {
          systemInstruction: HOUSEHOLD_EXTRACTION_SYSTEM_PROMPT,
          responseMimeType: "application/json",
          temperature: 0.1,
          maxOutputTokens: 2500,
        },
      });

      const responseText = response.text;

      if (!responseText) {
        throw new Error("Gemini returned an empty response.");
      }

      let parsedResponse: unknown;

      try {
        parsedResponse = JSON.parse(responseText);
      } catch {
        throw new Error("Gemini returned invalid JSON.");
      }

      return aiExtractionResponseSchema.parse(parsedResponse);
    } catch (error) {
      lastError = error;

      const status = getErrorStatus(error);
      const isTemporaryFailure = status === 429 || status === 500 || status === 503;

      if (!isTemporaryFailure || attempt === MAX_ATTEMPTS) {
        break;
      }

      const delay = 1000 * 2 ** (attempt - 1);
      await wait(delay);
    }
  }

  const status = getErrorStatus(lastError);

  if (status === 503) {
    throw new Error(
      "Gemini is temporarily busy. Please wait a minute and try again.",
    );
  }

  if (status === 429) {
    throw new Error(
      "Gemini request limit reached. Please wait briefly before trying again.",
    );
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Unable to extract household tasks right now.");
}