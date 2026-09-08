import type { MountKey, QuirkId } from '../data/types.ts';
import { SLOTS } from '../data/slots.ts';
import { getChassis, getPart } from '../data/parts.ts';
import { audio } from './audio.ts';
import type { Particles } from './particles.ts';
import { BODY_OFFSET_Y, DRIVE_SCALE, type DriveInput, type DriveWorld } from './physics.ts';

type SourceKey = MountKey | 'chassis';

export interface QuirkState {
  timers: Map<string, number>;
  sources: { quirk: QuirkId; key: SourceKey }[];
}

/** Vilka delar på bilen har en lustighet, och var sitter de. */
export function createQuirkState(w: DriveWorld): QuirkState {
  const sources: QuirkState['sources'] = [];
  const chassis = getChassis(w.build.chassis);
  if (chassis?.quirk) sources.push({ quirk: chassis.quirk, key: 'chassis' });
  for (const [key, id] of Object.entries(w.build.parts) as [MountKey, string][]) {
    const q = getPart(id)?.quirk;
    if (q) sources.push({ quirk: q, key });
  }
  return { timers: new Map(), sources };
}

/** Var en del sitter just nu, i världskoordinater. */
export function mountWorldPos(w: DriveWorld, key: SourceKey) {
  const chassis = getChassis(w.build.chassis);
  if (!w.chassis || !chassis) return { x: 0, y: 0 };
  if (key === 'chassis') return { x: w.chassis.position.x, y: w.chassis.position.y };
  if (key.startsWith('wheel_')) {
    const wheel = w.wheels[Number(key.slice(6))];
    return wheel ? { x: wheel.position.x, y: wheel.position.y } : { x: 0, y: 0 };
  }
  const m = chassis.mounts[key as keyof typeof chassis.mounts];
  const S = DRIVE_SCALE;
  const lx = m.x * S - (SLOTS.chassis.width * S) / 2;
  const ly = m.y * S - (SLOTS.chassis.height * S) / 2 - BODY_OFFSET_Y;
  const c = Math.cos(w.chassis.angle);
  const s = Math.sin(w.chassis.angle);
  return { x: w.chassis.position.x + lx * c - ly * s, y: w.chassis.position.y + lx * s + ly * c };
}

function every(state: QuirkState, id: string, interval: number, dt: number): boolean {
  const t = (state.timers.get(id) ?? 0) + dt;
  if (t >= interval) {
    state.timers.set(id, 0);
    return true;
  }
  state.timers.set(id, t);
  return false;
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

/** Kör alla lustigheter ett steg. dt i sekunder. */
export function updateQuirks(state: QuirkState, w: DriveWorld, input: DriveInput, dt: number, fx: Particles) {
  const speed = Math.abs(w.chassis?.velocity.x ?? 0);
  const moving = speed > 0.6;
  w.fx.jitter = 0;
  w.fx.wobble = false;

  for (const { quirk, key } of state.sources) {
    const id = `${key}:${quirk}`;
    const p = mountWorldPos(w, key);
    switch (quirk) {
      case 'honk':
        if (moving && every(state, id, 3.5, dt)) {
          audio.play('horn');
          for (let i = 0; i < 6; i++)
            fx.spawn({ kind: 'burst', x: p.x, y: p.y - 20, vx: rnd(-3, 3), vy: rnd(-4, -1), life: 0.5, maxLife: 0.5, size: rnd(6, 12), color: '#f1c40f' });
        }
        break;
      case 'bubbles':
        if (moving && every(state, id, 0.12, dt))
          fx.spawn({ kind: 'bubble', x: p.x, y: p.y, vx: rnd(-1, 1), vy: rnd(-3, -1.5), life: 1.6, maxLife: 1.6, size: rnd(5, 14), color: 'rgba(190,235,255,0.95)' });
        if (moving && every(state, `${id}:sfx`, 2.5, dt)) audio.play('bubbles', { volume: 0.5 });
        break;
      case 'lose_screw':
        if (moving && every(state, id, 5, dt)) {
          audio.play('clunk');
          fx.spawn({ kind: 'nut', x: p.x, y: p.y, vx: rnd(-3, -1), vy: -5, gravity: 0.3, life: 2, maxLife: 2, size: 9, color: '#aaa', spin: 0.2 });
        }
        break;
      case 'sparkle':
        if (every(state, id, 0.15, dt))
          fx.spawn({ kind: 'star', x: p.x + rnd(-20, 20), y: p.y + rnd(-20, 20), vy: -0.6, life: 0.6, maxLife: 0.6, size: rnd(4, 9), color: Math.random() < 0.5 ? '#fff' : '#ffe27a' });
        break;
      case 'rattle':
        if (moving) w.fx.jitter = 1.5;
        break;
      case 'smoke':
        if (input.gas && every(state, id, 0.1, dt))
          fx.spawn({ kind: 'smoke', x: p.x, y: p.y - 10, vx: -1 - speed * 0.3, vy: -1.5, life: 1.2, maxLife: 1.2, size: 8, color: '#8a8a8a' });
        break;
      case 'music':
        if (moving && every(state, id, 0.6, dt))
          fx.spawn({ kind: 'note', x: p.x, y: p.y - 10, vx: rnd(-0.5, 0.5), vy: -1.2, life: 1.5, maxLife: 1.5, size: 10, color: '#fff' });
        break;
      case 'wobble':
        w.fx.wobble = true;
        break;
      case 'squeak':
        if (moving && every(state, id, 1.3, dt)) audio.play('pick', { rate: 2.6, volume: 0.35 });
        break;
      case 'confetti':
        if (input.gas && every(state, id, 0.08, dt))
          fx.spawn({ kind: 'confetti', x: p.x, y: p.y, vx: rnd(-4, -1), vy: rnd(-3, 0), gravity: 0.2, life: 1.5, maxLife: 1.5, size: rnd(6, 12), color: ['#e91e63', '#f1c40f', '#2ecc71', '#3498db'][Math.floor(Math.random() * 4)], spin: rnd(-0.3, 0.3) });
        break;
    }
  }
}
