import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "Missing GEMINI_API_KEY. Add it to .env.local and restart the development server.",
  );
}

export const gemini = new GoogleGenAI({ apiKey });