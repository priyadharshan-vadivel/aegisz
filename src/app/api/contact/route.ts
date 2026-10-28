import { NextResponse } from "next/server";
import { submitContact } from "@/lib/server/submit";
import { formLimiter } from "@/lib/server/rate-limit";
import { clientMeta, emailConfig, readJson, resendSender, verifyTurnstile } from "@/lib/server/env";

export const runtime = "nodejs";

/** Book-a-demo / contact form. Emails the request to CONTACT_TO_EMAIL and confirms to the sender. */
export async function POST(req: Request) {
  const cfg = emailConfig();
  if (!cfg) {
    return NextResponse.json(
      { error: "not_configured", message: "Email isn't configured on this site yet." },
      { status: 503 },
    );
  }
  const result = await submitContact(await readJson(req), clientMeta(req), {
    send: resendSender(cfg.apiKey, cfg.from),
    verifyHuman: verifyTurnstile,
    limiter: formLimiter,
    toEmail: cfg.to,
  });
  return NextResponse.json(result.body, { status: result.status, headers: result.headers });
}
