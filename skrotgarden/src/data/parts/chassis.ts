import type { ChassisPart, Point } from '../types.ts';

/**
 * Standardlayout för en 512x256-sprite. Chassin kan avvika,
 * men de flesta använder den här så att grafiken blir lätt att rita.
 */
const std = (wheels: Point[], over: Partial<ChassisPart['mounts']> = {}) => ({
  wheelMounts: wheels,
  mounts: {
    motor: { x: 120, y: 120 },
    steering: { x: 250, y: 90 },
    seat: { x: 330, y: 130 },
    light: { x: 40, y: 150 },
    roof: { x: 300, y: 30 },
    extra: { x: 460, y: 110 },
    ...over,
  },
});

const two: Point[] = [
  { x: 110, y: 220 },
  { x: 400, y: 220 },
];

export const CHASSIS: ChassisPart[] = [
  {
    id: 'rost',
    name: 'Rostbaljan',
    slot: 'chassis',
    sprite: 'parts/chassis_rost',
    weight: 5,
    power: 0,
    grip: 0,
    comfort: 1,
    quirk: 'rattle',
    ...std(two),
  },
  {
    id: 'badkar',
    name: 'Badkaret',
    slot: 'chassis',
    sprite: 'parts/chassis_badkar',
    weight: 7,
    power: 0,
    grip: 0,
    comfort: 3,
    quirk: 'bubbles',
    ...std(two),
  },
  {
    id: 'lada',
    name: 'Trälådan',
    slot: 'chassis',
    sprite: 'parts/chassis_lada',
    weight: 3,
    power: 0,
    grip: 0,
    comfort: 1,
    ...std(two),
  },
  {
    id: 'tunna',
    name: 'Oljetunnan',
    slot: 'chassis',
    sprite: 'parts/chassis_tunna',
    weight: 6,
    power: 0,
    grip: 0,
    comfort: 2,
    quirk: 'wobble',
    ...std(two),
  },
  {
    id: 'kanot',
    name: 'Kanoten',
    slot: 'chassis',
    sprite: 'parts/chassis_kanot',
    weight: 4,
    power: 0,
    grip: 0,
    comfort: 2,
    ...std([
      { x: 90, y: 220 },
      { x: 256, y: 225 },
      { x: 420, y: 220 },
    ]),
  },
  {
    id: 'buss',
    name: 'Långa Lisa',
    slot: 'chassis',
    sprite: 'parts/chassis_buss',
    weight: 9,
    power: 0,
    grip: 0,
    comfort: 4,
    quirk: 'music',
    ...std(
      [
        { x: 70, y: 220 },
        { x: 190, y: 220 },
        { x: 320, y: 220 },
        { x: 440, y: 220 },
      ],
      { roof: { x: 256, y: 20 } },
    ),
  },
];
