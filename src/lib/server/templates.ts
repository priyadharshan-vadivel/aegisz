import { interestTag, type ContactData, type LeadData } from "../forms.ts";

/* Plain, inline-styled email bodies (HTML + text). All user input is escaped. */

export type Mail = { to: string; subject: string; html: string; text: string; replyTo?: string };

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function rows(pairs: [string, string][]) {
  const html = pairs
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#6b7280;vertical-align:top;white-space:nowrap">${esc(k)}</td>` +
        `<td style="padding:6px 0;color:#0a0a0a;white-space:pre-wrap">${esc(v || "—")}</td></tr>`,
    )
    .join("");
  const text = pairs.map(([k, v]) => `${k}: ${v || "—"}`).join("\n");
  return { html: `<table style="border-collapse:collapse;font:14px/1.5 system-ui,sans-serif">${html}</table>`, text };
}

const wrap = (title: string, body: string) =>
  `<div style="font:15px/1.6 system-ui,sans-serif;color:#0a0a0a;max-width:560px">` +
  `<p style="font:600 12px/1 ui-monospace,monospace;letter-spacing:.12em;color:#6b7280;text-transform:uppercase">AegisZ</p>` +
  `<h1 style="font-size:20px;margin:8px 0 16px">${esc(title)}</h1>${body}</div>`;

/** Request metadata. `ip` is used for rate limiting and bot checks only; emails show the hash. */
export type Meta = { ip: string; ipHash?: string | null; userAgent: string; at: Date };

function metaRows(m: Meta, saved: boolean): [string, string][] {
  return [
    ["Received", m.at.toISOString()],
    ["Saved to leads DB", saved ? "Yes" : "No (see server logs)"],
    ["IP hash", m.ipHash ? m.ipHash.slice(0, 12) : ""],
    ["User agent", m.userAgent],
  ];
}

export function contactOwnerMail(d: ContactData, m: Meta, to: string, subject: string, saved: boolean): Mail {
  const r = rows([
    ["Interest", interestTag(d.interest)],
    ["Name", d.name],
    ["Work email", d.email],
    ["Phone", d.phone],
    ["Company", d.company],
    ["Role", d.role],
    ["Message", d.message],
    ["Sent from", d.sourcePage],
    ...metaRows(m, saved),
  ]);
  return { to, subject, replyTo: d.email, html: wrap("New message from aegisz.in", r.html), text: `New message from aegisz.in\n\n${r.text}` };
}

export function contactConfirmationMail(d: ContactData, replyTo: string): Mail {
  const what = interestTag(d.interest).toLowerCase();
  const text =
    // TODO: add a response-time commitment here if you want one.
    `Hi ${d.name},\n\nThanks for reaching out about ${what}. We've received your message and will be in touch ` +
    `shortly.\n\nIf it's urgent, just reply to this email.\n\nThe AegisZ team\nhttps://aegisz.in`;
  const html = wrap(
    "We've got your message",
    `<p>Hi ${esc(d.name)},</p><p>Thanks for reaching out about ${esc(what)}. We've received your message and will be ` +
      `in touch shortly.</p><p>If it's urgent, just reply to this email.</p><p>The AegisZ team<br>` +
      `<a href="https://aegisz.in" style="color:#0a0a0a">aegisz.in</a></p>`,
  );
  return { to: d.email, subject: "We've received your message · AegisZ", html, text, replyTo };
}

export function leadOwnerMail(d: LeadData, m: Meta, to: string, subject: string, saved: boolean): Mail {
  const r = rows([
    ["Name", d.name],
    ["Work email", d.email],
    ["Phone", d.phone],
    ["Company", d.company],
    ["Sent from", d.sourcePage],
    ...metaRows(m, saved),
  ]);
  return { to, subject, replyTo: d.email, html: wrap("IAAC overview requested", r.html), text: `IAAC overview requested\n\n${r.text}` };
}

export const LINK_VALID_DAYS = 7;

/** The email that delivers the IAAC overview: a signed link, never an attachment. */
export function overviewMail(d: LeadData, link: string, replyTo: string, bookingUrl: string): Mail {
  const text =
    `Hi ${d.name},\n\nHere's the IAAC overview you asked for (PDF, 19 pages):\n${link}\n\n` +
    `This link works for ${LINK_VALID_DAYS} days.\n\nIf you'd like to see IAAC stop a command on a live server, ` +
    `book a demo: ${bookingUrl}\nQuestions? Just reply to this email.\n\nThe AegisZ team\nhttps://aegisz.in`;
  const html = wrap(
    "Your IAAC overview",
    `<p>Hi ${esc(d.name)},</p><p>Here's the IAAC overview you asked for.</p>` +
      `<p style="margin:24px 0"><a href="${esc(link)}" style="display:inline-block;background:#0a0a0a;color:#ffffff;` +
      `padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:600">IAAC overview (PDF, 19 pages)</a></p>` +
      `<p style="color:#6b7280">This link works for ${LINK_VALID_DAYS} days.</p>` +
      `<p>If you'd like to see IAAC stop a command on a live server, <a href="${esc(bookingUrl)}" style="color:#0a0a0a">` +
      `book a demo</a>. Questions? Just reply to this email.</p><p>The AegisZ team</p>`,
  );
  return { to: d.email, subject: "Your IAAC overview · AegisZ", html, text, replyTo };
}
