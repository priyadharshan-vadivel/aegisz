/*
 * Builds the site icons from the brand mark (brand/aegisz-logo-icon.png, black on white):
 *   src/app/favicon.ico     16, 32, 48 (PNG-in-ICO)
 *   src/app/icon.png        512x512
 *   src/app/apple-icon.png  180x180
 * The mark is drawn light on the site's dark background so it reads on light and dark
 * search themes. Run: node scripts/make-icons.mjs
 */
import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const SRC = "brand/aegisz-logo-icon.png";
const BG = { r: 5, g: 5, b: 5 }; // --ae-bg (#050505)
const FG = 236; // #ececee-ish, matches the light mark in public/favicon.svg

/** The mark alone, light on dark, trimmed to its bounds. */
async function mark() {
  // The source's paper is off-white, so snap it to pure black/white first. Separate passes:
  // sharp would otherwise reorder trim ahead of the colour operations.
  const bw = await sharp(SRC).greyscale().threshold(128).negate().png().toBuffer(); // white mark on black
  const { data, info } = await sharp(bw).trim({ background: "#000000", threshold: 10 }).png().toBuffer({ resolveWithObject: true });
  const buf = await sharp(data).linear((FG - BG.r) / 255, BG.r).png().toBuffer(); // black → bg, white → fg
  return { buf, w: info.width, h: info.height };
}

/** Square icon: the mark centred, filling `fill` of the side (the rest is padding). */
async function square(m, size, fill) {
  const box = Math.round(size * fill);
  const inner = await sharp(m.buf)
    .resize(box, box, { fit: "contain", background: { ...BG, alpha: 1 }, kernel: "lanczos3" })
    .toBuffer();
  return sharp({ create: { width: size, height: size, channels: 3, background: BG } })
    .composite([{ input: inner, gravity: "centre" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** ICO container holding PNG images (supported by every current browser). */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // icon
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, png }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4); // planes
    e.writeUInt16LE(32, 6); // bpp
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += png.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...images.map((i) => i.png)]);
}

const m = await mark();
// Small sizes get less padding so the thin strokes survive.
const favicons = await Promise.all([16, 32, 48].map(async (size) => ({ size, png: await square(m, size, 0.86) })));
await writeFile("src/app/favicon.ico", ico(favicons));
await writeFile("src/app/icon.png", await square(m, 512, 0.62));
await writeFile("src/app/apple-icon.png", await square(m, 180, 0.62));
console.log(`mark ${m.w}x${m.h} → favicon.ico (16/32/48), icon.png (512), apple-icon.png (180)`);
