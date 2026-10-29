// Run: npm test. Exercises the form pipeline with a fake mailer and a fake leads DB. No network.
import { test } from "node:test";
import assert from "node:assert/strict";
import { submitContact, submitLead, type Deps } from "../src/lib/server/submit.ts";
import { MemoryRateLimiter } from "../src/lib/server/rate-limit.ts";
import { DOWNLOAD_TTL_MS, signDownloadToken, verifyDownloadToken } from "../src/lib/server/download-token.ts";
import { hashIp, type LeadRecord } from "../src/lib/server/leads.ts";
import { hasConsent, sourcePageOf, toE164, validateContact, validateLead } from "../src/lib/forms.ts";
import { toCsv } from "./csv.ts";
import type { Mail } from "../src/lib/server/templates.ts";

const meta = { ip: "203.0.113.9", ipHash: "abc123def4567890", userAgent: "test", at: new Date("2026-10-28T10:00:00Z") };
const good = {
  name: "Asha Rao",
  email: "asha@acme.in",
  company: "Acme Corp",
  phoneCountry: "+91",
  phone: "98765 43210",
  role: "CISO",
  interest: "iaac-questions",
  message: "40 Linux servers",
  consent: "on",
  sourcePage: "/contact",
  turnstileToken: "ok",
};
const goodLead = {
  name: "Asha Rao",
  email: "asha@acme.in",
  company: "Acme Corp",
  phoneCountry: "+91",
  phone: "9876543210",
  consent: true,
  sourcePage: "/products/iaac",
  turnstileToken: "ok",
};
const link = (ref: string) => `https://aegisz.in/api/download?t=tok-${ref}`;

function deps(over: Partial<Deps> = {}) {
  const sent: Mail[] = [];
  const saved: LeadRecord[] = [];
  const logged: string[] = [];
  const d: Deps = {
    send: async (m) => void sent.push(m),
    saveLead: async (l) => {
      saved.push(l);
      return { id: "0b6f1a2c-1111-4222-8333-944455556666" };
    },
    verifyHuman: async (t) => t === "ok",
    limiter: new MemoryRateLimiter(5, 600_000),
    toEmail: "owner@aegisz.in",
    bookingUrl: "https://cal.id/priyadharshan-aegisz",
    log: (msg) => void logged.push(msg),
    ...over,
  };
  return { d, sent, saved, logged };
}
const fail = async () => Promise.reject(new Error("down"));

/* Phone ------------------------------------------------------------------ */

test("phone: Indian numbers normalise to E.164", () => {
  assert.equal(toE164("+91", "98765 43210"), "+919876543210");
  assert.equal(toE164("+91", "9876543210"), "+919876543210");
  assert.equal(toE164("+91", "+91 98765 43210"), "+919876543210");
  assert.equal(toE164("+91", "098765-43210"), "+919876543210", "leading trunk 0 dropped");
  assert.equal(toE164("+1", "+91 98765 43210"), "+919876543210", "a typed + wins over the selector");
});

test("phone: Indian numbers must be 10 digits starting 6–9", () => {
  assert.equal(toE164("+91", "987654321"), null, "9 digits");
  assert.equal(toE164("+91", "98765432101"), null, "11 digits");
  assert.equal(toE164("+91", "5876543210"), null, "starts with 5");
});

test("phone: other countries and junk", () => {
  assert.equal(toE164("+1", "(415) 555-0132"), "+14155550132");
  assert.equal(toE164("+44", "020 7946 0018"), "+442079460018");
  assert.equal(toE164("+91", ""), null);
  assert.equal(toE164("+91", "call me"), null);
  assert.equal(toE164("+91", "98765abc10"), null);
  assert.equal(toE164("+1", "1234567890123456"), null, "16 digits is too long for E.164");
  assert.equal(toE164("+999", "12345678"), null, "unknown country code");
});

test("phone: required on both forms, with a clear message", () => {
  const c = validateContact({ ...good, phone: "" });
  assert.equal(c.ok, false);
  assert.equal(!c.ok && c.errors.phone, "Enter your phone number.");
  const l = validateLead({ ...goodLead, phone: "12" });
  assert.equal(!l.ok && l.errors.phone, "Enter a valid phone number, like 98765 43210.");
  const ok = validateContact(good);
  assert.equal(ok.ok && ok.data.phone, "+919876543210");
});

/* Consent ---------------------------------------------------------------- */

test("consent: only an explicit yes counts", () => {
  for (const yes of [true, "true", "on"]) assert.equal(hasConsent(yes), true);
  for (const no of [undefined, false, "false", "off", "", "yes please", 1]) assert.equal(hasConsent(no), false);
});

test("consent required: contact form 422, nothing saved or sent", async () => {
  for (const consent of [undefined, false, "off"]) {
    const { d, sent, saved } = deps();
    const r = await submitContact({ ...good, consent }, meta, d);
    assert.equal(r.status, 422);
    assert.ok((r.body.errors as Record<string, string>).consent);
    assert.equal(sent.length + saved.length, 0);
  }
});

test("consent required: download form 422", async () => {
  const { d, sent, saved } = deps();
  const { consent: _omit, ...noConsent } = goodLead;
  const r = await submitLead(noConsent, meta, d, link);
  assert.equal(r.status, 422);
  assert.ok((r.body.errors as Record<string, string>).consent);
  assert.equal(sent.length + saved.length, 0);
});

test("consent is recorded as consent_at on the saved lead", async () => {
  const { d, saved } = deps();
  await submitContact(good, meta, d);
  assert.deepEqual(saved[0].consentAt, meta.at);
});

/* Contact flow ----------------------------------------------------------- */

test("contact: saves the lead, emails owner (interest-tagged), confirms to sender", async () => {
  const { d, sent, saved } = deps();
  const r = await submitContact(good, meta, d);
  assert.equal(r.status, 200);
  assert.equal(saved.length, 1);
  assert.deepEqual(
    { type: saved[0].type, phone: saved[0].phone, workEmail: saved[0].workEmail, sourcePage: saved[0].sourcePage, ipHash: saved[0].ipHash },
    { type: "contact", phone: "+919876543210", workEmail: "asha@acme.in", sourcePage: "/contact", ipHash: meta.ipHash },
  );
  assert.equal(sent.length, 2);
  assert.equal(sent[0].to, "owner@aegisz.in");
  assert.equal(sent[0].subject, "[IAAC question] Acme Corp — Asha Rao");
  assert.equal(sent[0].replyTo, "asha@acme.in");
  assert.match(sent[0].text, /40 Linux servers/);
  assert.match(sent[0].text, /\+919876543210/);
  assert.equal(sent[1].to, "asha@acme.in");
});

test("contact: the raw IP is never stored or emailed", async () => {
  const { d, sent, saved } = deps();
  await submitContact(good, meta, d);
  assert.ok(!JSON.stringify(saved).includes(meta.ip));
  assert.ok(!sent.some((m) => m.text.includes(meta.ip) || m.html.includes(meta.ip)));
});

test("contact: lead is saved and 200 when email fails", async () => {
  const { d, saved, logged } = deps({ send: fail });
  const r = await submitContact(good, meta, d);
  assert.equal(r.status, 200);
  assert.equal(saved.length, 1);
  assert.ok(logged.some((l) => l.includes("owner email failed")));
});

test("contact: lead is saved and 200 when email isn't configured", async () => {
  const { d, saved } = deps({ send: null });
  assert.equal((await submitContact(good, meta, d)).status, 200);
  assert.equal(saved.length, 1);
});

test("contact: owner is still emailed and the error logged when the DB fails", async () => {
  const { d, sent, logged } = deps({ saveLead: fail });
  const r = await submitContact(good, meta, d);
  assert.equal(r.status, 200);
  assert.equal(sent[0].to, "owner@aegisz.in");
  assert.match(sent[0].text, /Saved to leads DB: No/);
  assert.ok(logged.some((l) => l.includes("lead save failed")));
});

test("contact: 502 only when both the DB and email fail", async () => {
  const { d } = deps({ saveLead: fail, send: fail });
  const r = await submitContact(good, meta, d);
  assert.equal(r.status, 502);
  assert.equal(r.body.error, "send_failed");
});

test("contact: confirmation failure doesn't fail the request", async () => {
  let n = 0;
  const { d } = deps({ send: async () => (n++ === 0 ? undefined : fail()) });
  assert.equal((await submitContact(good, meta, d)).status, 200);
});

test("user input is HTML-escaped in emails", async () => {
  const { d, sent } = deps();
  await submitContact({ ...good, message: "<script>x</script>" }, meta, d);
  assert.ok(!sent[0].html.includes("<script>"));
  assert.ok(sent[0].html.includes("&lt;script&gt;"));
});

test("validation mirrors the client: free-mail and missing fields rejected", async () => {
  const { d, sent, saved } = deps();
  const r = await submitContact({ ...good, email: "asha@gmail.com", company: "", interest: "nope" }, meta, d);
  assert.equal(r.status, 422);
  const errors = r.body.errors as Record<string, string>;
  assert.equal(errors.email, "Use your work email address.");
  assert.ok(errors.company);
  assert.ok(errors.interest);
  assert.equal(sent.length + saved.length, 0);
});

test("source page: site paths only", () => {
  assert.equal(sourcePageOf("/products/iaac", "/x"), "/products/iaac");
  assert.equal(sourcePageOf("https://evil.example/", "/x"), "/x");
  assert.equal(sourcePageOf("//evil.example", "/x"), "/x");
  assert.equal(sourcePageOf(undefined, "/contact"), "/contact");
  assert.equal(sourcePageOf("/" + "a".repeat(500), "/x").length, 200);
});

test("honeypot: silent 200, nothing saved or sent", async () => {
  const { d, sent, saved } = deps();
  const r = await submitContact({ ...good, website: "http://spam" }, meta, d);
  assert.equal(r.status, 200);
  assert.equal(sent.length + saved.length, 0);
});

test("failed human verification is rejected", async () => {
  const { d, sent, saved } = deps();
  const r = await submitContact({ ...good, turnstileToken: "bad" }, meta, d);
  assert.equal(r.status, 400);
  assert.equal(r.body.error, "verification_failed");
  assert.equal(sent.length + saved.length, 0);
});

test("rate limit: 6th request in the window gets 429 with Retry-After", async () => {
  const { d } = deps({ limiter: new MemoryRateLimiter(5, 600_000) });
  for (let i = 0; i < 5; i++) assert.equal((await submitContact(good, meta, d)).status, 200);
  const r = await submitContact(good, meta, d);
  assert.equal(r.status, 429);
  assert.ok(Number(r.headers?.["Retry-After"]) > 0);
});

test("non-object body is a 400", async () => {
  const { d } = deps();
  assert.equal((await submitContact(null, meta, d)).status, 400);
  assert.equal((await submitContact([1, 2], meta, d)).status, 400);
});

/* Download flow ---------------------------------------------------------- */

test("download: saves a download lead, emails the link (no attachment), then the owner", async () => {
  const { d, sent, saved } = deps();
  const r = await submitLead(goodLead, meta, d, link);
  assert.equal(r.status, 200);
  assert.deepEqual(r.body, { ok: true, email: "asha@acme.in" }, "no download URL: nothing downloads on the page");
  assert.equal(saved[0].type, "download");
  assert.equal(saved[0].interest, "iaac-overview");
  assert.equal(saved[0].sourcePage, "/products/iaac");
  const [toPerson, toOwner] = sent;
  assert.equal(toPerson.to, "asha@acme.in");
  assert.match(toPerson.text, /https:\/\/aegisz\.in\/api\/download\?t=tok-0b6f1a2c11114222/);
  assert.match(toPerson.text, /7 days/);
  assert.ok(!("attachments" in toPerson), "no attachment");
  assert.equal(toOwner.to, "owner@aegisz.in");
  assert.equal(toOwner.subject, "[IAAC overview request] Acme Corp — Asha Rao");
});

test("download: requester email failure is a 502, but the lead is still saved", async () => {
  const { d, saved } = deps({ send: fail });
  const r = await submitLead(goodLead, meta, d, link);
  assert.equal(r.status, 502);
  assert.equal(saved.length, 1);
});

test("download: DB failure still emails the link", async () => {
  const { d, sent, logged } = deps({ saveLead: fail });
  const r = await submitLead(goodLead, meta, d, link);
  assert.equal(r.status, 200);
  assert.equal(sent[0].to, "asha@acme.in");
  assert.match(sent[0].text, /api\/download\?t=tok-[0-9a-f]{16}/);
  assert.ok(logged.some((l) => l.includes("lead save failed")));
});

/* Download link expiry --------------------------------------------------- */

test("download token: lasts 7 days, not a millisecond more", () => {
  const now = 1_800_000_000_000;
  const t = signDownloadToken("s3cret", "0b6f1a2c11114222", now);
  assert.equal(DOWNLOAD_TTL_MS, 7 * 24 * 60 * 60 * 1000);
  assert.equal(verifyDownloadToken(t, "s3cret", now), "0b6f1a2c11114222");
  assert.equal(verifyDownloadToken(t, "s3cret", now + DOWNLOAD_TTL_MS - 60 * 60 * 1000), "0b6f1a2c11114222", "6 days 23 hours");
  assert.equal(verifyDownloadToken(t, "s3cret", now + DOWNLOAD_TTL_MS), "0b6f1a2c11114222", "at the boundary");
  assert.equal(verifyDownloadToken(t, "s3cret", now + DOWNLOAD_TTL_MS + 1), null, "7 days + 1 ms");
});

test("download token: forged, tampered or malformed tokens are rejected", () => {
  const now = 1_800_000_000_000;
  const t = signDownloadToken("s3cret", "ref1", now);
  const [exp, ref, sig] = t.split(".");
  assert.equal(verifyDownloadToken(t, "other", now), null, "wrong secret");
  assert.equal(verifyDownloadToken(`${Number(exp) + 999999}.${ref}.${sig}`, "s3cret", now), null, "tampered expiry");
  assert.equal(verifyDownloadToken(`${exp}.ref2.${sig}`, "s3cret", now), null, "tampered ref");
  assert.equal(verifyDownloadToken(`${exp}.${ref}.${sig.slice(0, -2)}xx`, "s3cret", now), null, "tampered signature");
  assert.equal(verifyDownloadToken(`${t}.extra`, "s3cret", now), null);
  assert.equal(verifyDownloadToken("garbage", "s3cret", now), null);
  assert.equal(verifyDownloadToken(null, "s3cret", now), null);
  assert.throws(() => signDownloadToken("s3cret", "bad ref!", now));
});

/* IP hash and CSV export ------------------------------------------------- */

test("ip hash: keyed, stable, never the raw address", () => {
  const h = hashIp("203.0.113.9", "k");
  assert.equal(h, hashIp("203.0.113.9", "k"));
  assert.notEqual(h, hashIp("203.0.113.9", "other"));
  assert.ok(h && !h.includes("203.0.113.9"));
  assert.equal(hashIp("203.0.113.9", undefined), null);
  assert.equal(hashIp("unknown", "k"), null);
});

test("csv: quoting, BOM and formula-injection guard", () => {
  const csv = toCsv(["name", "message", "phone"], [{ name: 'Asha "A" Rao', message: "=HYPERLINK(\"x\")", phone: "+919876543210" }]);
  assert.ok(csv.startsWith("﻿name,message,phone\r\n"));
  assert.match(csv, /"Asha ""A"" Rao"/);
  assert.match(csv, /"'=HYPERLINK\(""x""\)"/);
  assert.match(csv, /,'\+919876543210\r\n/);
});

/* Dev error detail -------------------------------------------------------- */

test("dev: failures carry the exact error; production hides it", async () => {
  const boom = async () => Promise.reject(new Error("relation \"leads\" does not exist"));
  const mailDown = async () => Promise.reject(new Error("validation_error: domain not verified"));
  const dev = await submitContact(good, meta, deps({ saveLead: boom, send: mailDown, debug: true }).d);
  assert.equal(dev.status, 502);
  assert.match(String(dev.body.debug), /lead save: relation "leads" does not exist/);
  assert.match(String(dev.body.debug), /owner email: validation_error: domain not verified/);
  const prod = await submitContact(good, meta, deps({ saveLead: boom, send: mailDown }).d);
  assert.equal(prod.status, 502);
  assert.equal(prod.body.debug, undefined);
});

test("dev: Turnstile error codes are shown", async () => {
  const r = await submitLead(goodLead, meta, deps({ verifyHuman: async () => "invalid-input-secret", debug: true }).d, link);
  assert.equal(r.status, 400);
  assert.equal(r.body.debug, "turnstile: invalid-input-secret");
});