import type { SlotId } from './types.ts';

export interface SlotInfo {
  id: SlotId;
  name: string;
  /** Sprite-storlek i px (1x). Alla delar i samma slot har samma mått. */
  width: number;
  height: number;
  /** Platshållarfärg. */
  color: string;
}

export const SLOTS: Record<SlotId, SlotInfo> = {
  chassis: { id: 'chassis', name: 'Chassi', width: 512, height: 256, color: '#e07b39' },
  wheel: { id: 'wheel', name: 'Hjul', width: 160, height: 160, color: '#4a4a4a' },
  motor: { id: 'motor', name: 'Motor', width: 192, height: 160, color: '#c0392b' },
  steering: { id: 'steering', name: 'Ratt', width: 128, height: 128, color: '#8e44ad' },
  seat: { id: 'seat', name: 'Säte', width: 160, height: 160, color: '#27ae60' },
  light: { id: 'light', name: 'Ljus', width: 96, height: 96, color: '#f1c40f' },
  roof: { id: 'roof', name: 'Tak', width: 384, height: 160, color: '#2980b9' },
  extra: { id: 'extra', name: 'Extra', width: 128, height: 128, color: '#e91e63' },
};

export const SLOT_ORDER: SlotId[] = [
  'chassis',
  'wheel',
  'motor',
  'steering',
  'seat',
  'light',
  'roof',
  'extra',
];
