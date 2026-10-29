import { defineConfig } from "drizzle-kit";

// Locally, DATABASE_URL comes from .env.local or .env (`vercel env pull`). On Vercel it's set by the Neon integration.
// The first file to set a variable wins, so .env.local overrides .env.
for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {}
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/server/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
});
