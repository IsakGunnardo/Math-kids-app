import { Sprite } from './Sprite.tsx';

/** Täcker skärmen i porträttläge med en "vrid mig"-bild. Visas via CSS. */
export function RotateHint() {
  return (
    <div className="rotate-hint" aria-hidden="true">
      <Sprite sprite="ui/rotate" />
    </div>
  );
}
