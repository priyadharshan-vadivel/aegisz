import { defineConfig } from "@playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: ".",
  testMatch: "shots.spec.ts",
  outputDir: "../test-results",
  reporter: "list",
  timeout: 60_000,
  use: { baseURL },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } },
    { name: "narrow", use: { viewport: { width: 360, height: 740 }, isMobile: true } },
  ],
});
