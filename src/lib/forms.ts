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

export type ContactFields = "name" | "email" | "company" | "role" | "interest" | "message";
export type LeadFields = "name" | "email" | "company";
export type Errors<F extends string> = Partial<Record<F, string>>;

export type ContactData = { name: string; email: string; company: string; role: string; interest: Interest; message: string };
export type LeadData = { name: string; email: string; company: string };

/** The hidden honeypot input. Humans never see or fill it. */
export const HONEYPOT = "website";

const LIMITS = { name: 120, email: 254, company: 160, role: 120, message: 4000 } as const;

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
  return { name, email, company, errors };
}

export function validateContact(input: Record<string, unknown>) {
  const { name, email, company, errors: base } = common(input);
  const errors: Errors<ContactFields> = { ...base };
  const role = str(input.role);
  const interest = str(input.interest);
  const message = str(input.message);
  if (role.length > LIMITS.role) errors.role = `Keep the role under ${LIMITS.role} characters.`;
  if (!interests.some((i) => i.value === interest)) errors.interest = "Choose what you're interested in.";
  if (message.length > LIMITS.message) errors.message = `Keep the message under ${LIMITS.message} characters.`;
  const ok = Object.keys(errors).length === 0;
  return ok
    ? { ok: true as const, data: { name, email, company, role, interest: interest as Interest, message } satisfies ContactData }
    : { ok: false as const, errors };
}

export function validateLead(input: Record<string, unknown>) {
  const { name, email, company, errors } = common(input);
  return Object.keys(errors).length === 0
    ? { ok: true as const, data: { name, email, company } satisfies LeadData }
    : { ok: false as const, errors };
}

export function interestTag(value: Interest) {
  return interests.find((i) => i.value === value)?.tag ?? "Enquiry";
}

/** Subject line for the email you receive, e.g. "[IAAC demo] Acme Corp — Asha Rao". */
export function contactSubject(d: ContactData) {
  return `[${interestTag(d.interest)}] ${d.company} — ${d.name}`;
}

export function leadSubject(d: LeadData) {
  return `[IAAC overview download] ${d.company} — ${d.name}`;
}
