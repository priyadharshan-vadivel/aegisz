import { createHmac, timingSafeEqual } from "node:crypto";

/*
 * Short-lived signed download token: "<expiry-ms>.<base64url HMAC-SHA256(expiry)>".
 * Issued by /api/lead after a valid submission; checked by /api/download.
 */

export const DOWNLOAD_TTL_MS = 10 * 60 * 1000;

const mac = (secret: string, payload: string) => createHmac("sha256", secret).update(payload).digest("base64url");

export function signDownloadToken(secret: string, now = Date.now(), ttlMs = DOWNLOAD_TTL_MS) {
  const exp = String(now + ttlMs);
  return `${exp}.${mac(secret, exp)}`;
}

export function verifyDownloadToken(token: string | null | undefined, secret: string, now = Date.now()) {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < now) return false;
  const expected = Buffer.from(mac(secret, exp));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
