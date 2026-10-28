import { HONEYPOT, contactSubject, leadSubject, validateContact, validateLead } from "../forms.ts";
import type { RateLimiter } from "./rate-limit.ts";
import {
  contactConfirmationMail,
  contactOwnerMail,
  leadConfirmationMail,
  leadOwnerMail,
  type Mail,
  type Meta,
} from "./templates.ts";

/*
 * Form submission flow, independent of Next.js and Resend so it can be tested directly.
 * Order: shape → honeypot (silent success) → rate limit → human check → validation → send.
 */

export type Deps = {
  send: (mail: Mail) => Promise<void>;
  verifyHuman: (token: string | undefined, ip: string) => Promise<boolean>;
  limiter: RateLimiter;
  toEmail: string;
};

export type Result = { status: number; body: Record<string, unknown>; headers?: Record<string, string> };

type Gate = { ok: true; input: Record<string, unknown> } | { ok: false; result: Result };

async function gate(raw: unknown, meta: Meta, deps: Deps): Promise<Gate> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, result: { status: 400, body: { error: "bad_request", message: "Send the form as JSON." } } };
  }
  const input = raw as Record<string, unknown>;
  // Bots fill every field. Pretend it worked; send nothing.
  if (typeof input[HONEYPOT] === "string" && input[HONEYPOT].trim() !== "") {
    return { ok: false, result: { status: 200, body: { ok: true } } };
  }
  const rate = deps.limiter.hit(meta.ip);
  if (!rate.ok) {
    return {
      ok: false,
      result: {
        status: 429,
        body: { error: "rate_limited", message: "Too many requests. Try again in a few minutes." },
        headers: { "Retry-After": String(rate.retryAfter) },
      },
    };
  }
  const token = typeof input.turnstileToken === "string" ? input.turnstileToken : undefined;
  if (!(await deps.verifyHuman(token, meta.ip))) {
    return { ok: false, result: { status: 400, body: { error: "verification_failed", message: "We couldn't verify you're human. Please try again." } } };
  }
  return { ok: true, input };
}

async function deliver(owner: Mail, confirmation: Mail, deps: Deps): Promise<Result | null> {
  try {
    await deps.send(owner);
  } catch (err) {
    console.error("[forms] owner email failed", err);
    return { status: 502, body: { error: "send_failed", message: "We couldn't send your request. Please email us directly." } };
  }
  // The requester's confirmation is best-effort: the lead is already safely delivered.
  await deps.send(confirmation).catch((err) => console.error("[forms] confirmation email failed", err));
  return null;
}

export async function submitContact(raw: unknown, meta: Meta, deps: Deps): Promise<Result> {
  const g = await gate(raw, meta, deps);
  if (!g.ok) return g.result;
  const v = validateContact(g.input);
  if (!v.ok) return { status: 422, body: { error: "invalid", errors: v.errors } };
  const failed = await deliver(
    contactOwnerMail(v.data, meta, deps.toEmail, contactSubject(v.data)),
    contactConfirmationMail(v.data, deps.toEmail),
    deps,
  );
  return failed ?? { status: 200, body: { ok: true } };
}

export async function submitLead(raw: unknown, meta: Meta, deps: Deps, downloadUrl: () => string): Promise<Result> {
  const g = await gate(raw, meta, deps);
  if (!g.ok) return g.result;
  const v = validateLead(g.input);
  if (!v.ok) return { status: 422, body: { error: "invalid", errors: v.errors } };
  const failed = await deliver(
    leadOwnerMail(v.data, meta, deps.toEmail, leadSubject(v.data)),
    leadConfirmationMail(v.data, deps.toEmail),
    deps,
  );
  return failed ?? { status: 200, body: { ok: true, downloadUrl: downloadUrl() } };
}
