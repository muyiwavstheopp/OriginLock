export type MediaKind = "image" | "audio" | "document" | "code" | "video" | "unknown";

export interface ClassificationResult {
  mediaKind: MediaKind;
  subtype: string;        // e.g. "photograph", "illustration", "PDF manuscript"
  description: string;    // short human-readable summary
  confidence: number;     // 0–1
}

export interface ContentClassifier {
  providerName: string;
  classify(fileBuffer: Buffer, mimeType: string): Promise<ClassificationResult>;
}