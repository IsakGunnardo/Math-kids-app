/**
 * Klipper ett sprite-ark (magenta bakgrund) i separata PNG-assets.
 * Kör: node scripts/slice-sheet.mjs <ark.png> <rader> <asset1> <asset2> ...
 *   t.ex. node scripts/slice-sheet.mjs wheels.png 2 parts/wheel_cykel parts/wheel_traktor ...
 * Hittar objekten automatiskt, i läsordning, och skalar var och en till rätt mått.
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_IMAGES } from '../src/data/assets.ts';
import { findBlobs, keyOut, readRaw } from './lib/chroma.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [file, rowsArg, ...names] = process.argv.slice(2);
if (!file || !names.length) {
  console.error('Användning: node scripts/slice-sheet.mjs <ark> <rader> <asset...>');
  process.exit(1);
}
const rows = Number(rowsArg) || 1;
const byPath = new Map(ALL_IMAGES.map((a) => [a.path, a]));

const raw = keyOut(await readRaw(file));
const blobs = findBlobs(raw, { rows });
console.log(`${blobs.length} objekt hittade (väntade ${names.length})`);
if (blobs.length !== names.length) {
  console.log(blobs.map((b) => `  ${b.x},${b.y} ${b.w}x${b.h}`).join('\n'));
}
const base = sharp(raw.data, { raw: { width: raw.width, height: raw.height, channels: 4 } }).png();
const buf = await base.toBuffer();

for (let i = 0; i < Math.min(blobs.length, names.length); i++) {
  const asset = byPath.get(names[i]);
  const b = blobs[i];
  if (!asset) { console.warn(`Okänd asset ${names[i]}`); continue; }
  const pad = 6;
  const left = Math.max(0, b.x - pad), top = Math.max(0, b.y - pad);
  const width = Math.min(raw.width - left, b.w + pad * 2), height = Math.min(raw.height - top, b.h + pad * 2);
  const out = resolve(root, 'public/assets', `${asset.path}.png`);
  mkdirSync(dirname(out), { recursive: true });
  await sharp(buf)
    .extract({ left, top, width, height })
    .resize(asset.width, asset.height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(out);
  console.log(`  ${asset.path}.png  <- ${b.w}x${b.h}`);
}
