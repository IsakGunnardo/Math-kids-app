import { Sprite } from '../components/Sprite.tsx';
import { SLOT_ORDER, SLOTS } from '../data/slots.ts';

/** Var högarna står på gården (designpixlar, övre vänstra hörn). */
const PILE_SPOTS = [
  { x: 80, y: 420 },
  { x: 420, y: 380 },
  { x: 760, y: 420 },
  { x: 1100, y: 380 },
  { x: 200, y: 680 },
  { x: 560, y: 700 },
  { x: 900, y: 680 },
  { x: 1240, y: 640 },
];

/**
 * Steg 1: bara kuliss. Att plocka delar ur högarna kommer i steg 4.
 */
export function YardScene() {
  return (
    <div className="scene">
      <Sprite sprite="bg/yard" className="scene-bg" />
      {SLOT_ORDER.map((slot, i) => (
        <Sprite
          key={slot}
          sprite={`props/pile_${slot}`}
          alt={SLOTS[slot].name}
          className="abs"
          style={{ left: PILE_SPOTS[i].x, top: PILE_SPOTS[i].y, width: 320, height: 256 }}
        />
      ))}
      <Sprite
        sprite="char/skruvis_wave"
        className="abs"
        style={{ left: 700, top: 10, width: 270, height: 360 }}
      />
      <div className="debug-label">Skrotgården</div>
    </div>
  );
}
