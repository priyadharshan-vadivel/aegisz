import { NextResponse } from "next/server";
import { submitLead } from "@/lib/server/submit";
import { formLimiter } from "@/lib/server/rate-limit";
import { signDownloadToken } from "@/lib/server/download-token";
import { dbSaveLead } from "@/lib/server/db";
import { clientMeta, emailConfig, readJson, resendSender, siteUrl, verifyTurnstile } from "@/lib/server/env";
import { bookingUrl } from "@/content/site";

export const runtime = "nodejs";

/** IAAC overview request. Saves the lead and emails the requester a signed 7-day download link. */
export async function POST(req: Request) {
  const cfg = emailConfig();
  const secret = process.env.DOWNLOAD_SECRET;
  // Email is how the PDF is delivered, so it's required here.
  if (!cfg || !secret) {
    return NextResponse.json(
      { error: "not_configured", message: "The overview can't be sent from this site yet." },
      { status: 503 },
    );
  }
  const saveLead = dbSaveLead();
  if (!saveLead) console.warn("[forms] DATABASE_URL not set: download leads are emailed only");
  const base = siteUrl();
  const result = await submitLead(
    await readJson(req),
    clientMeta(req),
    {
      send: resendSender(cfg.apiKey, cfg.from),
      saveLead,
      verifyHuman: verifyTurnstile,
      limiter: formLimiter,
      toEmail: cfg.to,
      bookingUrl,
    },
    (ref) => `${base}/api/download?t=${encodeURIComponent(signDownloadToken(secret, ref))}`,
  );
  return NextResponse.json(result.body, { status: result.status, headers: result.headers });
}
