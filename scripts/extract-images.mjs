#!/usr/bin/env node
/**
 * Extracts the base64-encoded images embedded in the original design export
 * into real files under /public/images. This keeps the React/TS source free
 * of giant base64 blobs while still serving real image assets.
 *
 * Source lookup order:
 *   1. reference/source.html   (recommended — `git mv index-36.html reference/source.html`)
 *   2. index-36.html           (repo root, the original export)
 *
 * Idempotent: if the expected images already exist it does nothing, so it is
 * safe to run on every `dev` / `build` (wired via predev/prebuild).
 *
 * Output: /public/images/img-01.png … img-21.jpg  (favicon, og image, hero,
 * products p1–p9, gallery, fabrics). See src/data/catalog.ts for the mapping.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "public", "images");

const SOURCES = [join(root, "reference", "source.html"), join(root, "index-36.html")];
const srcPath = SOURCES.find((p) => existsSync(p));

const EXT = { jpeg: "jpg", jpg: "jpg", png: "png", webp: "webp", gif: "gif", "svg+xml": "svg" };

function alreadyExtracted() {
  if (!existsSync(outDir)) return false;
  const files = readdirSync(outDir).filter((f) => /^img-\d+\.\w+$/.test(f));
  return files.length >= 21;
}

function isB64(code) {
  return (
    (code >= 65 && code <= 90) ||
    (code >= 97 && code <= 122) ||
    (code >= 48 && code <= 57) ||
    code === 43 ||
    code === 47 ||
    code === 61
  );
}

function main() {
  if (alreadyExtracted()) {
    console.log("[extract-images] images already present — skipping.");
    return;
  }
  if (!srcPath) {
    console.warn(
      "[extract-images] source HTML not found (looked for reference/source.html, index-36.html). " +
        "Skipping image extraction — product images will be missing until the source is restored."
    );
    return;
  }

  mkdirSync(outDir, { recursive: true });
  const html = readFileSync(srcPath, "utf8");
  const N = html.length;

  const NEEDLE = "data:image/";
  const MARK = ";base64,";
  const seen = new Map();
  let cursor = 0;
  let index = 0;
  let written = 0;

  while (true) {
    const at = html.indexOf(NEEDLE, cursor);
    if (at === -1) break;
    const semi = html.indexOf(MARK, at);
    if (semi === -1 || semi - at > 40) {
      cursor = at + NEEDLE.length;
      continue;
    }
    const type = html.slice(at + NEEDLE.length, semi).toLowerCase();
    let p = semi + MARK.length;
    const start = p;
    while (p < N && isB64(html.charCodeAt(p))) p++;
    const b64 = html.slice(start, p);
    cursor = p;

    if (seen.has(b64)) continue;
    seen.set(b64, true);
    index += 1; // keep numbering stable even if we skip an empty blob

    const buf = Buffer.from(b64, "base64");
    if (buf.length < 8) continue; // skip placeholder/empty blobs (e.g. code-comment example)

    const ext = EXT[type] || "bin";
    const name = `img-${String(index).padStart(2, "0")}.${ext}`;
    writeFileSync(join(outDir, name), buf);
    written += 1;
  }

  console.log(`[extract-images] wrote ${written} images to public/images (source: ${srcPath.replace(root, ".")}).`);
}

main();
