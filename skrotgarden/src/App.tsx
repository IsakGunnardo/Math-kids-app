import { Stage } from './components/Stage.tsx';
import { SceneNav } from './components/SceneNav.tsx';
import { RotateHint } from './components/RotateHint.tsx';
import { useGame } from './state/store.ts';
import { YardScene } from './scenes/YardScene.tsx';
import { GarageScene } from './scenes/GarageScene.tsx';
import { DriveScene } from './scenes/DriveScene.tsx';

const SCENES = {
  yard: YardScene,
  garage: GarageScene,
  drive: DriveScene,
} as const;

export function App() {
  const scene = useGame((s) => s.scene);
  const Scene = SCENES[scene];
  return (
    <>
      <Stage>
        {/* key = scene ger in-animation vid varje byte */}
        <Scene key={scene} />
        <SceneNav />
      </Stage>
      <RotateHint />
    </>
  );
}
