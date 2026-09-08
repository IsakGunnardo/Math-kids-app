import type { Point } from '../data/types.ts';

/**
 * Banan är en höjdprofil i världspixlar. y < 0 är uppåt, 0 är marknivån
 * vid start. Nyckelpunkter mjukas ut med cosinus så backarna blir runda.
 */
const KEYS: Point[] = [
  { x: -400, y: 0 },
  { x: 1200, y: 0 },
  // Små gupp
  { x: 1500, y: -30 },
  { x: 1800, y: 0 },
  { x: 2100, y: -35 },
  { x: 2400, y: 0 },
  // Backen
  { x: 3400, y: -200 },
  { x: 3800, y: -200 },
  { x: 4600, y: 0 },
  { x: 5300, y: 0 },
  // Hoppet: ramp upp och sedan ett stup
  { x: 5800, y: -100 },
  { x: 5860, y: -100 },
  { x: 5861, y: 0 },
  { x: 6800, y: 0 },
  // Stora backen
  { x: 8200, y: -500 },
  { x: 8600, y: -500 },
  { x: 9900, y: 0 },
  { x: 11200, y: 0 },
];

export const TRACK_START_X = 300;
export const FINISH_X = 10600;
export const TRACK_END_X = 11200;
const SAMPLE = 40;

export interface Track {
  points: Point[];
  groundY: (x: number) => number;
}

function interp(x: number): number {
  for (let i = 0; i < KEYS.length - 1; i++) {
    const a = KEYS[i];
    const b = KEYS[i + 1];
    if (x >= a.x && x <= b.x) {
      const t = (x - a.x) / Math.max(1, b.x - a.x);
      const s = 0.5 - 0.5 * Math.cos(t * Math.PI);
      return a.y + (b.y - a.y) * s;
    }
  }
  return x < KEYS[0].x ? KEYS[0].y : KEYS[KEYS.length - 1].y;
}

/** Skapar banan en gång; samplad tätt så fysik och rendering ser samma mark. */
export function buildTrack(): Track {
  const points: Point[] = [];
  for (let x = KEYS[0].x; x <= TRACK_END_X; x += SAMPLE) {
    points.push({ x, y: interp(x) });
  }
  // Stupet behöver sina exakta kanter för att bli ett riktigt hopp.
  for (const k of KEYS) {
    if (!points.some((p) => p.x === k.x)) points.push({ x: k.x, y: k.y });
  }
  points.sort((a, b) => a.x - b.x);
  return { points, groundY: interp };
}
