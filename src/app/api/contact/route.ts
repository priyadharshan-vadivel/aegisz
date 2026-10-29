import { NextResponse } from "next/server";
import { submitContact } from "@/lib/server/submit";
import { formLimiter } from "@/lib/server/rate-limit";
import { dbSaveLead } from "@/lib/server/db";
import { clientMeta, debugErrors, emailConfig, missingEnv, readJson, resendSender, verifyTurnstile } from "@/lib/server/env";
import { bookingUrl } from "@/content/site";

export const runtime = "nodejs";

/** Contact form. Saves the lead, emails CONTACT_TO_EMAIL and confirms to the sender. */
export async function POST(req: Request) {
  const cfg = emailConfig();
  const saveLead = dbSaveLead();
  if (!cfg) console.warn("[forms] email not configured: contact leads are saved to the DB only");
  if (!saveLead) console.warn("[forms] DATABASE_URL not set: contact leads are emailed only");
  if (!cfg && !saveLead) {
    const missing = missingEnv("DATABASE_URL", "RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL");
    return NextResponse.json(
      {
        error: "not_configured",
        message: "This form isn't configured on this site yet.",
        ...(debugErrors && { debug: `missing env: ${missing.join(", ")}` }),
      },
      { status: 503 },
    );
  }
  const result = await submitContact(await readJson(req), clientMeta(req), {
    send: cfg ? resendSender(cfg.apiKey, cfg.from) : null,
    saveLead,
    verifyHuman: verifyTurnstile,
    limiter: formLimiter,
    toEmail: cfg?.to ?? "",
    bookingUrl,
    debug: debugErrors,
  });
  return NextResponse.json(result.body, { status: result.status, headers: result.headers });
}
