import type { Part, SlotId } from '../types.ts';

const deco = (
  slot: SlotId,
  id: string,
  name: string,
  stats: Partial<Pick<Part, 'weight' | 'power' | 'grip' | 'comfort' | 'quirk'>> = {},
): Part => ({
  id,
  name,
  slot,
  sprite: `parts/${slot}_${id}`,
  weight: 1,
  power: 0,
  grip: 0,
  comfort: 0,
  ...stats,
});

export const DECO: Part[] = [
  // Ratt
  deco('steering', 'styre', 'Cykelstyret', { comfort: 1 }),
  deco('steering', 'ratt', 'Bilratten', { comfort: 2 }),
  deco('steering', 'grytlock', 'Grytlocket', { comfort: 1, quirk: 'rattle' }),
  // Säte
  deco('seat', 'pall', 'Pallen', { comfort: 1 }),
  deco('seat', 'fatolj', 'Fåtöljen', { weight: 3, comfort: 5 }),
  deco('seat', 'hink', 'Hinken', { comfort: 1, quirk: 'wobble' }),
  deco('seat', 'soffa', 'Soffan', { weight: 4, comfort: 6, quirk: 'music' }),
  // Ljus
  deco('light', 'ficklampa', 'Ficklampan', {}),
  deco('light', 'lykta', 'Lyktan', {}),
  deco('light', 'disco', 'Discokulan', { quirk: 'sparkle' }),
  // Tak
  deco('roof', 'paraply', 'Paraplyet', { comfort: 2 }),
  deco('roof', 'plat', 'Plåttaket', { weight: 2, comfort: 2, quirk: 'rattle' }),
  deco('roof', 'talt', 'Tältet', { comfort: 3 }),
  // Extra
  deco('extra', 'tuta', 'Tutan', { quirk: 'honk' }),
  deco('extra', 'bubbel', 'Bubbelmaskinen', { quirk: 'bubbles' }),
  deco('extra', 'flagga', 'Flaggan', {}),
  deco('extra', 'radio', 'Radion', { quirk: 'music' }),
  deco('extra', 'antenn', 'Antennen', { quirk: 'sparkle' }),
  deco('extra', 'skruvburk', 'Skruvburken', { quirk: 'lose_screw' }),
];
