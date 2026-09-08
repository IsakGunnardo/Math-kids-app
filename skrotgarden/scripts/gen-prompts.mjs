/**
 * Skriver ART_PROMPTS.md och scripts/art-prompts.json: en färdig prompt per
 * bild-asset, med modellinställningar, så att genereringen kan köras i ett svep.
 * Kör: node scripts/gen-prompts.mjs
 */
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_IMAGES } from '../src/data/assets.ts';
import { DESCRIPTIONS, ISOLATED, STYLE } from './lib/artDescriptions.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** Närmaste bildförhållande modellen stödjer. */
function ratio(w, h) {
  const options = { '1:1': 1, '4:3': 4 / 3, '3:4': 3 / 4, '16:9': 16 / 9, '9:16': 9 / 16, '3:2': 1.5, '2:3': 2 / 3 };
  const r = w / h;
  return Object.entries(options).sort((a, b) => Math.abs(a[1] - r) - Math.abs(b[1] - r))[0][0];
}

const entries = ALL_IMAGES.map((a) => {
  const what = DESCRIPTIONS[a.path];
  const isolated = a.kind !== 'bg';
  const extra =
    a.kind === 'bg' && a.path !== 'bg/track_ground'
      ? 'Wide landscape composition, no characters.'
      : a.kind === 'char'
        ? 'Full body visible, feet at the bottom edge, friendly expression.'
        : a.kind === 'part' && a.slot === 'chassis'
          ? 'Leave empty space along the bottom where wheels will be attached.'
          : '';
  return {
    path: a.path,
    width: a.width,
    height: a.height,
    aspect_ratio: ratio(a.width, a.height),
    removeBackground: isolated,
    model: 'recraft_v4_1',
    params: { model_type: 'standard', resolution: '1k', background_color: isolated ? '#FFFFFF' : undefined },
    prompt: [what, extra, isolated ? ISOLATED : '', STYLE].filter(Boolean).join(' '),
    missing: !what,
  };
});

writeFileSync(resolve(root, 'scripts/art-prompts.json'), JSON.stringify(entries, null, 2));

const md = `# Skrotgården – bildprompter

Genererad av \`node scripts/gen-prompts.mjs\`. En rad per asset i ASSETS.md.
Modell: Recraft V4.1 (standard, 1k), vit bakgrund + bakgrundsborttagning för
allt utom bakgrunder. Efter generering: lägg filerna i en mapp med namn
\`<kategori>_<id>.png\` (t.ex. \`parts_wheel_cykel.png\`) och kör
\`node scripts/import-art.mjs <mapp>\` som skalar till rätt mått och lägger
dem i \`public/assets/\`.

## Gemensam stil
> ${STYLE}

## Prompter
| Asset | Mått | Ratio | Prompt |
|---|---|---|---|
${entries.map((e) => `| \`${e.path}\` | ${e.width}×${e.height} | ${e.aspect_ratio} | ${e.prompt.replace(STYLE, '').trim()} |`).join('\n')}
`;
writeFileSync(resolve(root, 'ART_PROMPTS.md'), md);
const missing = entries.filter((e) => e.missing).map((e) => e.path);
console.log(`${entries.length} prompter skrivna${missing.length ? `, SAKNAR beskrivning: ${missing.join(', ')}` : ''}`);
