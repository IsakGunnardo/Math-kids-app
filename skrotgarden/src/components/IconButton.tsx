import { Sprite } from './Sprite.tsx';

interface Props {
  icon: string;
  label: string;
  x: number;
  y: number;
  size?: number;
  active?: boolean;
  onPress: () => void;
}

/** Stor bildknapp utan text. Position i designpixlar. */
export function IconButton({ icon, label, x, y, size = 128, active, onPress }: Props) {
  return (
    <button
      type="button"
      className={`icon-btn${active ? ' active' : ''}`}
      aria-label={label}
      title={label}
      style={{ left: x, top: y, width: size, height: size }}
      onPointerUp={(e) => {
        e.preventDefault();
        onPress();
      }}
    >
      <Sprite sprite={`ui/${icon}`} alt="" />
    </button>
  );
}
