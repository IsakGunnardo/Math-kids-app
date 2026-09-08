import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CarBuild, SceneId, SlotId } from '../data/types.ts';
import { STARTER_KIT } from '../data/parts.ts';
import { loadBuild, sameBuild, type Garage } from '../systems/build.ts';
import { choosePart, ownedParts, START_PICKS } from '../systems/yard.ts';

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
  /** Hur många delar man får plocka på skrotgården just nu. */
  picks: number;
  /** Antal gånger målflaggan nåtts. */
  finishes: number;

  setScene: (scene: SceneId) => void;
  /** Ersätter bil + inventarie atomiskt (resultatet av en garage-operation). */
  setGarage: (g: Garage) => void;
  /** Sparar nuvarande bil på hyllan. Dubbletter sparas inte, äldsta ryker om det är fullt. */
  saveCar: () => void;
  loadCar: (id: string) => void;
  toggleSound: () => void;
  grantPicks: (n: number) => void;
  /** Plockar en del ur en hög. Returnerar del-id eller null om inget gick. */
  pickPart: (slot: SlotId) => string | null;
  recordFinish: () => void;
}

export const EMPTY_CAR: CarBuild = { chassis: null, parts: {} };

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      scene: 'yard',
      inventory: [...STARTER_KIT],
      car: EMPTY_CAR,
      savedCars: [],
      soundOn: true,
      picks: START_PICKS,
      finishes: 0,

      setScene: (scene) => set({ scene }),
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
      grantPicks: (n) => set((s) => ({ picks: s.picks + n })),
      pickPart: (slot) => {
        const s = get();
        if (s.picks <= 0) return null;
        const id = choosePart(slot, ownedParts(s.car, s.inventory));
        if (!id) return null;
        set({ picks: s.picks - 1, inventory: [...s.inventory, id] });
        return id;
      },
      recordFinish: () => set((s) => ({ finishes: s.finishes + 1 })),
    }),
    {
      name: 'skrotgarden-v1',
      version: 3,
      migrate: (state, version) => {
        const s = (state ?? {}) as Partial<GameState>;
        if (version < 2) return { ...s, inventory: [...STARTER_KIT], car: EMPTY_CAR, savedCars: [] };
        if (version < 3) return { ...s, picks: START_PICKS, finishes: 0 };
        return s;
      },
    },
  ),
);
