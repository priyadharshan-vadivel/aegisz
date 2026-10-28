// One-off: build the public IAAC overview from the source deck, removing the pricing slide.
// Usage: node scripts/make-overview-pdf.mjs [source.pdf]   (default: ./IAAC-Profile.pdf)
import { readFile, writeFile } from "node:fs/promises";
import { PDFDocument } from "pdf-lib";

const PRICING_PAGE = 18; // 1-based: "Deployment & pricing"
const src = process.argv[2] ?? "IAAC-Profile.pdf";
const doc = await PDFDocument.load(await readFile(src));
const before = doc.getPageCount();
doc.removePage(PRICING_PAGE - 1);
doc.setTitle("IAAC: Intent-Aware Access Control | AegisZ");
doc.setSubject("IAAC product overview");
doc.setAuthor("AegisZ");
doc.setKeywords([]);
await writeFile("private/iaac-overview.pdf", await doc.save());
console.log(`pages: ${before} -> ${doc.getPageCount()}`);
