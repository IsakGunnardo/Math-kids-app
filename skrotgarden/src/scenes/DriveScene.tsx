import { useEffect, useRef, useState } from 'react';
import { STAGE } from '../data/assets.ts';
import { useGame } from '../state/store.ts';
import { HoldButton } from '../components/HoldButton.tsx';
import { IconButton } from '../components/IconButton.tsx';
import { Sprite } from '../components/Sprite.tsx';
import { DriveSession } from '../systems/driveLoop.ts';
import { canDrive, computeCarStats } from '../systems/carStats.ts';

const KEYS_GAS = new Set(['ArrowRight', 'ArrowUp', 'KeyD', 'KeyW']);
const KEYS_BRAKE = new Set(['ArrowLeft', 'ArrowDown', 'KeyA', 'KeyS', 'Space']);

/**
 * Provkörningen: Matter.js-fysik ritad i en canvas. Gas och broms hålls
 * nere (knappar eller piltangenter). Delmål på banan ger nya plock.
 */
export function DriveScene() {
  const car = useGame((s) => s.car);
  const grantPicks = useGame((s) => s.grantPicks);
  const recordFinish = useGame((s) => s.recordFinish);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const session = useRef<DriveSession | null>(null);
  const [finished, setFinished] = useState(false);
  const drivable = canDrive(computeCarStats(car));

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const s = new DriveSession(car, ctx, {
      onCheckpoint: (_i, picks) => grantPicks(picks),
      onFinish: () => {
        recordFinish();
        setFinished(true);
      },
    });
    session.current = s;
    // Testkrok: låter automatiska tester läsa bilens position.
    (window as unknown as { __SKROT_WORLD__?: unknown }).__SKROT_WORLD__ = s.world;
    void s.start();

    const key = (pressed: boolean) => (e: KeyboardEvent) => {
      if (KEYS_GAS.has(e.code)) s.input.gas = pressed;
      if (KEYS_BRAKE.has(e.code)) s.input.brake = pressed;
    };
    const down = key(true);
    const up = key(false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      s.stop();
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [car, grantPicks, recordFinish]);

  const setInput = (k: 'gas' | 'brake', v: boolean) => () => {
    if (session.current) session.current.input[k] = v;
  };

  return (
    <div className="scene">
      <canvas
        ref={canvasRef}
        width={STAGE.width}
        height={STAGE.height}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
      <HoldButton icon="btn_brake" label="Broms" x={40} y={STAGE.height - 200} onDown={setInput('brake', true)} onUp={setInput('brake', false)} />
      <HoldButton icon="btn_gas" label="Gas" x={230} y={STAGE.height - 200} onDown={setInput('gas', true)} onUp={setInput('gas', false)} />
      <IconButton
        icon="btn_reset"
        label="Börja om"
        x={1180 - 140}
        y={24}
        size={120}
        onPress={() => {
          session.current?.reset();
          setFinished(false);
        }}
      />

      {!drivable && (
        <Sprite sprite="char/skruvis_think" className="abs" style={{ left: 660, top: 200, width: 280, height: 370 }} />
      )}
      {finished && (
        <>
          <Sprite sprite="char/mira_cheer" className="abs cheer" style={{ left: 1150, top: 300, width: 300, height: 400 }} />
          <Sprite sprite="char/skruvis_cheer" className="abs cheer" style={{ left: 120, top: 260, width: 300, height: 400 }} />
        </>
      )}
    </div>
  );
}
