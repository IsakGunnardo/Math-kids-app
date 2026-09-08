import type { ChassisPart, MountKey, Point, SlotId } from '../data/types.ts';
import { SLOTS } from '../data/slots.ts';
import { BODY_MOUNTS } from './build.ts';

/** Bilen ritas förstorad i garaget så att små fingrar träffar. */
export const CAR_SCALE = 1.4;
export const CAR_ORIGIN: Point = { x: 330, y: 250 };
/** Hur nära (designpixlar) en del måste vara för att snappa. */
export const SNAP_RADIUS = 120;

export type TargetKey = MountKey | 'chassis';

/** En plats en del kan släppas på. Mittpunkt i scenkoordinater. */
export interface Target {
  key: TargetKey;
  slot: SlotId;
  x: number;
  y: number;
}

export function carFrame(origin = CAR_ORIGIN, scale = CAR_SCALE) {
  return {
    x: origin.x,
    y: origin.y,
    width: SLOTS.chassis.width * scale,
    height: SLOTS.chassis.height * scale,
  };
}

/** Chassits fästpunkter översatta till scenkoordinater. */
export function mountTargets(
  chassis: ChassisPart | undefined,
  origin = CAR_ORIGIN,
  scale = CAR_SCALE,
): Target[] {
  if (!chassis) return [];
  const at = (key: TargetKey, slot: SlotId, p: Point): Target => ({
    key,
    slot,
    x: origin.x + p.x * scale,
    y: origin.y + p.y * scale,
  });
  return [
    ...chassis.wheelMounts.map((p, i) => at(`wheel_${i}`, 'wheel', p)),
    ...BODY_MOUNTS.map((m) => at(m, m, chassis.mounts[m])),
  ];
}

export function chassisTarget(origin = CAR_ORIGIN, scale = CAR_SCALE): Target {
  const f = carFrame(origin, scale);
  return { key: 'chassis', slot: 'chassis', x: f.x + f.width / 2, y: f.y + f.height / 2 };
}

/** Närmaste kompatibla plats inom snapp-radien, annars null. */
export function findSnap(slot: SlotId, x: number, y: number, targets: Target[]): Target | null {
  if (slot === 'chassis') {
    const t = chassisTarget();
    return Math.hypot(t.x - x, t.y - y) < SNAP_RADIUS * 2.2 ? t : null;
  }
  let best: Target | null = null;
  let bestDist = SNAP_RADIUS;
  for (const t of targets) {
    if (t.slot !== slot) continue;
    const d = Math.hypot(t.x - x, t.y - y);
    if (d < bestDist) {
      bestDist = d;
      best = t;
    }
  }
  return best;
}
