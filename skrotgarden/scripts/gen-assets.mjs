/**
 * Genererar platshållar-SVG:er för alla bild-assets och skriver ASSETS.md.
 * Kör: npm run gen:assets   (Node ≥ 22.18 läser .ts direkt.)
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_IMAGES, STAGE } from '../src/data/assets.ts';
import { SFX } from '../src/data/sfx.ts';
import { SLOTS, SLOT_ORDER } from '../src/data/slots.ts';
import { CHASSIS } from '../src/data/parts/chassis.ts';
import { placeholderSvg } from './lib/svg.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = resolve(root, 'public/assets');

let written = 0;
for (const a of ALL_IMAGES) {
  const file = resolve(assetsDir, `${a.path}.svg`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, placeholderSvg(a));
  written++;
}

const hasPng = (a) => (existsSync(resolve(assetsDir, `${a.path}.png`)) ? '✅' : '⬜');
const row = (a) => `| \`${a.path}.png\` | ${a.width}×${a.height} | ${a.label} | ${a.note ?? ''} | ${hasPng(a)} |`;
const table = (items) =>
  ['| Fil | Mått (px) | Vad | Anteckning | PNG finns |', '|---|---|---|---|---|', ...items.map(row)].join('\n');
const byKind = (k) => ALL_IMAGES.filter((a) => a.kind === k);

const md = `# Skrotgården – assets

Genererad av \`npm run gen:assets\` från \`src/data/\`. Redigera inte för hand.

## Så funkar det
- Alla bilder ligger i \`public/assets/\` och är **PNG med transparens** (utom bakgrunder).
- Platshållare är **SVG med samma basnamn**. Spelet laddar \`.png\` först och faller
  tillbaka på \`.svg\` – **droppa bara in PNG-filen så används den direkt**.
- Måtten nedan är 1x. Rita gärna i **2x** (dubbla måtten) och exportera i 1x-måttet,
  eller leverera 2x – spelet skalar ändå till en designyta på ${STAGE.width}×${STAGE.height}.
- Namngivning: \`parts/<slot>_<id>.png\`, \`bg/<scen>.png\`, \`char/<namn>_<pose>.png\`,
  \`ui/btn_<namn>.png\`, \`props/pile_<slot>.png\`.
- Delar ritas **från sidan, vända åt höger** (körriktning). Hjul ritas centrerade.
- Chassin: hjul och övriga delar snappar mot fasta punkter i chassi-bilden (se nedan),
  så rita chassit så att golvlinjen ligger i nedre delen av bilden.

## Sprite-mått per slot
| Slot | Mått (px) | Antal delar |
|---|---|---|
${SLOT_ORDER.map((s) => `| ${SLOTS[s].name} (\`${s}\`) | ${SLOTS[s].width}×${SLOTS[s].height} | ${byKind('part').filter((a) => a.slot === s).length} |`).join('\n')}

## Fästpunkter i chassin (px från övre vänstra hörnet i 512×256)
${CHASSIS.map(
  (c) =>
    `- **${c.name}** (\`${c.id}\`): hjul ${c.wheelMounts.map((p) => `(${p.x},${p.y})`).join(' ')} · ` +
    Object.entries(c.mounts)
      .map(([k, p]) => `${k} (${p.x},${p.y})`)
      .join(' · '),
).join('\n')}

## Delar
${table(byKind('part'))}

## Bakgrunder
${table(byKind('bg'))}

## Figurer
Alla poser för samma figur ska ha fötterna på samma höjd så de kan bytas rakt av.

${table(byKind('char'))}

## Knappar och UI
Rund/rundad form, tydlig symbol, ingen text.

${table(byKind('ui'))}

## Högar på skrotgården
${table(byKind('props'))}

## Ljud
Ligger i \`public/assets/sfx/<id>.wav\` (platshållare, genererade av \`npm run gen:sfx\`).
Riktiga ljud levereras som \`.mp3\` eller \`.wav\` med samma basnamn; \`.mp3\` vinner om den finns.

| Fil | Längd | Vad | Loop |
|---|---|---|---|
${SFX.map((s) => `| \`sfx/${s.id}.wav\` | ~${s.seconds}s | ${s.label} | ${s.loop ? 'ja' : ''} |`).join('\n')}
`;

writeFileSync(resolve(root, 'ASSETS.md'), md);
console.log(`Skrev ${written} platshållar-SVG:er och ASSETS.md`);
