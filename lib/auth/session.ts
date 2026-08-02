import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const NONCE_TTL_MS = 5 * 60 * 1000; // 5 minutes to complete the sign-in
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("Missing SESSION_SECRET in .env.local");
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

// ---- Sign-in nonce (proves the signature is fresh, not a replayed one) ----

export interface NonceToken {
  nonce: string;
  issuedAt: number;
  token: string; // opaque to the client — pass it back unchanged on verify
}

export function createNonce(): NonceToken {
  const nonce = randomBytes(16).toString("hex");
  const issuedAt = Date.now();
  const payload = `${nonce}.${issuedAt}`;
  const token = `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
  return { nonce, issuedAt, token };
}

export function verifyNonceToken(token: string, expectedNonce: string): boolean {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return false;

  const payload = Buffer.from(encodedPayload, "base64url").toString();
  if (!safeEqual(sign(payload), signature)) return false;

  const [nonce, issuedAtStr] = payload.split(".");
  if (nonce !== expectedNonce) return false;

  const issuedAt = Number(issuedAtStr);
  if (!issuedAt || Date.now() - issuedAt > NONCE_TTL_MS) return false;

  return true;
}

// ---- Session cookie (issued after a verified signature) ----

export interface Session {
  address: `0x${string}`;
  issuedAt: number;
}

export function createSessionCookie(address: `0x${string}`): string {
  const payload = JSON.stringify({ address, issuedAt: Date.now() });
  const encoded = Buffer.from(payload).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifySessionCookie(cookieValue: string | undefined): Session | null {
  if (!cookieValue) return null;

  const [encoded, signature] = cookieValue.split(".");
  if (!encoded || !signature) return null;
  if (!safeEqual(sign(encoded), signature)) return null;

  try {
    const session = JSON.parse(Buffer.from(encoded, "base64url").toString()) as Session;
    if (Date.now() - session.issuedAt > SESSION_TTL_MS) return null;
    return session;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = "ol_session";