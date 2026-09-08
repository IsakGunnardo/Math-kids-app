import type { MountKey } from '../data/types.ts';
import { SLOTS } from '../data/slots.ts';
import { getChassis, getPart } from '../data/parts.ts';
import { STAGE } from '../data/assets.ts';
import { loadImage } from './assets.ts';
import { BODY_OFFSET_Y, DRIVE_SCALE, type DriveWorld } from './physics.ts';
import { FINISH_X, WALL_X } from './track.ts';
import type { Particles } from './particles.ts';

export type ImageMap = Map<string, HTMLImageElement>;

export interface Camera {
  x: number;
  y: number;
}

const LAYER: Record<string, number> = { roof: 0, seat: 1, motor: 3, steering: 4, light: 5, extra: 6 };

/** Laddar alla bilder som behövs för att rita världen. */
export async function loadDriveImages(w: DriveWorld): Promise<ImageMap> {
  const names = ['bg/track_sky', 'bg/track_hills', 'bg/track_ground', 'char/mira_idle'];
  const chassis = getChassis(w.build.chassis);
  if (chassis) names.push(chassis.sprite);
  for (const id of Object.values(w.build.parts)) {
    const p = id ? getPart(id) : undefined;
    if (p) names.push(p.sprite);
  }
  const imgs = await Promise.all(names.map(loadImage));
  return new Map(names.map((n, i) => [n, imgs[i]]));
}

/** Kameran följer bilen mjukt; marken hålls i nedre delen av bilden. */
export function updateCamera(cam: Camera, w: DriveWorld) {
  const target = w.chassis
    ? { x: w.chassis.position.x - STAGE.width * 0.35, y: w.chassis.position.y - STAGE.height * 0.62 }
    : { x: 0, y: -STAGE.height * 0.75 };
  cam.x += (target.x - cam.x) * 0.12;
  cam.y += (target.y - cam.y) * 0.08;
}

function drawBackground(ctx: CanvasRenderingContext2D, imgs: ImageMap, cam: Camera) {
  const { width: W, height: H } = STAGE;
  ctx.drawImage(imgs.get('bg/track_sky')!, 0, 0, W, H);
  const hills = imgs.get('bg/track_hills')!;
  const hw = W;
  const hx = -(((cam.x * 0.3) % hw) + hw) % hw;
  const hy = H - 520 - cam.y * 0.1;
  ctx.drawImage(hills, hx, hy, hw, 320);
  ctx.drawImage(hills, hx + hw, hy, hw, 320);
}

function drawGround(ctx: CanvasRenderingContext2D, imgs: ImageMap, w: DriveWorld, cam: Camera) {
  const pts = w.track.points;
  const left = cam.x - 100;
  const right = cam.x + STAGE.width + 100;
  const bottom = cam.y + STAGE.height + 100;
  ctx.beginPath();
  let started = false;
  for (const p of pts) {
    if (p.x < left - 80 || p.x > right + 80) continue;
    if (!started) {
      ctx.moveTo(p.x, bottom);
      started = true;
    }
    ctx.lineTo(p.x, p.y);
  }
  if (!started) return;
  ctx.lineTo(pts[pts.length - 1].x, bottom);
  ctx.closePath();
  const pattern = ctx.createPattern(imgs.get('bg/track_ground')!, 'repeat');
  ctx.fillStyle = pattern ?? '#8d6e4a';
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#3f2d1a';
  ctx.lineJoin = 'round';
  ctx.stroke();
}

function drawFinish(ctx: CanvasRenderingContext2D, w: DriveWorld) {
  const wy = w.track.groundY(WALL_X);
  ctx.fillStyle = '#6d6d6d';
  ctx.beginPath();
  ctx.roundRect(WALL_X - 80, wy - 180, 160, 190, 40);
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#3f2d1a';
  ctx.stroke();
  const y = w.track.groundY(FINISH_X);
  ctx.fillStyle = '#3f2d1a';
  ctx.fillRect(FINISH_X - 6, y - 260, 12, 260);
  ctx.fillStyle = '#e91e63';
  ctx.beginPath();
  ctx.moveTo(FINISH_X + 6, y - 260);
  ctx.lineTo(FINISH_X + 130, y - 215);
  ctx.lineTo(FINISH_X + 6, y - 170);
  ctx.closePath();
  ctx.fill();
}

/** Mira sitter i sätet och guppar mer ju sämre komforten är. */
function drawDriver(ctx: CanvasRenderingContext2D, imgs: ImageMap, w: DriveWorld, time: number) {
  const chassis = getChassis(w.build.chassis);
  const mira = imgs.get('char/mira_idle');
  if (!chassis || !mira || !w.build.parts.seat || !w.chassis) return;
  const S = DRIVE_SCALE;
  const speed = Math.min(1, Math.abs(w.chassis.velocity.x) / 3);
  const amp = Math.max(0, 9 - w.stats.comfort) * speed * 0.9;
  const m = chassis.mounts.seat;
  const bob = Math.sin(time * 14) * amp;
  ctx.drawImage(mira, m.x * S - 40, m.y * S - 120 + bob, 84, 112);
}

function drawCar(ctx: CanvasRenderingContext2D, imgs: ImageMap, w: DriveWorld, time: number) {
  const chassisPart = getChassis(w.build.chassis);
  if (!w.chassis || !chassisPart) return;
  const S = DRIVE_SCALE;
  const W = SLOTS.chassis.width * S;
  const H = SLOTS.chassis.height * S;

  ctx.save();
  const j = w.fx.jitter;
  ctx.translate(w.chassis.position.x + (Math.random() - 0.5) * j, w.chassis.position.y + (Math.random() - 0.5) * j);
  ctx.rotate(w.chassis.angle);
  ctx.translate(-W / 2, -H / 2 - BODY_OFFSET_Y);
  const parts = [...w.bodyParts].sort((a, b) => LAYER[a.key] - LAYER[b.key]);
  const drawPart = (key: MountKey, sprite: string) => {
    const slot = getPart(w.build.parts[key]!)!.slot;
    const m = chassisPart.mounts[key as keyof typeof chassisPart.mounts];
    const pw = SLOTS[slot].width * S;
    const ph = SLOTS[slot].height * S;
    const img = imgs.get(sprite);
    if (img) ctx.drawImage(img, m.x * S - pw / 2, m.y * S - ph / 2, pw, ph);
  };
  for (const { key, part } of parts) if (LAYER[key] < 2) drawPart(key, part.sprite);
  drawDriver(ctx, imgs, w, time);
  const chassisImg = imgs.get(chassisPart.sprite);
  if (chassisImg) ctx.drawImage(chassisImg, 0, 0, W, H);
  for (const { key, part } of parts) if (LAYER[key] >= 2) drawPart(key, part.sprite);
  ctx.restore();

  const r = (SLOTS.wheel.width / 2) * S;
  w.wheels.forEach((wheel, i) => {
    const id = w.build.parts[`wheel_${i}`];
    const img = id ? imgs.get(getPart(id)!.sprite) : undefined;
    if (!img) return;
    ctx.save();
    ctx.translate(wheel.position.x, wheel.position.y);
    ctx.rotate(wheel.angle);
    if (w.fx.wobble) {
      const k = 0.08 * Math.sin(time * 12 + i);
      ctx.scale(1 + k, 1 - k);
    }
    ctx.drawImage(img, -r, -r, r * 2, r * 2);
    ctx.restore();
  });
}

/** Ritar en hel bildruta. */
export function drawFrame(
  ctx: CanvasRenderingContext2D,
  imgs: ImageMap,
  w: DriveWorld,
  cam: Camera,
  particles: Particles,
  time: number,
) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, STAGE.width, STAGE.height);
  drawBackground(ctx, imgs, cam);
  ctx.translate(-cam.x, -cam.y);
  drawGround(ctx, imgs, w, cam);
  drawFinish(ctx, w);
  drawCar(ctx, imgs, w, time);
  particles.draw(ctx);
}
