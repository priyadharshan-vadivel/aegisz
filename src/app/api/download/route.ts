import { readFile } from "node:fs/promises";
import path from "node:path";
import { verifyDownloadToken } from "@/lib/server/download-token";
import { gatedDownload } from "@/lib/server/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Kept outside /public so it can't be fetched without a token. next.config.ts traces it into
// this function's bundle (outputFileTracingIncludes).
const FILE = path.join(process.cwd(), "private", "iaac-overview.pdf");

export async function GET(req: Request) {
  if (gatedDownload()) {
    const secret = process.env.DOWNLOAD_SECRET;
    const token = new URL(req.url).searchParams.get("t");
    if (!secret || !verifyDownloadToken(token, secret)) {
      return new Response("This download link has expired or isn't valid. Request a new one at https://aegisz.in/products/iaac#download", {
        status: 403,
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
      });
    }
  }
  // The PDF isn't in git (the repo is public); it must be added to the deployment. See SETUP.md.
  const pdf = await readFile(FILE).catch(() => null);
  if (!pdf) {
    console.error("[download] private/iaac-overview.pdf is missing from this deployment");
    return new Response("The IAAC overview isn't available right now. Email contact@aegisz.in and we'll send it.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
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
