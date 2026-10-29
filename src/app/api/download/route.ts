import { readFile } from "node:fs/promises";
import path from "node:path";
import { verifyDownloadToken } from "@/lib/server/download-token";
import { readStoredFile } from "@/lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The PDF isn't in git (the repo is public). On Vercel it's stored in the database
// (`npm run pdf:upload`); locally it falls back to private/iaac-overview.pdf.
const KEY = "iaac-overview";
const LOCAL_FILE = path.join(process.cwd(), "private", "iaac-overview.pdf");

const text = (body: string, status: number) =>
  new Response(body, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });

async function loadPdf() {
  const stored = await readStoredFile(KEY).catch((err) => {
    console.error("[download] reading the PDF from the database failed", err);
    return null;
  });
  if (stored) return stored.bytes;
  return readFile(LOCAL_FILE).catch(() => null);
}

export async function GET(req: Request) {
  const secret = process.env.DOWNLOAD_SECRET;
  const token = new URL(req.url).searchParams.get("t");
  if (!secret || !verifyDownloadToken(token, secret)) {
    return text(
      "This download link has expired or isn't valid. Request a new one at https://aegisz.in/products/iaac#download",
      403,
    );
  }
  const pdf = await loadPdf();
  if (!pdf) {
    console.error("[download] IAAC overview not found in the database or private/");
    return text("The IAAC overview isn't available right now. Email contact@aegisz.in and we'll send it.", 503);
  }
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="AegisZ-IAAC-Overview.pdf"',
      "Content-Length": String(pdf.length),
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
