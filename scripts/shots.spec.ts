import { test, expect } from "@playwright/test";
import path from "node:path";

// Routes to capture. Override with ROUTES="/,/products".
const ROUTES = (process.env.ROUTES ?? "/").split(",").map((r) => r.trim());
const OUT = path.resolve(__dirname, "../screenshots");

for (const route of ROUTES) {
  test(`shot ${route}`, async ({ page }, info) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route, { waitUntil: "load" });

    // Reveal-on-scroll content: scroll through so everything is painted.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(700);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `horizontal overflow on ${route}`).toBeLessThanOrEqual(0);

    if (info.project.name === "narrow") return; // overflow check only
    const name = route === "/" ? "home" : route.slice(1).replaceAll("/", "_");
    await page.screenshot({ path: path.join(OUT, `${name}.${info.project.name}.png`), fullPage: true });
  });
}
