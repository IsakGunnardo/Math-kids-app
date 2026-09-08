import { useGame } from '../state/store.ts';
import type { SceneId } from '../data/types.ts';
import { STAGE } from '../data/assets.ts';
import { IconButton } from './IconButton.tsx';

const NAV: { scene: SceneId; icon: string; label: string }[] = [
  { scene: 'yard', icon: 'btn_yard', label: 'Skrotgården' },
  { scene: 'garage', icon: 'btn_garage', label: 'Garaget' },
  { scene: 'drive', icon: 'btn_drive', label: 'Provkör' },
];

/** Tre stora knappar uppe till höger som byter scen. */
export function SceneNav() {
  const scene = useGame((s) => s.scene);
  const setScene = useGame((s) => s.setScene);
  const size = 120;
  const gap = 20;
  const x0 = STAGE.width - NAV.length * (size + gap);
  const y = 24;

  return (
    <>
      {NAV.map((n, i) => (
        <IconButton
          key={n.scene}
          icon={n.icon}
          label={n.label}
          x={x0 + i * (size + gap)}
          y={y}
          size={size}
          active={n.scene === scene}
          onPress={() => setScene(n.scene)}
        />
      ))}
    </>
  );
}
