import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CarBuild, SceneId } from '../data/types.ts';
import { STARTER_KIT } from '../data/parts.ts';
import { loadBuild, sameBuild, type Garage } from '../systems/build.ts';

export interface SavedCar {
  id: string;
  build: CarBuild;
  savedAt: number;
}

/** Hyllan i garaget har plats för så här många sparade bilar. */
export const MAX_SAVED = 6;

export interface GameState {
  scene: SceneId;
  /** Lösa delar. Samma id kan förekomma flera gånger. */
  inventory: string[];
  car: CarBuild;
  savedCars: SavedCar[];
  soundOn: boolean;

  setScene: (scene: SceneId) => void;
  addToInventory: (partId: string) => void;
  /** Ersätter bil + inventarie atomiskt (resultatet av en garage-operation). */
  setGarage: (g: Garage) => void;
  /** Sparar nuvarande bil på hyllan. Dubbletter sparas inte, äldsta ryker om det är fullt. */
  saveCar: () => void;
  loadCar: (id: string) => void;
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
      setGarage: (g) => set({ car: g.car, inventory: g.inventory }),
      saveCar: () =>
        set((s) => {
          if (!s.car.chassis || s.savedCars.some((c) => sameBuild(c.build, s.car))) return {};
          const entry: SavedCar = { id: `car-${Date.now()}`, build: s.car, savedAt: Date.now() };
          return { savedCars: [...s.savedCars, entry].slice(-MAX_SAVED) };
        }),
      loadCar: (id) =>
        set((s) => {
          const saved = s.savedCars.find((c) => c.id === id);
          if (!saved) return {};
          const g = loadBuild({ car: s.car, inventory: s.inventory }, saved.build);
          return { car: g.car, inventory: g.inventory };
        }),
      toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
    }),
    {
      name: 'skrotgarden-v1',
      version: 2,
      migrate: (state, version) => {
        const s = (state ?? {}) as Partial<GameState>;
        // v2: större startkit så garaget går att testa; äldre sparningar nollställs.
        if (version < 2) return { ...s, inventory: [...STARTER_KIT], car: EMPTY_CAR, savedCars: [] };
        return s;
      },
    },
  ),
);
