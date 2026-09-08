import { Sprite } from '../components/Sprite.tsx';
import { useGame } from '../state/store.ts';
import { getPart } from '../data/parts.ts';
import { SLOTS } from '../data/slots.ts';

/** Var bilen står i garaget (chassi-spritens övre vänstra hörn). */
export const CAR_ORIGIN = { x: 420, y: 300 };

/**
 * Steg 1: visar garaget, en tom bilplats och inventariet som en rad.
 * Drag & drop och snap kommer i steg 2.
 */
export function GarageScene() {
  const inventory = useGame((s) => s.inventory);

  return (
    <div className="scene">
      <Sprite sprite="bg/garage" className="scene-bg" />

      <div
        className="abs"
        style={{
          left: CAR_ORIGIN.x,
          top: CAR_ORIGIN.y,
          width: SLOTS.chassis.width,
          height: SLOTS.chassis.height,
          border: '6px dashed rgba(255,255,255,0.5)',
          borderRadius: 40,
        }}
      />

      <div
        className="abs"
        style={{
          left: 40,
          right: 40,
          bottom: 30,
          height: 180,
          display: 'flex',
          gap: 16,
          alignItems: 'center',
          padding: '0 16px',
          background: 'rgba(0,0,0,0.25)',
          borderRadius: 24,
          overflowX: 'auto',
        }}
      >
        {inventory.map((id, i) => {
          const part = getPart(id);
          if (!part) return null;
          return (
            <Sprite
              key={`${id}-${i}`}
              sprite={part.sprite}
              alt={part.name}
              style={{ height: 140, width: 'auto', flex: '0 0 auto' }}
            />
          );
        })}
      </div>

      <Sprite
        sprite="char/mira_think"
        className="abs"
        style={{ left: 60, top: 120, width: 240, height: 320 }}
      />
      <div className="debug-label">Garaget</div>
    </div>
  );
}
