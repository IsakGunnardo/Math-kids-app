/**
 * Gör magenta-bakgrund transparent i EN bild och skalar den till asset-måttet.
 * Kör: node scripts/key-image.mjs <bild.png> <asset-sökväg>   t.ex. bg/track_hills
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_IMAGES } from '../src/data/assets.ts';
import { keyOut, readRaw } from './lib/chroma.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [file, name] = process.argv.slice(2);
const asset = ALL_IMAGES.find((a) => a.path === name);
if (!file || !asset) {
  console.error('Användning: node scripts/key-image.mjs <bild> <asset-sökväg>');
  process.exit(1);
}
const raw = keyOut(await readRaw(file));
const out = resolve(root, 'public/assets', `${asset.path}.png`);
mkdirSync(dirname(out), { recursive: true });
await sharp(raw.data, { raw: { width: raw.width, height: raw.height, channels: 4 } })
  .resize(asset.width, asset.height, { fit: 'cover' })
  .png()
  .toFile(out);
console.log(`Skrev ${asset.path}.png`);
