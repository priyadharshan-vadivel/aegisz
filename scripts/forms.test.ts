// Run: npm test. Exercises the form pipeline with a fake mailer, no network or Resend.
import { test } from "node:test";
import assert from "node:assert/strict";
import { submitContact, submitLead, type Deps } from "../src/lib/server/submit.ts";
import { MemoryRateLimiter } from "../src/lib/server/rate-limit.ts";
import { signDownloadToken, verifyDownloadToken } from "../src/lib/server/download-token.ts";
import type { Mail } from "../src/lib/server/templates.ts";

const meta = { ip: "203.0.113.9", userAgent: "test", at: new Date("2026-10-28T10:00:00Z") };
const good = {
  name: "Asha Rao",
  email: "asha@acme.in",
  company: "Acme Corp",
  role: "CISO",
  interest: "iaac-questions",
  message: "40 Linux servers",
  turnstileToken: "ok",
};

function deps(over: Partial<Deps> = {}) {
  const sent: Mail[] = [];
  const d: Deps = {
    send: async (m) => void sent.push(m),
    verifyHuman: async (t) => t === "ok",
    limiter: new MemoryRateLimiter(5, 600_000),
    toEmail: "owner@aegisz.in",
    ...over,
  };
  return { d, sent };
}

test("happy path: owner email with interest-tagged subject, plus confirmation", async () => {
  const { d, sent } = deps();
  const r = await submitContact(good, meta, d);
  assert.equal(r.status, 200);
  assert.equal(sent.length, 2);
  assert.equal(sent[0].to, "owner@aegisz.in");
  assert.equal(sent[0].subject, "[IAAC question] Acme Corp — Asha Rao");
  assert.equal(sent[0].replyTo, "asha@acme.in");
  assert.match(sent[0].text, /40 Linux servers/);
  assert.equal(sent[1].to, "asha@acme.in");
});

test("subject tag follows the interest", async () => {
  const { d, sent } = deps();
  await submitContact({ ...good, interest: "sovereign" }, meta, d);
  assert.equal(sent[0].subject, "[Sovereign deployment] Acme Corp — Asha Rao");
});

test("user input is HTML-escaped in emails", async () => {
  const { d, sent } = deps();
  await submitContact({ ...good, message: "<script>x</script>" }, meta, d);
  assert.ok(!sent[0].html.includes("<script>"));
  assert.ok(sent[0].html.includes("&lt;script&gt;"));
});

test("validation mirrors the client: free-mail and missing fields rejected", async () => {
  const { d, sent } = deps();
  const r = await submitContact({ ...good, email: "asha@gmail.com", company: "", interest: "nope" }, meta, d);
  assert.equal(r.status, 422);
  const errors = r.body.errors as Record<string, string>;
  assert.equal(errors.email, "Use your work email address.");
  assert.ok(errors.company);
  assert.ok(errors.interest);
  assert.equal(sent.length, 0);
});

test("honeypot: silent 200, nothing sent", async () => {
  const { d, sent } = deps();
  const r = await submitContact({ ...good, website: "http://spam" }, meta, d);
  assert.equal(r.status, 200);
  assert.equal(sent.length, 0);
});

test("failed human verification is rejected", async () => {
  const { d, sent } = deps();
  const r = await submitContact({ ...good, turnstileToken: "bad" }, meta, d);
  assert.equal(r.status, 400);
  assert.equal(r.body.error, "verification_failed");
  assert.equal(sent.length, 0);
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

test("owner email failure surfaces as 502; confirmation failure doesn't", async () => {
  const failOwner = deps({ send: async () => Promise.reject(new Error("down")) });
  assert.equal((await submitContact(good, meta, failOwner.d)).status, 502);
  let n = 0;
  const failSecond = deps({ send: async () => (n++ === 0 ? undefined : Promise.reject(new Error("down"))) });
  assert.equal((await submitContact(good, meta, failSecond.d)).status, 200);
});

test("lead: emails owner and returns the download URL", async () => {
  const { d, sent } = deps();
  const r = await submitLead({ name: "Asha Rao", email: "asha@acme.in", company: "Acme Corp", turnstileToken: "ok" }, meta, d, () => "/api/download?t=abc");
  assert.equal(r.status, 200);
  assert.equal(r.body.downloadUrl, "/api/download?t=abc");
  assert.equal(sent[0].subject, "[IAAC overview download] Acme Corp — Asha Rao");
});

test("download token: valid, expired, forged, wrong secret", () => {
  const now = 1_800_000_000_000;
  const t = signDownloadToken("s3cret", now, 60_000);
  assert.equal(verifyDownloadToken(t, "s3cret", now + 1_000), true);
  assert.equal(verifyDownloadToken(t, "s3cret", now + 61_000), false, "expired");
  assert.equal(verifyDownloadToken(t, "other", now), false, "wrong secret");
  const [exp] = t.split(".");
  assert.equal(verifyDownloadToken(`${Number(exp) + 999999}.${t.split(".")[1]}`, "s3cret", now), false, "tampered expiry");
  assert.equal(verifyDownloadToken("garbage", "s3cret", now), false);
  assert.equal(verifyDownloadToken(null, "s3cret", now), false);
});
