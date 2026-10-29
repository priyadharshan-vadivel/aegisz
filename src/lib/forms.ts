/*
 * Form rules shared by the browser forms and the API routes, so client and server validate
 * identically. Pure TypeScript with no imports (it also runs under `node --test`).
 */

export const interests = [
  { value: "iaac-questions", label: "Questions about IAAC", tag: "IAAC question" },
  { value: "sovereign", label: "Sovereign / air-gapped deployment", tag: "Sovereign deployment" },
  { value: "design-services", label: "Security design services", tag: "Design services" },
  { value: "partnership", label: "Partnership", tag: "Partnership" },
  { value: "other", label: "Other", tag: "Enquiry" },
] as const;

export type Interest = (typeof interests)[number]["value"];

export type ContactFields = "name" | "email" | "company" | "phone" | "role" | "interest" | "message" | "consent";
export type LeadFields = "name" | "email" | "company" | "phone" | "consent";
export type Errors<F extends string> = Partial<Record<F, string>>;

export type ContactData = {
  name: string;
  email: string;
  company: string;
  phone: string; // E.164
  role: string;
  interest: Interest;
  message: string;
  sourcePage: string;
};
export type LeadData = { name: string; email: string; company: string; phone: string; sourcePage: string };

/** The hidden honeypot input. Humans never see or fill it. */
export const HONEYPOT = "website";

export const CONSENT_TEXT =
  "I agree to AegisZ storing these details to respond to my request, as described in the privacy notice.";

const LIMITS = { name: 120, email: 254, company: 160, role: 120, message: 4000, sourcePage: 200 } as const;

// Free-mail domains are rejected for "work email".
const FREE_MAIL =
  /@(?:gmail|googlemail|yahoo|ymail|hotmail|outlook|live|msn|icloud|me|mac|proton|protonmail|pm|aol|gmx|mail|yandex|zoho|rediffmail)\./i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export function emailError(email: string): string | undefined {
  if (!email) return "Enter your work email.";
  if (email.length > LIMITS.email || !EMAIL.test(email)) return "Enter a valid email address, like name@company.com.";
  if (FREE_MAIL.test(email)) return "Use your work email address.";
  return undefined;
}

/* Phone ------------------------------------------------------------------ */

/** Country codes offered in the selector. +91 is the default. */
export const countryCodes = [
  { code: "+91", region: "IN" },
  { code: "+1", region: "US/CA" },
  { code: "+44", region: "UK" },
  { code: "+61", region: "AU" },
  { code: "+64", region: "NZ" },
  { code: "+65", region: "SG" },
  { code: "+60", region: "MY" },
  { code: "+62", region: "ID" },
  { code: "+63", region: "PH" },
  { code: "+66", region: "TH" },
  { code: "+81", region: "JP" },
  { code: "+82", region: "KR" },
  { code: "+852", region: "HK" },
  { code: "+971", region: "AE" },
  { code: "+966", region: "SA" },
  { code: "+974", region: "QA" },
  { code: "+968", region: "OM" },
  { code: "+973", region: "BH" },
  { code: "+965", region: "KW" },
  { code: "+49", region: "DE" },
  { code: "+33", region: "FR" },
  { code: "+31", region: "NL" },
  { code: "+41", region: "CH" },
  { code: "+353", region: "IE" },
  { code: "+27", region: "ZA" },
  { code: "+254", region: "KE" },
  { code: "+94", region: "LK" },
  { code: "+977", region: "NP" },
  { code: "+880", region: "BD" },
] as const;

export const DEFAULT_COUNTRY_CODE = "+91";
const E164 = /^\+[1-9]\d{7,14}$/;
const PHONE_ERROR = "Enter a valid phone number, like 98765 43210.";

/**
 * Combine the country-code selector and the typed number into E.164 ("+919876543210").
 * A number typed with its own "+" wins over the selector. Spaces, dashes, dots and brackets
 * are ignored, and one leading trunk "0" is dropped. Returns null if it isn't a valid number.
 */
export function toE164(countryCode: string, input: string): string | null {
  const raw = input.trim();
  if (!raw || /[^\d\s\-().+]/.test(raw)) return null;
  let e164: string;
  if (raw.startsWith("+")) {
    e164 = "+" + raw.slice(1).replace(/\D/g, "");
  } else {
    if (!countryCodes.some((c) => c.code === countryCode)) return null;
    e164 = countryCode + raw.replace(/\D/g, "").replace(/^0/, "");
  }
  if (!E164.test(e164)) return null;
  // India: 10-digit mobile/landline numbers starting 6–9 (mobiles; the form asks for a callable number).
  if (e164.startsWith("+91") && !/^\+91[6-9]\d{9}$/.test(e164)) return null;
  return e164;
}

function phoneOf(input: Record<string, unknown>) {
  const raw = str(input.phone);
  if (!raw) return { phone: "", error: "Enter your phone number." };
  const phone = toE164(str(input.phoneCountry) || DEFAULT_COUNTRY_CODE, raw);
  return phone ? { phone, error: undefined } : { phone: "", error: PHONE_ERROR };
}

/* Consent and source ----------------------------------------------------- */

/** Only an explicit yes counts: true, "true" or "on" (a ticked checkbox). */
export function hasConsent(v: unknown) {
  return v === true || v === "true" || v === "on";
}

/** The page the form was sent from: a site path, never a full URL. */
export function sourcePageOf(v: unknown, fallback: string) {
  const s = str(v);
  return s.startsWith("/") && !s.startsWith("//") ? s.slice(0, LIMITS.sourcePage) : fallback;
}

/* Validation ------------------------------------------------------------- */

function common(input: Record<string, unknown>) {
  const name = str(input.name);
  const email = str(input.email).toLowerCase();
  const company = str(input.company);
  const errors: Errors<LeadFields> = {};
  if (!name) errors.name = "Enter your name.";
  else if (name.length > LIMITS.name) errors.name = `Keep your name under ${LIMITS.name} characters.`;
  const e = emailError(email);
  if (e) errors.email = e;
  if (!company) errors.company = "Enter your company or organisation.";
  else if (company.length > LIMITS.company) errors.company = `Keep the company name under ${LIMITS.company} characters.`;
  const p = phoneOf(input);
  if (p.error) errors.phone = p.error;
  if (!hasConsent(input.consent)) errors.consent = "Tick the box so we can store your details and reply.";
  return { name, email, company, phone: p.phone, errors };
}

export function validateContact(input: Record<string, unknown>) {
  const { name, email, company, phone, errors: base } = common(input);
  const errors: Errors<ContactFields> = { ...base };
  const role = str(input.role);
  const interest = str(input.interest);
  const message = str(input.message);
  if (role.length > LIMITS.role) errors.role = `Keep the role under ${LIMITS.role} characters.`;
  if (!interests.some((i) => i.value === interest)) errors.interest = "Choose what you're interested in.";
  if (message.length > LIMITS.message) errors.message = `Keep the message under ${LIMITS.message} characters.`;
  const ok = Object.keys(errors).length === 0;
  const sourcePage = sourcePageOf(input.sourcePage, "/contact");
  return ok
    ? {
        ok: true as const,
        data: { name, email, company, phone, role, interest: interest as Interest, message, sourcePage } satisfies ContactData,
      }
    : { ok: false as const, errors };
}

export function validateLead(input: Record<string, unknown>) {
  const { name, email, company, phone, errors } = common(input);
  const sourcePage = sourcePageOf(input.sourcePage, "/products/iaac");
  return Object.keys(errors).length === 0
    ? { ok: true as const, data: { name, email, company, phone, sourcePage } satisfies LeadData }
    : { ok: false as const, errors };
}

export function interestTag(value: Interest) {
  return interests.find((i) => i.value === value)?.tag ?? "Enquiry";
}

/** Subject line for the email you receive, e.g. "[IAAC question] Acme Corp — Asha Rao". */
export function contactSubject(d: ContactData) {
  return `[${interestTag(d.interest)}] ${d.company} — ${d.name}`;
}

export function leadSubject(d: LeadData) {
  return `[IAAC overview request] ${d.company} — ${d.name}`;
}
