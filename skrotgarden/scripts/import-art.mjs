/**
 * Importerar färdig grafik: skalar/paddar varje bild till exakt asset-mått
 * (behåller proportioner, transparent utfyllnad) och skriver PNG till
 * public/assets/. Filnamn i källmappen: <kategori>_<id>.png, t.ex.
 * parts_wheel_cykel.png, bg_yard.png, char_mira_wave.png, ui_btn_gas.png.
 * Kör: node scripts/import-art.mjs <mapp> [--cover]
 */
import { readdirSync, existsSync, mkdirSync } from 'node:fs';
import { basename, dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { ALL_IMAGES } from '../src/data/assets.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = process.argv[2];
if (!src) {
  console.error('Ange källmapp: node scripts/import-art.mjs <mapp>');
  process.exit(1);
}

const byFile = new Map(ALL_IMAGES.map((a) => [a.path.replace('/', '_'), a]));
let done = 0;
for (const file of readdirSync(src)) {
  const ext = extname(file).toLowerCase();
  if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) continue;
  const key = basename(file, ext);
  const asset = byFile.get(key);
  if (!asset) {
    console.warn(`Hoppar över ${file}: ingen asset heter ${key}`);
    continue;
  }
  const out = resolve(root, 'public/assets', `${asset.path}.png`);
  mkdirSync(dirname(out), { recursive: true });
  // Bakgrunder fyller hela ytan (cover); allt annat får plats med luft (contain).
  const fit = asset.kind === 'bg' ? 'cover' : 'contain';
  await sharp(resolve(src, file))
    .resize(asset.width, asset.height, { fit, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(out);
  done++;
}
console.log(`Importerade ${done} bilder till public/assets/. Kör npm run gen:assets för att uppdatera ASSETS.md.`);
