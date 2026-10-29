import { randomUUID } from "node:crypto";
import { HONEYPOT, contactSubject, leadSubject, validateContact, validateLead } from "../forms.ts";
import { contactRecord, downloadRecord, type SaveLead } from "./leads.ts";
import type { RateLimiter } from "./rate-limit.ts";
import {
  contactConfirmationMail,
  contactOwnerMail,
  leadOwnerMail,
  overviewMail,
  type Mail,
  type Meta,
} from "./templates.ts";

/*
 * Form submission flow, independent of Next.js, Resend and the database so it can be tested
 * directly. Order: shape → honeypot (silent success) → rate limit → human check → validation
 * → save lead → email. A lead is never lost because one of email or the DB is down.
 */

export type Deps = {
  /** Null when email isn't configured. */
  send: ((mail: Mail) => Promise<void>) | null;
  /** Null when no database is configured. */
  saveLead: SaveLead | null;
  verifyHuman: (token: string | undefined, ip: string) => Promise<boolean>;
  limiter: RateLimiter;
  /** Where lead notifications go (CONTACT_TO_EMAIL); also the reply-to on confirmations. */
  toEmail: string;
  bookingUrl: string;
  log?: (msg: string, err: unknown) => void;
};

export type Result = { status: number; body: Record<string, unknown>; headers?: Record<string, string> };

type Gate = { ok: true; input: Record<string, unknown> } | { ok: false; result: Result };

const sendFailed: Result = {
  status: 502,
  body: { error: "send_failed", message: "We couldn't send your request. Please email us directly." },
};

async function gate(raw: unknown, meta: Meta, deps: Deps): Promise<Gate> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, result: { status: 400, body: { error: "bad_request", message: "Send the form as JSON." } } };
  }
  const input = raw as Record<string, unknown>;
  // Bots fill every field. Pretend it worked; store and send nothing.
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

const defaultLog = (msg: string, err: unknown) => console.error(msg, err);

/** Run a step; log and return null instead of throwing. */
async function attempt<T>(label: string, deps: Deps, fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (err) {
    (deps.log ?? defaultLog)(`[forms] ${label} failed`, err);
    return null;
  }
}

export async function submitContact(raw: unknown, meta: Meta, deps: Deps): Promise<Result> {
  const g = await gate(raw, meta, deps);
  if (!g.ok) return g.result;
  const v = validateContact(g.input);
  if (!v.ok) return { status: 422, body: { error: "invalid", errors: v.errors } };

  const record = contactRecord(v.data, meta.at, meta.ipHash ?? null, meta.userAgent);
  const saved = deps.saveLead ? (await attempt("lead save", deps, () => deps.saveLead!(record))) !== null : false;
  const send = deps.send;
  const ownerSent = send
    ? (await attempt("owner email", deps, async () => {
        await send(contactOwnerMail(v.data, meta, deps.toEmail, contactSubject(v.data), saved));
        return true;
      })) === true
    : false;
  if (!saved && !ownerSent) return sendFailed;
  // The requester's confirmation is best-effort: the lead is already safe.
  if (send) await attempt("confirmation email", deps, () => send(contactConfirmationMail(v.data, deps.toEmail)));
  return { status: 200, body: { ok: true } };
}

/**
 * IAAC overview request: save the lead, email the requester a signed 7-day link, notify the
 * owner. The requester's email is the deliverable, so it must succeed (the lead is kept either way).
 */
export async function submitLead(raw: unknown, meta: Meta, deps: Deps, downloadLink: (ref: string) => string): Promise<Result> {
  const g = await gate(raw, meta, deps);
  if (!g.ok) return g.result;
  const v = validateLead(g.input);
  if (!v.ok) return { status: 422, body: { error: "invalid", errors: v.errors } };

  const record = downloadRecord(v.data, meta.at, meta.ipHash ?? null, meta.userAgent);
  const row = deps.saveLead ? await attempt("lead save", deps, () => deps.saveLead!(record)) : null;
  // The ref ties the link to its lead row; without a DB it's a random id (still unique per request).
  const ref = (row?.id ?? randomUUID()).replace(/-/g, "").slice(0, 16);
  const send = deps.send;
  if (!send) return sendFailed;
  const delivered = await attempt("overview email", deps, async () => {
    await send(overviewMail(v.data, downloadLink(ref), deps.toEmail, deps.bookingUrl));
    return true;
  });
  if (!delivered) {
    return {
      status: 502,
      body: { error: "send_failed", message: "We couldn't send the email. Please write to us and we'll send the overview." },
    };
  }
  await attempt("owner email", deps, () => send(leadOwnerMail(v.data, meta, deps.toEmail, leadSubject(v.data), row !== null)));
  return { status: 200, body: { ok: true, email: v.data.email } };
}
