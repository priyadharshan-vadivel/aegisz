// Store the IAAC overview PDF in the database: npm run pdf:upload [-- path/to/file.pdf]
// The public repo can't hold it, so /api/download serves it from the `files` table.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL isn't set. Run `vercel env pull .env` first (see SETUP.md).");
  process.exit(1);
}

const file = process.argv[2] ?? "private/iaac-overview.pdf";
const bytes = readFileSync(file);
if (bytes.subarray(0, 5).toString() !== "%PDF-") {
  console.error(`${file} doesn't look like a PDF.`);
  process.exit(1);
}
const sha256 = createHash("sha256").update(bytes).digest("hex");

const sql = neon(url);
await sql.query(
  `insert into files (key, content_type, bytes, sha256, updated_at)
   values ('iaac-overview', 'application/pdf', decode($1, 'base64'), $2, now())
   on conflict (key) do update set content_type = excluded.content_type, bytes = excluded.bytes,
     sha256 = excluded.sha256, updated_at = now()`,
  [bytes.toString("base64"), sha256],
);
console.log(`Stored ${file} (${(bytes.length / 1024).toFixed(0)} KB, sha256 ${sha256.slice(0, 16)}…) as "iaac-overview".`);
