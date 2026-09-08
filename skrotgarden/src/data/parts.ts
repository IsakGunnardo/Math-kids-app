import type { ChassisPart, Part, SlotId } from './types.ts';
import { CHASSIS } from './parts/chassis.ts';
import { WHEELS } from './parts/wheels.ts';
import { MOTORS } from './parts/motors.ts';
import { DECO } from './parts/deco.ts';

export { CHASSIS, WHEELS, MOTORS, DECO };

/** Alla delar i spelet, i katalogordning. */
export const PARTS: Part[] = [...CHASSIS, ...WHEELS, ...MOTORS, ...DECO];

const BY_ID = new Map(PARTS.map((p) => [p.id, p]));

export function getPart(id: string): Part | undefined {
  return BY_ID.get(id);
}

export function getChassis(id: string | null): ChassisPart | undefined {
  const p = id ? BY_ID.get(id) : undefined;
  return p && p.slot === 'chassis' ? (p as ChassisPart) : undefined;
}

export function partsInSlot(slot: SlotId): Part[] {
  return PARTS.filter((p) => p.slot === slot);
}

/** Delar man börjar med, så att garaget inte är tomt första gången. */
export const STARTER_KIT: string[] = ['lada', 'cykel', 'gummiband', 'styre', 'pall'];
