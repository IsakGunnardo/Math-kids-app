/** Grunddata för Skrotgården. Ren data – ingen rendering här. */

export type SlotId =
  | 'chassis'
  | 'wheel'
  | 'motor'
  | 'steering'
  | 'seat'
  | 'light'
  | 'roof'
  | 'extra';

/** Små lustigheter som händer under körningen. */
export type QuirkId =
  | 'honk'
  | 'bubbles'
  | 'lose_screw'
  | 'sparkle'
  | 'rattle'
  | 'smoke'
  | 'music'
  | 'wobble'
  | 'squeak'
  | 'confetti';

export interface Part {
  /** Unikt inom hela spelet, filnamnssäkert (a-z, 0-9). */
  id: string;
  /** Visningsnamn (bara för vuxna/debug – spelet kräver ingen text). */
  name: string;
  slot: SlotId;
  /** Asset-namn utan filändelse, t.ex. "parts/chassis_rost". */
  sprite: string;
  weight: number;
  power: number;
  grip: number;
  comfort: number;
  quirk?: QuirkId;
}

export interface Point {
  x: number;
  y: number;
}

/** Slots som sitter på chassit (utöver hjul). */
export type BodyMount = Exclude<SlotId, 'chassis' | 'wheel'>;

export interface ChassisPart extends Part {
  slot: 'chassis';
  /** Hjulpositioner i chassi-spritens pixelkoordinater (2–4 st). */
  wheelMounts: Point[];
  /** Var övriga delar snappar fast, i chassi-spritens pixelkoordinater. */
  mounts: Record<BodyMount, Point>;
}

export type MountKey = BodyMount | `wheel_${number}`;

/** En byggd bil: chassi + vilken del som sitter i vilken slot. */
export interface CarBuild {
  chassis: string | null;
  parts: Partial<Record<MountKey, string>>;
}

export type SceneId = 'yard' | 'garage' | 'drive';
