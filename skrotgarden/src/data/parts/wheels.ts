import type { Part } from '../types.ts';

/** Ett "hjul" i datat är ett hjulpar (ett hjul per sida). */
const wheel = (
  id: string,
  name: string,
  stats: Pick<Part, 'weight' | 'grip' | 'comfort'> & Partial<Pick<Part, 'quirk'>>,
): Part => ({
  id,
  name,
  slot: 'wheel',
  sprite: `parts/wheel_${id}`,
  power: 0,
  ...stats,
});

export const WHEELS: Part[] = [
  wheel('cykel', 'Cykelhjul', { weight: 1, grip: 2, comfort: 2 }),
  wheel('traktor', 'Traktorhjul', { weight: 4, grip: 6, comfort: 3 }),
  wheel('vagn', 'Barnvagnshjul', { weight: 1, grip: 2, comfort: 4, quirk: 'squeak' }),
  wheel('ost', 'Osthjul', { weight: 3, grip: 1, comfort: 2, quirk: 'wobble' }),
  wheel('klump', 'Gummiklumpar', { weight: 3, grip: 7, comfort: 5 }),
  wheel('skate', 'Skateboardhjul', { weight: 1, grip: 3, comfort: 1, quirk: 'rattle' }),
  wheel('fjader', 'Fjäderhjul', { weight: 2, grip: 4, comfort: 6, quirk: 'sparkle' }),
  wheel('kvarnsten', 'Kvarnstenar', { weight: 6, grip: 5, comfort: 1, quirk: 'lose_screw' }),
];
