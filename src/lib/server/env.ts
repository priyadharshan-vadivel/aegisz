import "server-only";
import { Resend } from "resend";
import type { Mail } from "./templates";

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
export async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (!warned) console.warn("[forms] TURNSTILE_SECRET_KEY not set: skipping human verification");
    warned = true;
    return true;
  }
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch (err) {
    console.error("[forms] Turnstile verification error", err);
    return false;
  }
}

export const gatedDownload = () => process.env.GATED_DOWNLOAD !== "false";

export function clientMeta(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  return { ip, userAgent: req.headers.get("user-agent") ?? "", at: new Date() };
}

export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}
