import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ContentClassifier, ClassificationResult, MediaKind } from "../types";

const VALID_KINDS: MediaKind[] = ["image", "audio", "document", "code", "video", "unknown"];

export class GeminiClassifier implements ContentClassifier {
  providerName = "gemini";
  private client: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async classify(fileBuffer: Buffer, mimeType: string): Promise<ClassificationResult> {
    const model = this.client.getGenerativeModel({ model: "gemini-3.5-flash-lite" });

    const prompt = `Classify this file. Respond ONLY with JSON, no markdown, no preamble, in exactly this shape:
{"mediaKind": "image" | "audio" | "document" | "code" | "video" | "unknown", "subtype": "short label, e.g. photograph, illustration, PDF manuscript, source code", "description": "one sentence description", "confidence": 0.0 to 1.0}`;

    const result = await model.generateContent([
      { inlineData: { data: fileBuffer.toString("base64"), mimeType } },
      { text: prompt },
    ]);

    const raw = result.response.text().trim();
    const cleaned = raw.replace(/^```json\s*|\s*```$/g, "");

    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error(`Gemini returned non-JSON response: ${raw.slice(0, 200)}`);
    }

    const mediaKind: MediaKind = VALID_KINDS.includes(parsed.mediaKind) ? parsed.mediaKind : "unknown";

    return {
      mediaKind,
      subtype: String(parsed.subtype ?? "unclassified"),
      description: String(parsed.description ?? ""),
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0,
    };
  }
}