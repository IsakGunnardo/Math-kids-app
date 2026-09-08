/** Genererar platshållar-WAV:ar för alla ljud i data/sfx.ts. Kör: npm run gen:sfx */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SFX } from '../src/data/sfx.ts';
import { toWav } from './lib/wav.mjs';
import { SYNTH } from './lib/synth.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dir = resolve(root, 'public/assets/sfx');
mkdirSync(dir, { recursive: true });

for (const s of SFX) {
  const synth = SYNTH[s.id];
  if (!synth) {
    console.warn(`Ingen synth för ${s.id} – hoppar över`);
    continue;
  }
  writeFileSync(resolve(dir, `${s.id}.wav`), toWav(synth(s.seconds)));
}
console.log(`Skrev ${SFX.length} platshållarljud till public/assets/sfx/`);
