import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

const ALGORITHM = "aes-256-gcm";

export interface EncryptedPayload {
  ciphertext: Buffer;
  iv: string;        // hex
  authTag: string;   // hex
}

export function generateFileKey(): Buffer {
  return randomBytes(32); // AES-256 key
}

export function encryptBuffer(plaintext: Buffer, key: Buffer): EncryptedPayload {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, key as unknown as import("crypto").CipherKey, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return { ciphertext, iv: iv.toString("hex"), authTag: authTag.toString("hex") };
}

export function decryptBuffer(ciphertext: Buffer, key: Buffer, ivHex: string, authTagHex: string): Buffer {
  const decipher = createDecipheriv(ALGORITHM, key as unknown as import("crypto").CipherKey, Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

// Envelope encryption: wraps a per-file key with the server-wide master key,
// so the DB never stores a usable file key in the clear.
export function wrapFileKey(fileKey: Buffer): EncryptedPayload {
  const masterKeyHex = process.env.MASTER_ENCRYPTION_KEY;
  if (!masterKeyHex) throw new Error("Missing MASTER_ENCRYPTION_KEY in .env.local");
  return encryptBuffer(fileKey, Buffer.from(masterKeyHex, "hex"));
}

export function unwrapFileKey(encryptedKey: Buffer, ivHex: string, authTagHex: string): Buffer {
  const masterKeyHex = process.env.MASTER_ENCRYPTION_KEY;
  if (!masterKeyHex) throw new Error("Missing MASTER_ENCRYPTION_KEY in .env.local");
  return decryptBuffer(encryptedKey, Buffer.from(masterKeyHex, "hex"), ivHex, authTagHex);
}