import type { SlotId } from './types.ts';
import { PARTS } from './parts.ts';
import { SLOTS, SLOT_ORDER } from './slots.ts';

export type AssetKind = 'part' | 'bg' | 'char' | 'ui' | 'props';

/** En bild-asset. `path` är utan filändelse och relativt /public/assets/. */
export interface ImageAsset {
  path: string;
  kind: AssetKind;
  width: number;
  height: number;
  label: string;
  color: string;
  /** För delar: vilken slot (styr platshållarens form). */
  slot?: SlotId;
  /** Kort beskrivning för den som ska rita riktig grafik. */
  note?: string;
}

/** Spelets designupplösning. Scenen skalas till skärmen med bevarad aspekt. */
export const STAGE = { width: 1600, height: 1000 } as const;

export const BACKGROUNDS: ImageAsset[] = [
  { path: 'bg/yard', kind: 'bg', width: 2048, height: 1280, label: 'Skrotgården', color: '#c9a36b', note: 'Gård med staket, himmel, plats för högar i nedre halvan.' },
  { path: 'bg/garage', kind: 'bg', width: 2048, height: 1280, label: 'Garaget', color: '#7f8c8d', note: 'Verkstad, tomt golv i mitten (bilen ritas ovanpå), hyllor längs kanterna.' },
  { path: 'bg/track_sky', kind: 'bg', width: 2048, height: 1280, label: 'Bana: himmel', color: '#9fd3f5', note: 'Bakersta parallaxlagret. Kaklas horisontellt – kanterna måste matcha.' },
  { path: 'bg/track_hills', kind: 'bg', width: 2048, height: 640, label: 'Bana: kullar', color: '#7cc47a', note: 'Mellanlager, transparent ovanför kullarna. Kaklas horisontellt.' },
  { path: 'bg/track_ground', kind: 'bg', width: 256, height: 256, label: 'Bana: mark', color: '#8d6e4a', note: 'Kaklad marktextur (gräs/jord), sömlös i x-led.' },
];

export const CHARACTERS: ImageAsset[] = (
  [
    ['skruvis', 'Skruvis', '#d35400', 'Rostig, snäll robot-mekaniker med skruvmejsel-hand.'],
    ['mira', 'Mira', '#16a085', 'Barn i overall och för stor hjälm.'],
  ] as const
).flatMap(([id, name, color, note]) =>
  (['idle', 'wave', 'cheer', 'think'] as const).map((pose) => ({
    path: `char/${id}_${pose}`,
    kind: 'char' as const,
    width: 384,
    height: 512,
    label: `${name} (${pose})`,
    color,
    note,
  })),
);

export const UI: ImageAsset[] = [
  ['btn_yard', 'Knapp: till skrotgården', 'Hög med skrot.'],
  ['btn_garage', 'Knapp: till garaget', 'Litet hus med skiftnyckel.'],
  ['btn_drive', 'Knapp: provkör', 'Bil med fartstreck.'],
  ['btn_gas', 'Knapp: gas', 'Grön pil uppåt / fot på pedal.'],
  ['btn_brake', 'Knapp: broms', 'Röd hand / stopp.'],
  ['btn_reset', 'Knapp: börja om', 'Rund pil.'],
  ['btn_save', 'Knapp: spara bil', 'Stjärna/hjärta.'],
  ['btn_sound', 'Knapp: ljud på/av', 'Högtalare.'],
].map(([id, label, note]) => ({
  path: `ui/${id}`,
  kind: 'ui' as const,
  width: 128,
  height: 128,
  label,
  color: '#34495e',
  note,
}));

UI.push({
  path: 'ui/rotate',
  kind: 'ui',
  width: 256,
  height: 256,
  label: 'Vrid enheten (visas i porträttläge)',
  color: '#ffffff',
  note: 'Surfplatta som roterar till landskap.',
});

export const PROPS: ImageAsset[] = SLOT_ORDER.map((slot) => ({
  path: `props/pile_${slot}`,
  kind: 'props' as const,
  width: 320,
  height: 256,
  label: `Hög: ${SLOTS[slot].name}`,
  color: SLOTS[slot].color,
  slot,
  note: `Hög med ${SLOTS[slot].name.toLowerCase()}-delar på skrotgården.`,
}));

export const PART_IMAGES: ImageAsset[] = PARTS.map((p) => ({
  path: p.sprite,
  kind: 'part' as const,
  width: SLOTS[p.slot].width,
  height: SLOTS[p.slot].height,
  label: p.name,
  color: SLOTS[p.slot].color,
  slot: p.slot,
  note: p.quirk ? `Quirk: ${p.quirk}` : undefined,
}));

export const ALL_IMAGES: ImageAsset[] = [
  ...PART_IMAGES,
  ...BACKGROUNDS,
  ...CHARACTERS,
  ...UI,
  ...PROPS,
];
