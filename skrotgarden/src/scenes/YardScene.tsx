import { useState } from 'react';
import { Sprite } from '../components/Sprite.tsx';
import { SLOT_ORDER, SLOTS } from '../data/slots.ts';
import type { SlotId } from '../data/types.ts';
import { getPart } from '../data/parts.ts';
import { useGame } from '../state/store.ts';
import { audio } from '../systems/audio.ts';
import { ownedParts, pileHasParts } from '../systems/yard.ts';
import './yard.css';

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
/** Garageknappens mitt – dit flyger plockade delar. */
const GARAGE_BTN = { x: 1380, y: 84 };

interface Pop {
  key: number;
  partId: string;
  x: number;
  y: number;
}

/**
 * Skrotgården: tryck på en hög för att plocka en ny del (kostar en skruv).
 * Delen poppar upp och flyger in i garaget.
 */
export function YardScene() {
  const picks = useGame((s) => s.picks);
  const car = useGame((s) => s.car);
  const inventory = useGame((s) => s.inventory);
  const pickPart = useGame((s) => s.pickPart);
  const [pops, setPops] = useState<Pop[]>([]);
  const [shake, setShake] = useState<SlotId | null>(null);
  const owned = ownedParts(car, inventory);

  const onPile = (slot: SlotId, i: number) => {
    const id = pickPart(slot);
    if (!id) {
      audio.play('nope', { volume: 0.5 });
      setShake(slot);
      setTimeout(() => setShake(null), 500);
      return;
    }
    audio.play('pick');
    const pop: Pop = { key: Date.now() + i, partId: id, x: PILE_SPOTS[i].x + 160, y: PILE_SPOTS[i].y + 100 };
    setPops((p) => [...p, pop]);
    setTimeout(() => setPops((p) => p.filter((x) => x.key !== pop.key)), 1500);
  };

  return (
    <div className="scene">
      <Sprite sprite="bg/yard" className="scene-bg" />
      {SLOT_ORDER.map((slot, i) => {
        const empty = !pileHasParts(slot, owned);
        return (
          <div
            key={slot}
            className={`pile${empty || picks <= 0 ? ' dim' : ''}${shake === slot ? ' shake' : ''}`}
            style={{ left: PILE_SPOTS[i].x, top: PILE_SPOTS[i].y }}
            onPointerUp={() => onPile(slot, i)}
          >
            <Sprite sprite={`props/pile_${slot}`} alt={SLOTS[slot].name} />
          </div>
        );
      })}
      <Sprite
        sprite={picks > 0 ? 'char/skruvis_wave' : 'char/skruvis_think'}
        className="abs"
        style={{ left: 700, top: 10, width: 270, height: 360 }}
      />
      {pops.map((p) => {
        const part = getPart(p.partId)!;
        const w = Math.min(SLOTS[part.slot].width, 260);
        const h = w * (SLOTS[part.slot].height / SLOTS[part.slot].width);
        const style = {
          left: p.x - w / 2,
          top: p.y - h / 2,
          width: w,
          height: h,
          '--dx': `${GARAGE_BTN.x - p.x}px`,
          '--dy': `${GARAGE_BTN.y - p.y}px`,
        } as React.CSSProperties;
        return (
          <div key={p.key} className="pop" style={style}>
            <Sprite sprite={part.sprite} alt={part.name} />
          </div>
        );
      })}
    </div>
  );
}
