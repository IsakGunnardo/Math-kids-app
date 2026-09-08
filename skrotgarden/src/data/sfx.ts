/** Ljudeffekter. Filer ligger i /public/assets/sfx/<id>.wav (platshållare) eller .mp3. */
export interface SfxInfo {
  id: string;
  label: string;
  /** Ungefärlig längd i sekunder. */
  seconds: number;
  loop?: boolean;
}

export const SFX: SfxInfo[] = [
  { id: 'pick', label: 'Plocka upp en del', seconds: 0.15 },
  { id: 'snap', label: 'Del snäpper fast', seconds: 0.2 },
  { id: 'nope', label: 'Del passar inte (mjukt, inte negativt)', seconds: 0.25 },
  { id: 'engine', label: 'Motor-loop', seconds: 1.0, loop: true },
  { id: 'horn', label: 'Tuta', seconds: 0.5 },
  { id: 'bubbles', label: 'Bubblor', seconds: 0.6 },
  { id: 'clunk', label: 'Skruv trillar av', seconds: 0.3 },
  { id: 'whoosh', label: 'Scenbyte', seconds: 0.4 },
  { id: 'cheer', label: 'Hurra! (klarade backen)', seconds: 1.0 },
  { id: 'sparkle', label: 'Glitter', seconds: 0.5 },
];
