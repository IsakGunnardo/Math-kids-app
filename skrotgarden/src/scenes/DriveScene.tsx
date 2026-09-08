import { useEffect, useRef, useState } from 'react';
import { STAGE } from '../data/assets.ts';
import { useGame } from '../state/store.ts';
import { HoldButton } from '../components/HoldButton.tsx';
import { IconButton } from '../components/IconButton.tsx';
import { Sprite } from '../components/Sprite.tsx';
import { createWorld, resetCar, stepWorld, type DriveInput } from '../systems/physics.ts';
import { drawFrame, loadDriveImages, updateCamera, type Camera } from '../systems/driveRender.ts';
import { FINISH_X, TRACK_START_X } from '../systems/track.ts';
import { canDrive } from '../systems/carStats.ts';

const KEYS_GAS = new Set(['ArrowRight', 'ArrowUp', 'KeyD', 'KeyW']);
const KEYS_BRAKE = new Set(['ArrowLeft', 'ArrowDown', 'KeyA', 'KeyS', 'Space']);

/**
 * Provkörningen: Matter.js-fysik ritad i en canvas. Gas och broms hålls
 * nere (knappar eller piltangenter). Målflaggan står efter stora backen.
 */
export function DriveScene() {
  const car = useGame((s) => s.car);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const input = useRef<DriveInput>({ gas: false, brake: false });
  const worldRef = useRef<ReturnType<typeof createWorld> | null>(null);
  const [finished, setFinished] = useState(false);
  const [drivable, setDrivable] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const world = createWorld(car);
    worldRef.current = world;
    // Testkrok: låter automatiska tester läsa bilens position.
    (window as unknown as { __SKROT_WORLD__?: unknown }).__SKROT_WORLD__ = world;
    setDrivable(canDrive(world.stats));
    const cam: Camera = { x: 0, y: -STAGE.height * 0.6 };
    let raf = 0;
    let stopped = false;
    let last = performance.now();
    let acc = 0;

    loadDriveImages(world).then((imgs) => {
      const frame = (now: number) => {
        if (stopped) return;
        acc = Math.min(acc + (now - last), 1000 / 60 * 4);
        last = now;
        while (acc >= 1000 / 60) {
          stepWorld(world, input.current);
          acc -= 1000 / 60;
        }
        updateCamera(cam, world);
        drawFrame(ctx, imgs, world, cam);
        if (world.chassis && world.chassis.position.x > FINISH_X) setFinished(true);
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    });

    const down = (e: KeyboardEvent) => {
      if (KEYS_GAS.has(e.code)) input.current.gas = true;
      if (KEYS_BRAKE.has(e.code)) input.current.brake = true;
    };
    const up = (e: KeyboardEvent) => {
      if (KEYS_GAS.has(e.code)) input.current.gas = false;
      if (KEYS_BRAKE.has(e.code)) input.current.brake = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [car]);

  const reset = () => {
    if (worldRef.current) resetCar(worldRef.current, TRACK_START_X);
    setFinished(false);
  };

  return (
    <div className="scene">
      <canvas
        ref={canvasRef}
        width={STAGE.width}
        height={STAGE.height}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
      <HoldButton
        icon="btn_brake"
        label="Broms"
        x={40}
        y={STAGE.height - 200}
        onDown={() => (input.current.brake = true)}
        onUp={() => (input.current.brake = false)}
      />
      <HoldButton
        icon="btn_gas"
        label="Gas"
        x={230}
        y={STAGE.height - 200}
        onDown={() => (input.current.gas = true)}
        onUp={() => (input.current.gas = false)}
      />
      <IconButton icon="btn_reset" label="Börja om" x={1180 - 140} y={24} size={120} onPress={reset} />

      {!drivable && (
        <Sprite sprite="char/skruvis_think" className="abs" style={{ left: 660, top: 200, width: 280, height: 370 }} />
      )}
      {finished && (
        <Sprite sprite="char/mira_cheer" className="abs cheer" style={{ left: 1150, top: 300, width: 300, height: 400 }} />
      )}
      <div className="debug-label">Provkörning</div>
    </div>
  );
}
