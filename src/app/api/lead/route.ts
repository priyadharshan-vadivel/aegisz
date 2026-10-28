import { NextResponse } from "next/server";
import { submitLead } from "@/lib/server/submit";
import { formLimiter } from "@/lib/server/rate-limit";
import { signDownloadToken } from "@/lib/server/download-token";
import { clientMeta, emailConfig, gatedDownload, readJson, resendSender, verifyTurnstile } from "@/lib/server/env";

export const runtime = "nodejs";

/** IAAC overview download form. Emails the lead, then returns a short-lived download URL. */
export async function POST(req: Request) {
  const cfg = emailConfig();
  const secret = process.env.DOWNLOAD_SECRET;
  if (!cfg || (gatedDownload() && !secret)) {
    return NextResponse.json(
      { error: "not_configured", message: "Downloads aren't configured on this site yet." },
      { status: 503 },
    );
  }
  const result = await submitLead(
    await readJson(req),
    clientMeta(req),
    { send: resendSender(cfg.apiKey, cfg.from), verifyHuman: verifyTurnstile, limiter: formLimiter, toEmail: cfg.to },
    () => (gatedDownload() ? `/api/download?t=${encodeURIComponent(signDownloadToken(secret!))}` : "/api/download"),
  );
  return NextResponse.json(result.body, { status: result.status, headers: result.headers });
}
