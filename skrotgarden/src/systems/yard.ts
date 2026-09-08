import type { CarBuild, SlotId } from '../data/types.ts';
import { partsInSlot } from '../data/parts.ts';

/** Man får ha flera likadana hjulpar (upp till fyra fästen), annars en av varje. */
const MAX_WHEEL_COPIES = 4;

/** Alla delar spelaren äger: lösa + monterade. */
export function ownedParts(car: CarBuild, inventory: string[]): string[] {
  const mounted = Object.values(car.parts).filter((id): id is string => !!id);
  return [...inventory, ...mounted, ...(car.chassis ? [car.chassis] : [])];
}

function candidates(slot: SlotId, owned: string[]): string[] {
  const count = (id: string) => owned.filter((x) => x === id).length;
  const pool = partsInSlot(slot);
  const fresh = pool.filter((p) => count(p.id) === 0);
  if (fresh.length) return fresh.map((p) => p.id);
  if (slot === 'wheel') return pool.filter((p) => count(p.id) < MAX_WHEEL_COPIES).map((p) => p.id);
  return [];
}

/** Finns det något kvar att plocka i högen? */
export function pileHasParts(slot: SlotId, owned: string[]): boolean {
  return candidates(slot, owned).length > 0;
}

/** Slumpar en ny del ur högen: helst en man inte har. null om högen är tom. */
export function choosePart(slot: SlotId, owned: string[], random = Math.random): string | null {
  const c = candidates(slot, owned);
  return c.length ? c[Math.floor(random() * c.length)] : null;
}

/** Delmål på banan som ger nya plock. x i världspixlar. */
export const CHECKPOINTS: { x: number; picks: number }[] = [
  { x: 3800, picks: 1 }, // uppe på första backen
  { x: 6000, picks: 1 }, // landat efter hoppet
  { x: 8600, picks: 1 }, // uppe på stora backen
  { x: 10600, picks: 2 }, // målflaggan
];

export const START_PICKS = 4;
