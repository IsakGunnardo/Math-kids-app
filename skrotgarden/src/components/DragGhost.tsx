import { getPart } from '../data/parts.ts';
import { SLOTS } from '../data/slots.ts';
import { CAR_SCALE } from '../systems/garageLayout.ts';
import type { Drag } from './useDrag.ts';
import { Sprite } from './Sprite.tsx';

/** Delen som följer fingret. Glider magnetiskt till platsen när den är nära. */
export function DragGhost({ drag }: { drag: Drag }) {
  const part = getPart(drag.partId);
  if (!part) return null;
  const w = SLOTS[part.slot].width * CAR_SCALE;
  const h = SLOTS[part.slot].height * CAR_SCALE;
  const x = drag.snap ? drag.snap.x : drag.x;
  const y = drag.snap ? drag.snap.y : drag.y;
  return (
    <div
      className={`drag-ghost${drag.snap ? ' snapped' : ''}`}
      style={{ left: x - w / 2, top: y - h / 2, width: w, height: h }}
    >
      <Sprite sprite={part.sprite} alt="" width={w} height={h} />
    </div>
  );
}
