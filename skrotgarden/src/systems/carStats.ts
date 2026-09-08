import type { CarBuild, Part, QuirkId } from '../data/types.ts';
import { getChassis, getPart } from '../data/parts.ts';

export interface CarStats {
  weight: number;
  power: number;
  grip: number;
  comfort: number;
  wheelCount: number;
  /** ~ power / weight, 0..1-ish (klipps aldrig hårt – kul om den blir tokig). */
  topSpeed: number;
  /** ~ hjulantal + chassivikt. */
  stability: number;
  quirks: QuirkId[];
  parts: Part[];
}

/** Räknar ut bilens egenskaper ur delarna. Ren funktion, ingen rendering. */
export function computeCarStats(car: CarBuild): CarStats {
  const chassis = getChassis(car.chassis);
  const parts: Part[] = chassis ? [chassis] : [];
  for (const id of Object.values(car.parts)) {
    const p = id ? getPart(id) : undefined;
    if (p) parts.push(p);
  }

  const wheels = parts.filter((p) => p.slot === 'wheel');
  const weight = Math.max(1, parts.reduce((s, p) => s + p.weight, 0));
  const power = parts.reduce((s, p) => s + p.power, 0);
  const grip = wheels.length ? wheels.reduce((s, p) => s + p.grip, 0) / wheels.length : 0;
  const comfort = parts.reduce((s, p) => s + p.comfort, 0);

  return {
    weight,
    power,
    grip,
    comfort,
    wheelCount: wheels.length,
    topSpeed: power / weight,
    stability: wheels.length * 2 + (chassis?.weight ?? 0) * 0.5,
    quirks: parts.flatMap((p) => (p.quirk ? [p.quirk] : [])),
    parts,
  };
}

/** Kan bilen rulla alls? Minst chassi, ett hjul och en motor. */
export function canDrive(stats: CarStats): boolean {
  return stats.parts.some((p) => p.slot === 'chassis') && stats.wheelCount > 0 && stats.power > 0;
}
