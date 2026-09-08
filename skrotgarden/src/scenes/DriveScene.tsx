import { useEffect, useRef } from 'react';
import { STAGE } from '../data/assets.ts';
import { loadImage } from '../systems/assets.ts';
import { IconButton } from '../components/IconButton.tsx';

/**
 * Steg 1: bevisar canvas-pipelinen (bakgrundslager ritas i en <canvas>).
 * Matter.js, bana och bil kommer i steg 3.
 */
export function DriveScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let stopped = false;

    Promise.all([loadImage('bg/track_sky'), loadImage('bg/track_hills'), loadImage('bg/track_ground')])
      .then(([sky, hills, ground]) => {
        const draw = (t: number) => {
          if (stopped) return;
          const { width: W, height: H } = STAGE;
          const scroll = (t / 1000) * 60;
          ctx.clearRect(0, 0, W, H);
          ctx.drawImage(sky, 0, 0, W, H);

          const hw = W;
          const hx = -((scroll * 0.3) % hw);
          ctx.drawImage(hills, hx, H - 500, hw, 320);
          ctx.drawImage(hills, hx + hw, H - 500, hw, 320);

          const gy = H - 200;
          const gx = -(scroll % 256);
          for (let x = gx; x < W; x += 256) ctx.drawImage(ground, x, gy, 256, 256);

          raf = requestAnimationFrame(draw);
        };
        raf = requestAnimationFrame(draw);
      })
      .catch(console.error);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="scene">
      <canvas
        ref={canvasRef}
        width={STAGE.width}
        height={STAGE.height}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
      <IconButton icon="btn_brake" label="Broms" x={40} y={STAGE.height - 200} size={160} onPress={() => {}} />
      <IconButton icon="btn_gas" label="Gas" x={230} y={STAGE.height - 200} size={160} onPress={() => {}} />
      <div className="debug-label">Provkörning</div>
    </div>
  );
}
