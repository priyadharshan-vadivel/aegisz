// Export leads to CSV: npm run leads:export [-- --type contact|download] [-- --since 2026-01-01]
// Reads DATABASE_URL from .env. Writes exports/leads-YYYY-MM-DD.csv (git-ignored).
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import { toCsv } from "./csv.ts";

const args = process.argv.slice(2);
const arg = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL isn't set. Run `vercel env pull .env` first (see SETUP.md).");
  process.exit(1);
}

const type = arg("type");
if (type && type !== "contact" && type !== "download") {
  console.error('--type must be "contact" or "download"');
  process.exit(1);
}
const since = arg("since");
if (since && Number.isNaN(Date.parse(since))) {
  console.error("--since must be a date, like 2026-01-01");
  process.exit(1);
}

const sql = neon(url);
const rows = (await sql.query(
  `select id, created_at, type, name, work_email, phone, company, role, interest, message, consent_at, source_page, ip_hash, user_agent
     from leads
    where ($1::lead_type is null or type = $1::lead_type)
      and ($2::timestamptz is null or created_at >= $2::timestamptz)
    order by created_at desc`,
  [type ?? null, since ?? null],
)) as Record<string, unknown>[];

const columns = ["id", "created_at", "type", "name", "work_email", "phone", "company", "role", "interest", "message", "consent_at", "source_page", "ip_hash", "user_agent"];
const dir = path.join(process.cwd(), "exports");
mkdirSync(dir, { recursive: true });
const file = path.join(dir, `leads-${new Date().toISOString().slice(0, 10)}.csv`);
writeFileSync(file, toCsv(columns, rows));
console.log(`Exported ${rows.length} lead${rows.length === 1 ? "" : "s"} to ${path.relative(process.cwd(), file)}`);
