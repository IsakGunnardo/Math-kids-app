import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CarBuild, MountKey, SceneId } from '../data/types.ts';
import { STARTER_KIT } from '../data/parts.ts';

export interface SavedCar {
  id: string;
  name: string;
  build: CarBuild;
  savedAt: number;
}

export interface GameState {
  scene: SceneId;
  /** Del-id:n som ligger i inventariet (samma id kan förekomma flera gånger). */
  inventory: string[];
  car: CarBuild;
  savedCars: SavedCar[];
  soundOn: boolean;

  setScene: (scene: SceneId) => void;
  addToInventory: (partId: string) => void;
  removeFromInventory: (partId: string) => void;
  setChassis: (partId: string | null) => void;
  mountPart: (mount: MountKey, partId: string | null) => void;
  resetCar: () => void;
  toggleSound: () => void;
}

export const EMPTY_CAR: CarBuild = { chassis: null, parts: {} };

export const useGame = create<GameState>()(
  persist(
    (set) => ({
      scene: 'yard',
      inventory: [...STARTER_KIT],
      car: EMPTY_CAR,
      savedCars: [],
      soundOn: true,

      setScene: (scene) => set({ scene }),
      addToInventory: (partId) => set((s) => ({ inventory: [...s.inventory, partId] })),
      removeFromInventory: (partId) =>
        set((s) => {
          const i = s.inventory.indexOf(partId);
          if (i < 0) return {};
          return { inventory: [...s.inventory.slice(0, i), ...s.inventory.slice(i + 1)] };
        }),
      setChassis: (partId) => set((s) => ({ car: { ...s.car, chassis: partId } })),
      mountPart: (mount, partId) =>
        set((s) => {
          const parts = { ...s.car.parts };
          if (partId) parts[mount] = partId;
          else delete parts[mount];
          return { car: { ...s.car, parts } };
        }),
      resetCar: () => set({ car: EMPTY_CAR }),
      toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
    }),
    { name: 'skrotgarden-v1' },
  ),
);
