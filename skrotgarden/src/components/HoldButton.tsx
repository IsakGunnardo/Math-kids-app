import { Sprite } from './Sprite.tsx';

interface Props {
  icon: string;
  label: string;
  x: number;
  y: number;
  size?: number;
  onDown: () => void;
  onUp: () => void;
}

/** Bildknapp som rapporterar när den hålls nere (gas/broms). */
export function HoldButton({ icon, label, x, y, size = 160, onDown, onUp }: Props) {
  return (
    <button
      type="button"
      className="icon-btn hold-btn"
      aria-label={label}
      title={label}
      style={{ left: x, top: y, width: size, height: size }}
      onPointerDown={(e) => {
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        onDown();
      }}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onLostPointerCapture={onUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Sprite sprite={`ui/${icon}`} alt="" />
    </button>
  );
}
