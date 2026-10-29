import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { files, leads } from "./schema";
import type { LeadRecord, SaveLead } from "../leads";

/* Neon (Postgres over HTTP) via Drizzle. DATABASE_URL is set by the Vercel Neon integration. */

let cached: ReturnType<typeof drizzle> | null = null;

export function db() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  cached ??= drizzle(neon(url));
  return cached;
}

/** A SaveLead for the submit flow, or null when no database is configured. */
export function dbSaveLead(): SaveLead | null {
  const d = db();
  if (!d) return null;
  return async (lead: LeadRecord) => {
    const [row] = await d.insert(leads).values(lead).returning({ id: leads.id });
    return row;
  };
}

/** A stored private file (e.g. the IAAC overview PDF), or null. */
export async function readStoredFile(key: string) {
  const d = db();
  if (!d) return null;
  const [row] = await d.select().from(files).where(eq(files.key, key)).limit(1);
  return row ?? null;
}
