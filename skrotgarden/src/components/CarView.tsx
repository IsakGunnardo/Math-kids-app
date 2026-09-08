import type { PointerEvent as ReactPointerEvent } from 'react';
import type { BodyMount, CarBuild, MountKey, Point, SlotId } from '../data/types.ts';
import { SLOTS } from '../data/slots.ts';
import { getChassis, getPart } from '../data/parts.ts';
import { mountKeys, slotOfMount } from '../systems/build.ts';
import type { TargetKey } from '../systems/garageLayout.ts';
import { Sprite } from './Sprite.tsx';

export interface CarViewInteraction {
  /** Slot som just nu dras – dess lediga fästen lyser. */
  hotSlot: SlotId | null;
  /** Del som dras från bilen och därför ska döljas i vyn. */
  hiddenKey: TargetKey | null;
  onPartDown: (key: TargetKey, partId: string, e: ReactPointerEvent) => void;
}

interface Props {
  build: CarBuild;
  origin: Point;
  scale: number;
  interaction?: CarViewInteraction;
}

/** Ritordning: tak och säte bakom chassit, hjul främst. */
const LAYER: Record<string, number> = { roof: 0, seat: 1, motor: 3, steering: 4, light: 5, extra: 6 };
const layerOf = (k: MountKey) => (k.startsWith('wheel_') ? 7 : LAYER[k]);

/** Ritar en bil som DOM-sprites. Används i garaget och för miniatyrer på hyllan. */
export function CarView({ build, origin, scale, interaction }: Props) {
  const chassis = getChassis(build.chassis);
  const W = SLOTS.chassis.width * scale;
  const H = SLOTS.chassis.height * scale;
  const keys = chassis ? [...mountKeys(chassis)].sort((a, b) => layerOf(a) - layerOf(b)) : [];
  const chassisHidden = interaction?.hiddenKey === 'chassis';

  const posOf = (k: MountKey): Point => {
    const p = k.startsWith('wheel_') ? chassis!.wheelMounts[Number(k.slice(6))] : chassis!.mounts[k as BodyMount];
    return { x: p.x * scale, y: p.y * scale };
  };

  return (
    <div className="car-view" style={{ left: origin.x, top: origin.y, width: W, height: H }}>
      {chassis && !chassisHidden ? (
        <div
          className="car-part"
          style={{ left: 0, top: 0, width: W, height: H, zIndex: 2 }}
          onPointerDown={(e) => interaction?.onPartDown('chassis', chassis.id, e)}
        >
          <Sprite sprite={chassis.sprite} alt={chassis.name} width={W} height={H} />
        </div>
      ) : (
        interaction && (
          <div className={`car-frame-empty${interaction.hotSlot === 'chassis' ? ' hot' : ''}`} />
        )
      )}

      {!chassisHidden &&
        keys.map((key) => {
          const partId = build.parts[key];
          const part = partId ? getPart(partId) : undefined;
          const slot = slotOfMount(key);
          const { x, y } = posOf(key);
          const z = layerOf(key) + 1;
          if (part && interaction?.hiddenKey !== key) {
            const w = SLOTS[slot].width * scale;
            const h = SLOTS[slot].height * scale;
            return (
              <div
                key={key}
                className="car-part"
                style={{ left: x - w / 2, top: y - h / 2, width: w, height: h, zIndex: z }}
                onPointerDown={(e) => interaction?.onPartDown(key, part.id, e)}
              >
                <Sprite sprite={part.sprite} alt={part.name} width={w} height={h} />
              </div>
            );
          }
          if (!interaction) return null;
          const r = Math.min(SLOTS[slot].width, SLOTS[slot].height) * scale * 0.55;
          return (
            <div
              key={key}
              className={`mount-marker${interaction.hotSlot === slot ? ' hot' : ''}`}
              style={{
                left: x - r / 2,
                top: y - r / 2,
                width: r,
                height: r,
                zIndex: 10,
                borderColor: SLOTS[slot].color,
              }}
            />
          );
        })}
    </div>
  );
}
