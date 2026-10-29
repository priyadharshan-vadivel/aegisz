/*
 * npm run check:env — lists which env vars are set or missing. Prints names only, never values.
 * Reads .env and .env.local (like Next.js does), plus anything already in the shell.
 */

for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {}
}

const required: [string, string][] = [
  ["DATABASE_URL", "leads database (Neon)"],
  ["RESEND_API_KEY", "sending email"],
  ["CONTACT_TO_EMAIL", "where lead notifications go"],
  ["CONTACT_FROM_EMAIL", "sender address on your Resend domain"],
  ["DOWNLOAD_SECRET", "signing the 7-day IAAC overview links"],
  ["NEXT_PUBLIC_TURNSTILE_SITE_KEY", "Turnstile widget"],
  ["TURNSTILE_SECRET_KEY", "Turnstile server check"],
];
const optional: [string, string][] = [
  ["IP_HASH_SECRET", "falls back to DOWNLOAD_SECRET"],
  ["SITE_URL", "falls back to https://aegisz.in or the Vercel URL"],
  ["NEXT_PUBLIC_BOOKING_URL", "falls back to the Cal.id page in src/content/booking.ts"],
];

const isSet = (name: string) => Boolean(process.env[name]?.trim());
const line = (ok: boolean, name: string, why: string) => `  ${ok ? "ok     " : "MISSING"}  ${name}  (${why})`;

console.log("Required:");
for (const [n, why] of required) console.log(line(isSet(n), n, why));
console.log("Optional:");
for (const [n, why] of optional) console.log(line(isSet(n), n, why).replace("MISSING", "not set"));

const missing = required.filter(([n]) => !isSet(n)).map(([n]) => n);
if (missing.length) {
  console.log(`\n${missing.length} required variable(s) missing: ${missing.join(", ")}`);
  process.exitCode = 1;
} else {
  console.log("\nAll required variables are set.");
}
