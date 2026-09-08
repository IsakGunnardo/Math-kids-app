/**
 * Tar de genererade Higgsfield-bilderna (nedladdade till en mapp) och lägger
 * in dem i spelet: bakgrunder skalas, magenta-ark klipps i delar.
 * Filerna i mappen får heta antingen <file>.png (sky.png, wheels.png ...)
 * eller innehålla job-id:t i namnet (som Higgsfield döper dem).
 * Kör: node scripts/apply-art.mjs <mapp>
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dir = process.argv[2];
if (!dir) {
  console.error('Användning: node scripts/apply-art.mjs <mapp med nedladdade bilder>');
  process.exit(1);
}
const sheets = JSON.parse(readFileSync(resolve(root, 'scripts/art-sheets.json'), 'utf8'));
const files = readdirSync(dir);
const find = (s) =>
  files.find((f) => f.includes(s.job)) ?? files.find((f) => f.replace(/\.(png|jpe?g|webp)$/i, '') === s.file);

const run = (script, ...args) =>
  execFileSync('node', [resolve(root, 'scripts', script), ...args], { stdio: 'inherit' });

let done = 0;
for (const s of sheets) {
  const f = find(s);
  if (!f) {
    console.warn(`Saknar bild för ${s.file} (${s.asset ?? s.assets.join(', ')})`);
    continue;
  }
  const file = resolve(dir, f);
  console.log(`\n== ${s.file} ==`);
  if (s.kind === 'sheet') run('slice-sheet.mjs', file, String(s.rows), ...s.assets);
  else if (s.kind === 'key') run('key-image.mjs', file, s.asset);
  else {
    // Bakgrund: importeras via import-art som vill ha namnet <kategori>_<id>
    const tmp = resolve(dir, `${s.asset.replace('/', '_')}.png`);
    if (tmp !== file) execFileSync('cp', [file, tmp]);
    run('import-art.mjs', dir);
  }
  done++;
}
console.log(`\nKlart: ${done}/${sheets.length}. Kör sedan: npm run gen:assets && npm run build:single`);
