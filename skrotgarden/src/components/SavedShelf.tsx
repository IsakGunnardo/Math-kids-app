import type { CarBuild } from '../data/types.ts';
import type { SavedCar } from '../state/store.ts';
import { sameBuild } from '../systems/build.ts';
import { CarView } from './CarView.tsx';

interface Props {
  cars: SavedCar[];
  current: CarBuild;
  onLoad: (id: string) => void;
}

const THUMB_SCALE = 0.28;

/** Hyllan med sparade bilar högst upp i garaget. Tryck på en för att hämta den. */
export function SavedShelf({ cars, current, onLoad }: Props) {
  return (
    <div className="shelf">
      {cars.map((c) => (
        <button
          key={c.id}
          type="button"
          className={`shelf-tile${sameBuild(c.build, current) ? ' active' : ''}`}
          aria-label="Hämta sparad bil"
          onPointerUp={() => onLoad(c.id)}
        >
          <CarView build={c.build} origin={{ x: 0, y: 0 }} scale={THUMB_SCALE} />
        </button>
      ))}
    </div>
  );
}
