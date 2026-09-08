import type { CarBuild } from '../data/types.ts';
import { STAGE } from '../data/assets.ts';
import { audio } from './audio.ts';
import { drawFrame, loadDriveImages, updateCamera, type Camera, type ImageMap } from './driveRender.ts';
import { Particles } from './particles.ts';
import { createWorld, resetCar, stepWorld, type DriveInput, type DriveWorld } from './physics.ts';
import { createQuirkState, updateQuirks, type QuirkState } from './quirks.ts';
import { TRACK_START_X } from './track.ts';
import { CHECKPOINTS } from './yard.ts';

export interface DriveCallbacks {
  onCheckpoint: (index: number, picks: number) => void;
  onFinish: () => void;
}

const STEP = 1000 / 60;

/** Kör fysik, effekter, ljud och rendering i en requestAnimationFrame-loop. */
export class DriveSession {
  readonly world: DriveWorld;
  readonly input: DriveInput = { gas: false, brake: false };
  /** Extra inmatning från lutning; slås ihop med knappar och tangenter. */
  readonly tilt: DriveInput = { gas: false, brake: false };
  private particles = new Particles();
  private quirks: QuirkState;
  private cam: Camera = { x: 0, y: -STAGE.height * 0.6 };
  private imgs: ImageMap | null = null;
  private raf = 0;
  private stopped = false;
  private last = 0;
  private acc = 0;
  private time = 0;
  private reached = new Set<number>();
  private ctx: CanvasRenderingContext2D;
  private cb: DriveCallbacks;

  constructor(build: CarBuild, ctx: CanvasRenderingContext2D, cb: DriveCallbacks) {
    this.ctx = ctx;
    this.cb = cb;
    this.world = createWorld(build);
    this.quirks = createQuirkState(this.world);
  }

  async start() {
    this.imgs = await loadDriveImages(this.world);
    if (this.stopped) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  stop() {
    this.stopped = true;
    cancelAnimationFrame(this.raf);
    audio.stopLoop('engine');
  }

  reset() {
    resetCar(this.world, TRACK_START_X);
    this.reached.clear();
  }

  private frame = (now: number) => {
    if (this.stopped || !this.imgs) return;
    this.acc = Math.min(this.acc + (now - this.last), STEP * 4);
    this.last = now;
    const input: DriveInput = {
      gas: this.input.gas || this.tilt.gas,
      brake: this.input.brake || this.tilt.brake,
    };
    while (this.acc >= STEP) {
      stepWorld(this.world, input);
      updateQuirks(this.quirks, this.world, input, STEP / 1000, this.particles);
      this.particles.update(STEP / 1000);
      this.time += STEP / 1000;
      this.acc -= STEP;
    }
    updateCamera(this.cam, this.world);
    drawFrame(this.ctx, this.imgs, this.world, this.cam, this.particles, this.time);
    this.updateEngineSound();
    this.checkProgress();
    this.raf = requestAnimationFrame(this.frame);
  };

  private updateEngineSound() {
    const w = this.world;
    if (!w.chassis || !w.wheels.length || w.stats.power <= 0) return;
    const speed = Math.abs(w.chassis.velocity.x);
    const gas = this.input.gas || this.tilt.gas;
    const rate = 0.6 + Math.min(1.4, speed / 5) + (gas ? 0.2 : 0);
    audio.loop('engine', { rate, volume: gas ? 0.45 : 0.2 });
  }

  private checkProgress() {
    const x = this.world.chassis?.position.x ?? 0;
    CHECKPOINTS.forEach((c, i) => {
      if (this.reached.has(i) || x < c.x) return;
      this.reached.add(i);
      this.cb.onCheckpoint(i, c.picks);
      if (i === CHECKPOINTS.length - 1) {
        audio.play('cheer');
        this.particles.confettiBurst(x, (this.world.chassis?.position.y ?? 0) - 150, 120);
        this.cb.onFinish();
      } else {
        audio.play('sparkle', { volume: 0.6 });
      }
    });
  }
}
