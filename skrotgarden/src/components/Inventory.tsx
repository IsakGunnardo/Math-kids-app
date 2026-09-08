import type { PointerEvent as ReactPointerEvent } from 'react';
import { getPart } from '../data/parts.ts';
import { SLOT_ORDER } from '../data/slots.ts';
import { Sprite } from './Sprite.tsx';

interface Props {
  items: string[];
  /** Index i `items` som just nu dras (döljs i listan). */
  draggingIndex: number | null;
  onStart: (index: number, partId: string, e: ReactPointerEvent) => void;
}

/** Raden med lösa delar längst ner i garaget. Svep i sidled för att bläddra. */
export function Inventory({ items, draggingIndex, onStart }: Props) {
  const order = items
    .map((id, index) => ({ id, index, part: getPart(id) }))
    .filter((x) => x.part)
    .sort((a, b) => SLOT_ORDER.indexOf(a.part!.slot) - SLOT_ORDER.indexOf(b.part!.slot));

  return (
    <div className="inventory">
      {order.map(({ id, index, part }) => (
        <div
          key={`${id}-${index}`}
          className={`inv-item${draggingIndex === index ? ' dragging' : ''}`}
          onPointerDown={(e) => onStart(index, id, e)}
        >
          <Sprite sprite={part!.sprite} alt={part!.name} />
        </div>
      ))}
    </div>
  );
}
