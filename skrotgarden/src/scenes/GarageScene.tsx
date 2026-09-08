import { useMemo } from 'react';
import { Sprite } from '../components/Sprite.tsx';
import { CarView } from '../components/CarView.tsx';
import { DragGhost } from '../components/DragGhost.tsx';
import { Inventory } from '../components/Inventory.tsx';
import { SavedShelf } from '../components/SavedShelf.tsx';
import { IconButton } from '../components/IconButton.tsx';
import { useDrag, type Drag } from '../components/useDrag.ts';
import { useGame } from '../state/store.ts';
import { getChassis, getPart } from '../data/parts.ts';
import type { MountKey } from '../data/types.ts';
import { canDrive, computeCarStats } from '../systems/carStats.ts';
import { dismantle, mount, setChassis, unmount, type Garage } from '../systems/build.ts';
import { CAR_ORIGIN, CAR_SCALE, findSnap, mountTargets } from '../systems/garageLayout.ts';
import { audio } from '../systems/audio.ts';
import './garage.css';

/**
 * Garaget: dra delar från raden längst ner till bilen. Delar snappar mot
 * lediga fästen som passar; fel del går helt enkelt inte att släppa.
 */
export function GarageScene() {
  const car = useGame((s) => s.car);
  const inventory = useGame((s) => s.inventory);
  const savedCars = useGame((s) => s.savedCars);
  const setGarage = useGame((s) => s.setGarage);
  const saveCar = useGame((s) => s.saveCar);
  const loadCar = useGame((s) => s.loadCar);

  const chassis = getChassis(car.chassis);
  const targets = useMemo(() => mountTargets(chassis), [chassis]);
  const stats = useMemo(() => computeCarStats(car), [car]);

  const { drag, start } = useDrag({
    findSnap: (slot, x, y) => findSnap(slot, x, y, targets),
    onDrop: (d: Drag) => {
      let g: Garage = { car, inventory };
      // Delar som dras från bilen tas först loss så de kan monteras om.
      if (d.source.kind === 'car') {
        g = d.source.key === 'chassis' ? dismantle(g) : unmount(g, d.source.key);
      }
      if (d.snap) {
        g = d.snap.key === 'chassis' ? setChassis(g, d.partId) : mount(g, d.partId, d.snap.key as MountKey);
        audio.play('snap');
      } else {
        audio.play(d.source.kind === 'car' ? 'clunk' : 'nope', { volume: 0.6 });
      }
      setGarage(g);
    },
  });

  const draggingIndex = drag?.source.kind === 'inventory' ? drag.source.index : null;
  const hiddenKey = drag?.source.kind === 'car' ? drag.source.key : null;

  return (
    <div className="scene">
      <Sprite sprite="bg/garage" className="scene-bg" />

      <SavedShelf cars={savedCars} current={car} onLoad={loadCar} />

      <CarView
        build={car}
        origin={CAR_ORIGIN}
        scale={CAR_SCALE}
        interaction={{
          hotSlot: drag?.slot ?? null,
          hiddenKey,
          onPartDown: (key, partId, e) => {
            const slot = key === 'chassis' ? 'chassis' : targets.find((t) => t.key === key)!.slot;
            audio.play('pick', { volume: 0.7 });
            start(partId, slot, { kind: 'car', key }, e);
          },
        }}
      />

      <IconButton
        icon="btn_save"
        label="Spara bilen"
        x={1090}
        y={470}
        size={130}
        active={false}
        onPress={() => {
          saveCar();
          audio.play('sparkle');
        }}
      />

      <Sprite
        sprite={canDrive(stats) ? 'char/mira_cheer' : 'char/mira_think'}
        className="abs"
        style={{ left: 1250, top: 280, width: 240, height: 320 }}
      />

      <Inventory
        items={inventory}
        draggingIndex={draggingIndex}
        onStart={(index, partId, e) => {
          const part = getPart(partId);
          if (!part) return;
          audio.play('pick', { volume: 0.7 });
          start(partId, part.slot, { kind: 'inventory', index }, e);
        }}
      />

      {drag && <DragGhost drag={drag} />}
    </div>
  );
}
