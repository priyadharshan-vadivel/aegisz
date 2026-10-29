import { defineConfig } from "drizzle-kit";

// Locally, DATABASE_URL comes from .env (`vercel env pull .env`). On Vercel it's set by the Neon integration.
try {
  process.loadEnvFile(".env");
} catch {}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/server/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
});
