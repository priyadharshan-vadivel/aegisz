import "server-only";
import { Resend } from "resend";
import type { Mail } from "./templates";
import { hashIp } from "./leads";

/* Environment-backed adapters for the API routes. See SETUP.md and .env.example. */

export function emailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  return apiKey && to && from ? { apiKey, to, from } : null;
}

export function resendSender(apiKey: string, from: string) {
  const resend = new Resend(apiKey);
  return async (m: Mail) => {
    const { error } = await resend.emails.send({
      from: `AegisZ <${from}>`,
      to: m.to,
      subject: m.subject,
      html: m.html,
      text: m.text,
      replyTo: m.replyTo,
    });
    if (error) throw new Error(`${error.name}: ${error.message}`);
  };
}

let warned = false;

/**
 * Cloudflare Turnstile check. If TURNSTILE_SECRET_KEY isn't set the check is skipped (with a
 * one-time warning), so forms work before Turnstile is configured. Set both keys in production.
 */
export async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean | string> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (!warned) console.warn("[forms] TURNSTILE_SECRET_KEY not set: skipping human verification");
    warned = true;
    return true;
  }
  if (!token) return "no token sent by the widget";
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const json = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (json.success === true) return true;
    const codes = json["error-codes"]?.join(", ") || "rejected";
    console.error("[forms] Turnstile rejected:", codes);
    return codes;
  } catch (err) {
    console.error("[forms] Turnstile verification error", err);
    return `siteverify request failed: ${err instanceof Error ? err.message : String(err)}`;
  }
}

/** Outside production, API errors carry the exact cause (`debug`) so failures aren't hidden. */
export const debugErrors = process.env.NODE_ENV !== "production";

/** Names (never values) of the given env vars that are empty. */
export const missingEnv = (...names: string[]) => names.filter((n) => !process.env[n]?.trim());

/** Secret for hashing client IPs before they're stored. Falls back to DOWNLOAD_SECRET. */
const ipHashSecret = () => process.env.IP_HASH_SECRET || process.env.DOWNLOAD_SECRET;

/** Absolute base URL for links in emails: SITE_URL, else the Vercel deployment URL, else aegisz.in. */
export function siteUrl() {
  const explicit = process.env.SITE_URL?.replace(/\/+$/, "");
  if (explicit) return explicit;
  if (process.env.VERCEL_ENV === "production") return "https://aegisz.in";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://aegisz.in";
}

export function clientMeta(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  return { ip, ipHash: hashIp(ip, ipHashSecret()), userAgent: req.headers.get("user-agent") ?? "", at: new Date() };
}

export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}
