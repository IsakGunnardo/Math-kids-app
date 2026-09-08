import type { BodyMount, CarBuild, ChassisPart, MountKey, SlotId } from '../data/types.ts';
import { getChassis, getPart } from '../data/parts.ts';

/** Garagets tillstånd: bilen som byggs + delarna som ligger lösa. */
export interface Garage {
  car: CarBuild;
  inventory: string[];
}

export const BODY_MOUNTS: BodyMount[] = ['motor', 'steering', 'seat', 'light', 'roof', 'extra'];

/** Alla fästpunkter ett chassi erbjuder. */
export function mountKeys(chassis: ChassisPart): MountKey[] {
  const wheels = chassis.wheelMounts.map((_, i) => `wheel_${i}` as MountKey);
  return [...wheels, ...BODY_MOUNTS];
}

export function slotOfMount(key: MountKey): SlotId {
  return key.startsWith('wheel_') ? 'wheel' : (key as BodyMount);
}

function without(list: string[], id: string): string[] {
  const i = list.indexOf(id);
  return i < 0 ? list : [...list.slice(0, i), ...list.slice(i + 1)];
}

/** Tar loss en del och lägger den i inventariet. */
export function unmount(g: Garage, key: MountKey): Garage {
  const id = g.car.parts[key];
  if (!id) return g;
  const parts = { ...g.car.parts };
  delete parts[key];
  return { car: { ...g.car, parts }, inventory: [...g.inventory, id] };
}

/**
 * Monterar en del från inventariet. Fel slot → ingenting händer.
 * Upptagen slot → den gamla delen läggs tillbaka i inventariet.
 */
export function mount(g: Garage, partId: string, key: MountKey): Garage {
  const part = getPart(partId);
  const chassis = getChassis(g.car.chassis);
  if (!part || !chassis) return g;
  if (part.slot !== slotOfMount(key) || !mountKeys(chassis).includes(key)) return g;
  if (!g.inventory.includes(partId)) return g;
  const freed = unmount(g, key);
  return {
    car: { ...freed.car, parts: { ...freed.car.parts, [key]: partId } },
    inventory: without(freed.inventory, partId),
  };
}

/**
 * Byter chassi (eller tar bort det med null). Delar på fästen som inte
 * finns på det nya chassit åker tillbaka till inventariet.
 */
export function setChassis(g: Garage, partId: string | null): Garage {
  const next = partId ? getChassis(partId) : undefined;
  if (partId && (!next || !g.inventory.includes(partId))) return g;

  let inventory = g.inventory;
  if (g.car.chassis) inventory = [...inventory, g.car.chassis];
  if (partId) inventory = without(inventory, partId);

  const keep = new Set<MountKey>(next ? mountKeys(next) : []);
  const parts: CarBuild['parts'] = {};
  for (const [k, id] of Object.entries(g.car.parts) as [MountKey, string][]) {
    if (keep.has(k)) parts[k] = id;
    else inventory = [...inventory, id];
  }
  return { car: { chassis: partId, parts }, inventory };
}

/** Plockar isär hela bilen. */
export function dismantle(g: Garage): Garage {
  return setChassis(g, null);
}

/** Bygger ihop en sparad bil av det som finns. Delar som saknas hoppas över. */
export function loadBuild(g: Garage, build: CarBuild): Garage {
  let next = dismantle(g);
  if (!build.chassis) return next;
  next = setChassis(next, build.chassis);
  if (next.car.chassis !== build.chassis) return next;
  for (const [k, id] of Object.entries(build.parts) as [MountKey, string][]) {
    next = mount(next, id, k);
  }
  return next;
}

export function sameBuild(a: CarBuild, b: CarBuild): boolean {
  if (a.chassis !== b.chassis) return false;
  const ka = Object.keys(a.parts) as MountKey[];
  const kb = Object.keys(b.parts);
  return ka.length === kb.length && ka.every((k) => a.parts[k] === b.parts[k]);
}
