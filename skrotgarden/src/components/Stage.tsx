import { useEffect, useState, type ReactNode } from 'react';
import { STAGE } from '../data/assets.ts';

function fitScale(): number {
  const vv = window.visualViewport;
  const w = vv?.width ?? window.innerWidth;
  const h = vv?.height ?? window.innerHeight;
  return Math.min(w / STAGE.width, h / STAGE.height);
}

/**
 * Fast designyta på 1600x1000 som skalas för att få plats på skärmen.
 * Allt i spelet positioneras i designpixlar, oavsett enhet.
 */
export function Stage({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(fitScale);

  useEffect(() => {
    const update = () => setScale(fitScale());
    window.addEventListener('resize', update);
    window.visualViewport?.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return (
    <div className="stage-wrap">
      <div
        className="stage"
        style={{
          width: STAGE.width,
          height: STAGE.height,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** Aktuell skala, för att översätta pekar-koordinater till designpixlar. */
export function useStageScale(): number {
  const [scale, setScale] = useState(fitScale);
  useEffect(() => {
    const update = () => setScale(fitScale());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}
