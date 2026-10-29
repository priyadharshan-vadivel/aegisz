import { customType, index, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/*
 * Leads from the contact and IAAC-download forms, plus the private files table that holds the
 * IAAC overview PDF (the public repo can't). Change this file, then `npm run db:generate`.
 */

export const leadType = pgEnum("lead_type", ["contact", "download"]);

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    type: leadType("type").notNull(),
    name: text("name").notNull(),
    workEmail: text("work_email").notNull(),
    phone: text("phone").notNull(), // E.164
    company: text("company").notNull(),
    role: text("role"),
    interest: text("interest"),
    message: text("message"),
    consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),
    sourcePage: text("source_page").notNull(),
    ipHash: text("ip_hash"), // HMAC of the IP, never the raw address
    userAgent: text("user_agent"),
  },
  (t) => [index("leads_created_at_idx").on(t.createdAt), index("leads_work_email_idx").on(t.workEmail)],
);

const bytea = customType<{ data: Buffer; driverData: Buffer | string }>({
  dataType: () => "bytea",
  fromDriver: (v) => (typeof v === "string" ? Buffer.from(v.replace(/^\\x/, ""), "hex") : Buffer.from(v)),
});

export const files = pgTable("files", {
  key: text("key").primaryKey(),
  contentType: text("content_type").notNull(),
  bytes: bytea("bytes").notNull(),
  sha256: text("sha256").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
