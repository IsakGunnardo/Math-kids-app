import Matter from 'matter-js';
import type { CarBuild, MountKey, Part } from '../data/types.ts';
import { SLOTS } from '../data/slots.ts';
import { getChassis, getPart } from '../data/parts.ts';
import { computeCarStats, type CarStats } from './carStats.ts';
import { buildTrack, TRACK_START_X, type Track } from './track.ts';

const { Engine, Bodies, Body, Composite, Constraint } = Matter;

/** Bilen ritas i halv sprite-skala under körningen. */
export const DRIVE_SCALE = 0.5;
/** Chassikroppen sitter i spritens nedre del; så här långt under spritens mitt. */
export const BODY_OFFSET_Y = 30 * DRIVE_SCALE;
const CAR_GROUP = -1;

export interface DriveInput {
  gas: boolean;
  brake: boolean;
}

export interface DriveWorld {
  engine: Matter.Engine;
  track: Track;
  stats: CarStats;
  build: CarBuild;
  car: Matter.Composite;
  chassis: Matter.Body | null;
  wheels: Matter.Body[];
  /** Övriga delar (inte hjul) i ritordning, med fästpunkt i spritepixlar. */
  bodyParts: { key: MountKey; part: Part }[];
  upsideDownFrames: number;
}

function addTrack(world: Matter.World, track: Track) {
  const pts = track.points;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    const seg = Bodies.rectangle((a.x + b.x) / 2, (a.y + b.y) / 2 + 20, len + 2, 40, {
      isStatic: true,
      angle: Math.atan2(b.y - a.y, b.x - a.x),
      friction: 1,
      restitution: 0,
    });
    Composite.add(world, seg);
  }
  // Stopp vid banans slut så ingen kör ut i tomma intet.
  const last = pts[pts.length - 1];
  Composite.add(world, Bodies.rectangle(last.x + 40, last.y - 200, 80, 600, { isStatic: true }));
}

function buildCar(build: CarBuild, stats: CarStats, x: number, groundY: number) {
  const car = Composite.create();
  const chassisPart = getChassis(build.chassis);
  if (!chassisPart) return { car, chassis: null, wheels: [] as Matter.Body[] };

  const S = DRIVE_SCALE;
  const W = SLOTS.chassis.width * S;
  const H = SLOTS.chassis.height * S;
  const cx = x;
  const cy = groundY - H * 0.9;
  const chassis = Bodies.rectangle(cx, cy + BODY_OFFSET_Y, W * 0.9, 140 * S, {
    friction: 0.6,
    restitution: 0.05,
    collisionFilter: { group: CAR_GROUP },
    chamfer: { radius: 12 },
  });
  Body.setMass(chassis, 20 + stats.weight * 4);
  Composite.add(car, chassis);

  const wheels: Matter.Body[] = [];
  chassisPart.wheelMounts.forEach((m, i) => {
    const id = build.parts[`wheel_${i}`];
    const part = id ? getPart(id) : undefined;
    if (!part) return;
    const r = (SLOTS.wheel.width / 2) * S;
    const off = { x: (m.x - SLOTS.chassis.width / 2) * S, y: (m.y - SLOTS.chassis.height / 2) * S };
    const wheel = Bodies.circle(cx + off.x, cy + off.y, r, {
      friction: 0.4 + part.grip * 0.09,
      frictionStatic: 1,
      restitution: 0.1,
      collisionFilter: { group: CAR_GROUP },
    });
    Body.setMass(wheel, 4 + part.weight);
    const axle = Constraint.create({
      bodyA: chassis,
      pointA: { x: off.x, y: off.y - BODY_OFFSET_Y },
      bodyB: wheel,
      stiffness: 0.7,
      damping: 0.1,
      length: 0,
    });
    Composite.add(car, [wheel, axle]);
    wheels.push(wheel);
  });
  return { car, chassis, wheels };
}

export function createWorld(build: CarBuild): DriveWorld {
  const engine = Engine.create({ gravity: { x: 0, y: 1.2 } });
  const track = buildTrack();
  addTrack(engine.world, track);
  const stats = computeCarStats(build);
  const { car, chassis, wheels } = buildCar(build, stats, TRACK_START_X, track.groundY(TRACK_START_X));
  Composite.add(engine.world, car);
  const bodyParts = (Object.entries(build.parts) as [MountKey, string][])
    .filter(([k]) => !k.startsWith('wheel_'))
    .flatMap(([key, id]) => {
      const part = getPart(id);
      return part ? [{ key, part }] : [];
    });
  return { engine, track, stats, build, car, chassis, wheels, bodyParts, upsideDownFrames: 0 };
}

/** Bygger om bilen på plats (efter volt eller reset). */
export function resetCar(w: DriveWorld, x: number) {
  Composite.remove(w.engine.world, w.car);
  const { car, chassis, wheels } = buildCar(w.build, w.stats, x, w.track.groundY(x));
  Composite.add(w.engine.world, car);
  w.car = car;
  w.chassis = chassis;
  w.wheels = wheels;
  w.upsideDownFrames = 0;
}

const STEP = 1000 / 60;

function touchesGround(w: DriveWorld): boolean {
  const wheels = new Set<Matter.Body>(w.wheels);
  return w.engine.pairs.list.some(
    (p: Matter.Pair) => p.isActive && (wheels.has(p.bodyA) || wheels.has(p.bodyB)) && (p.bodyA.isStatic || p.bodyB.isStatic),
  );
}

/**
 * Ett fysiksteg. Gas lägger vridmoment på hjulen (kraften ur motorn),
 * greppet mot marken avgör hur mycket som blir fart. Broms bromsar hjulen.
 */
export function stepWorld(w: DriveWorld, input: DriveInput) {
  const { stats } = w;
  const r = (SLOTS.wheel.width / 2) * DRIVE_SCALE;
  const maxSpeed = 150 + stats.topSpeed * 220; // px/s
  const maxOmega = (maxSpeed / r) * (STEP / 1000); // rad per steg
  const torque = (stats.power * 0.45) / Math.max(1, w.wheels.length);

  for (const wheel of w.wheels) {
    const cur = wheel.angularVelocity;
    if (input.brake) Body.setAngularVelocity(wheel, cur * 0.8);
    else if (input.gas && cur < maxOmega) wheel.torque = torque;
    if (cur > maxOmega) Body.setAngularVelocity(wheel, maxOmega);
  }

  // I luften rätar bilen sakta upp sig så hopp oftast landar på hjulen.
  if (w.chassis && !touchesGround(w)) {
    const angle = Math.atan2(Math.sin(w.chassis.angle), Math.cos(w.chassis.angle));
    Body.setAngularVelocity(w.chassis, w.chassis.angularVelocity * 0.97 - angle * 0.002);
  }

  Engine.update(w.engine, STEP);

  // Ligger bilen upp och ner ett tag vänder Skruvis den rätt igen. Inget nederlag.
  if (w.chassis) {
    const a = Math.abs(((w.chassis.angle + Math.PI) % (2 * Math.PI)) - Math.PI);
    w.upsideDownFrames = a > 1.9 ? w.upsideDownFrames + 1 : 0;
    if (w.upsideDownFrames > 120) resetCar(w, w.chassis.position.x);
  }
}
