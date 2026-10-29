import { createHmac } from "node:crypto";
import type { ContactData, LeadData } from "../forms.ts";

/*
 * The row we store for each form submission. Pure (no DB import) so the submit flow and its
 * tests can build records without a database.
 */

export type LeadRecord = {
  type: "contact" | "download";
  name: string;
  workEmail: string;
  phone: string;
  company: string;
  role: string | null;
  interest: string | null;
  message: string | null;
  consentAt: Date;
  sourcePage: string;
  ipHash: string | null;
  userAgent: string | null;
};

export type SaveLead = (lead: LeadRecord) => Promise<{ id: string }>;

/** Keyed hash of the client IP: lets us spot repeat abuse without storing the address. */
export function hashIp(ip: string, secret: string | undefined) {
  if (!secret || !ip || ip === "unknown") return null;
  return createHmac("sha256", secret).update(ip).digest("hex");
}

const ua = (s: string) => (s ? s.slice(0, 400) : null);

export function contactRecord(d: ContactData, at: Date, ipHash: string | null, userAgent: string): LeadRecord {
  return {
    type: "contact",
    name: d.name,
    workEmail: d.email,
    phone: d.phone,
    company: d.company,
    role: d.role || null,
    interest: d.interest,
    message: d.message || null,
    consentAt: at,
    sourcePage: d.sourcePage,
    ipHash,
    userAgent: ua(userAgent),
  };
}

export function downloadRecord(d: LeadData, at: Date, ipHash: string | null, userAgent: string): LeadRecord {
  return {
    type: "download",
    name: d.name,
    workEmail: d.email,
    phone: d.phone,
    company: d.company,
    role: null,
    interest: "iaac-overview",
    message: null,
    consentAt: at,
    sourcePage: d.sourcePage,
    ipHash,
    userAgent: ua(userAgent),
  };
}
