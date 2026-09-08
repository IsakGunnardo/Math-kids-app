import { useEffect, useRef } from 'react';
import { Stage } from './components/Stage.tsx';
import { SceneNav } from './components/SceneNav.tsx';
import { RotateHint } from './components/RotateHint.tsx';
import { PickTokens } from './components/PickTokens.tsx';
import { IconButton } from './components/IconButton.tsx';
import { useGame } from './state/store.ts';
import { audio } from './systems/audio.ts';
import { canDrive, computeCarStats } from './systems/carStats.ts';
import { YardScene } from './scenes/YardScene.tsx';
import { GarageScene } from './scenes/GarageScene.tsx';
import { DriveScene } from './scenes/DriveScene.tsx';
import type { SceneId } from './data/types.ts';
import './components/hud.css';

const SCENES = {
  yard: YardScene,
  garage: GarageScene,
  drive: DriveScene,
} as const;

/** Vilken knapp som ska pulsera: gården när det finns plock, annars bygga eller köra. */
function nextStep(scene: SceneId, picks: number, drivable: boolean): SceneId | null {
  if (scene === 'yard') return picks > 0 ? null : drivable ? 'drive' : 'garage';
  if (scene === 'garage') return drivable ? 'drive' : picks > 0 ? 'yard' : null;
  return null;
}

export function App() {
  const scene = useGame((s) => s.scene);
  const picks = useGame((s) => s.picks);
  const car = useGame((s) => s.car);
  const soundOn = useGame((s) => s.soundOn);
  const toggleSound = useGame((s) => s.toggleSound);
  const Scene = SCENES[scene];
  const first = useRef(true);

  // Ljudet väcks av första pekningen (krav på iOS) och följer inställningen.
  useEffect(() => {
    const unlock = () => audio.unlock();
    window.addEventListener('pointerdown', unlock, { once: true });
    return () => window.removeEventListener('pointerdown', unlock);
  }, []);
  useEffect(() => audio.setEnabled(soundOn), [soundOn]);
  useEffect(() => {
    if (first.current) first.current = false;
    else audio.play('whoosh', { volume: 0.5 });
  }, [scene]);

  return (
    <>
      <Stage>
        {/* key = scene ger in-animation vid varje byte */}
        <Scene key={scene} />
        <SceneNav hint={nextStep(scene, picks, canDrive(computeCarStats(car)))} />
        <IconButton icon="btn_sound" label={soundOn ? 'Ljud av' : 'Ljud på'} x={24} y={24} size={72} active={false} onPress={toggleSound} />
        {!soundOn && <div className="sound-off" />}
        <PickTokens count={picks} />
      </Stage>
      <RotateHint />
    </>
  );
}
