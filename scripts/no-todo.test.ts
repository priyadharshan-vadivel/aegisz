// Run: npm test (after `npm run build`). Fails if "TODO" is visible on any prerendered page.
// Placeholders belong in code comments, never in rendered copy.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const APP = path.join(process.cwd(), ".next", "server", "app");

function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f);
    return statSync(p).isDirectory() ? htmlFiles(p) : p.endsWith(".html") ? [p] : [];
  });
}

/** Visible text only: drop scripts, styles and tags (React's hidden data payload lives in <script>). */
export function visibleText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ");
}

test("visibleText ignores scripts and tags", () => {
  assert.equal(visibleText('<p>Hi</p><script>"TODO"</script><!-- TODO -->').includes("TODO"), false);
  assert.equal(visibleText("<p>TODO: proof</p>").includes("TODO"), true);
});

test("no rendered page shows TODO", { skip: !existsSync(APP) && "run `npm run build` first" }, () => {
  const files = htmlFiles(APP);
  assert.ok(files.length > 5, `expected prerendered pages in ${APP}`);
  const offenders = files.filter((f) => /\bTODO\b/.test(visibleText(readFileSync(f, "utf8"))));
  assert.deepEqual(offenders.map((f) => path.relative(APP, f)), []);
});
