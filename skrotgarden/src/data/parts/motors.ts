import type { Part } from '../types.ts';

const motor = (
  id: string,
  name: string,
  stats: Pick<Part, 'weight' | 'power' | 'comfort'> & Partial<Pick<Part, 'quirk'>>,
): Part => ({
  id,
  name,
  slot: 'motor',
  sprite: `parts/motor_${id}`,
  grip: 0,
  ...stats,
});

export const MOTORS: Part[] = [
  motor('gummiband', 'Gummibandet', { weight: 1, power: 3, comfort: 5 }),
  motor('hamster', 'Hamsterhjulet', { weight: 2, power: 5, comfort: 4, quirk: 'squeak' }),
  motor('moped', 'Mopedmotorn', { weight: 3, power: 8, comfort: 2, quirk: 'rattle' }),
  motor('anga', 'Ångpannan', { weight: 6, power: 10, comfort: 3, quirk: 'smoke' }),
  motor('raket', 'Raketen', { weight: 4, power: 16, comfort: 1, quirk: 'confetti' }),
  motor('flakt', 'Fläkten', { weight: 2, power: 6, comfort: 4, quirk: 'bubbles' }),
];
