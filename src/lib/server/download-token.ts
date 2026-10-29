import { createHmac, timingSafeEqual } from "node:crypto";

/*
 * Signed download link token: "<expiry-ms>.<lead-ref>.<base64url HMAC-SHA256(expiry.ref)>".
 * Issued by /api/lead and emailed to the requester; checked by /api/download. The ref ties
 * each link back to its lead row.
 */

export const DOWNLOAD_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const REF = /^[A-Za-z0-9-]{1,40}$/;
const mac = (secret: string, payload: string) => createHmac("sha256", secret).update(payload).digest("base64url");

export function signDownloadToken(secret: string, ref: string, now = Date.now(), ttlMs = DOWNLOAD_TTL_MS) {
  if (!REF.test(ref)) throw new Error("invalid download ref");
  const payload = `${now + ttlMs}.${ref}`;
  return `${payload}.${mac(secret, payload)}`;
}

/** The lead ref if the token is genuine and unexpired, otherwise null. */
export function verifyDownloadToken(token: string | null | undefined, secret: string, now = Date.now()) {
  if (!token) return null;
  const [exp, ref, sig, ...rest] = token.split(".");
  if (rest.length || !exp || !ref || !sig || !/^\d+$/.test(exp) || !REF.test(ref) || Number(exp) < now) return null;
  const expected = Buffer.from(mac(secret, `${exp}.${ref}`));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given) ? ref : null;
}
