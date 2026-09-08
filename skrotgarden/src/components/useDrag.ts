import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import type { SlotId } from '../data/types.ts';
import { STAGE } from '../data/assets.ts';
import type { Target, TargetKey } from '../systems/garageLayout.ts';

export type DragSource = { kind: 'inventory'; index: number } | { kind: 'car'; key: TargetKey };

export interface Drag {
  pointerId: number;
  partId: string;
  slot: SlotId;
  source: DragSource;
  /** Pekarens position i scenkoordinater. */
  x: number;
  y: number;
  /** Plats delen snappar mot just nu. */
  snap: Target | null;
}

interface Options {
  findSnap: (slot: SlotId, x: number, y: number) => Target | null;
  onDrop: (drag: Drag) => void;
}

/** Översätter en pekarhändelse till designpixlar på scenen. */
export function toStage(e: { clientX: number; clientY: number }) {
  const el = document.querySelector('.stage');
  if (!el) return { x: e.clientX, y: e.clientY };
  const r = el.getBoundingClientRect();
  const scale = r.width / STAGE.width;
  return { x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale };
}

/**
 * Pekar-driven drag & drop (touch och mus). Lyssnar på window under
 * pågående drag så att fingret får lämna elementet som startade.
 */
export function useDrag(options: Options) {
  const [drag, setDragState] = useState<Drag | null>(null);
  const ref = useRef<Drag | null>(null);
  const opts = useRef(options);
  opts.current = options;

  const set = (d: Drag | null) => {
    ref.current = d;
    setDragState(d);
  };

  const start = (partId: string, slot: SlotId, source: DragSource, e: ReactPointerEvent) => {
    if (ref.current) return;
    e.preventDefault();
    const { x, y } = toStage(e);
    set({ pointerId: e.pointerId, partId, slot, source, x, y, snap: opts.current.findSnap(slot, x, y) });
  };

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = ref.current;
      if (!d || e.pointerId !== d.pointerId) return;
      const { x, y } = toStage(e);
      set({ ...d, x, y, snap: opts.current.findSnap(d.slot, x, y) });
    };
    const up = (e: PointerEvent) => {
      const d = ref.current;
      if (!d || e.pointerId !== d.pointerId) return;
      set(null);
      opts.current.onDrop(d);
    };
    const cancel = (e: PointerEvent) => {
      if (ref.current && e.pointerId === ref.current.pointerId) set(null);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel);
    };
  }, []);

  return { drag, start };
}
