import { GeminiClassifier } from "./providers/gemini";
import type { ContentClassifier } from "./types";

// Central place that decides which provider handles classification.
// Swapping providers, or routing different media types to different
// providers later, only ever touches this file — nothing else in the
// app needs to know which provider is actually running.
function getClassifier(): ContentClassifier {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    throw new Error("Missing GEMINI_API_KEY in .env.local");
  }
  return new GeminiClassifier(geminiKey);
}

export async function classifyContent(fileBuffer: Buffer, mimeType: string) {
  const classifier = getClassifier();
  return classifier.classify(fileBuffer, mimeType);
}