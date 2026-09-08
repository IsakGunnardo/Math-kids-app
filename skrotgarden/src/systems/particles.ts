export type ParticleKind = 'bubble' | 'nut' | 'star' | 'note' | 'confetti' | 'smoke' | 'burst';

export interface Particle {
  kind: ParticleKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  rot: number;
  spin: number;
  gravity: number;
}

const CONFETTI = ['#e91e63', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6', '#ff7f50'];

/** Små visuella händelser under körningen: bubblor, muttrar, glitter, konfetti. */
export class Particles {
  list: Particle[] = [];

  spawn(p: Partial<Particle> & { kind: ParticleKind; x: number; y: number }) {
    this.list.push({
      vx: 0,
      vy: 0,
      life: 1,
      maxLife: 1,
      size: 10,
      color: '#fff',
      rot: 0,
      spin: 0,
      gravity: 0,
      ...p,
    });
    if (this.list.length > 400) this.list.splice(0, this.list.length - 400);
  }

  confettiBurst(x: number, y: number, n = 80) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = 4 + Math.random() * 9;
      this.spawn({
        kind: 'confetti',
        x,
        y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 6,
        life: 2.5,
        maxLife: 2.5,
        size: 8 + Math.random() * 8,
        color: CONFETTI[i % CONFETTI.length],
        rot: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.4,
        gravity: 0.25,
      });
    }
  }

  update(dt: number) {
    for (const p of this.list) {
      p.life -= dt;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.spin;
      if (p.kind === 'confetti') p.vx *= 0.98;
    }
    this.list = this.list.filter((p) => p.life > 0);
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const p of this.list) {
      const t = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.kind === 'smoke' ? t * 0.5 : Math.min(1, t * 3);
      drawShape(ctx, p, t);
      ctx.restore();
    }
  }
}

function drawShape(ctx: CanvasRenderingContext2D, p: Particle, t: number) {
  const s = p.size;
  ctx.fillStyle = p.color;
  ctx.strokeStyle = p.color;
  ctx.lineWidth = 3;
  switch (p.kind) {
    case 'bubble':
      ctx.beginPath();
      ctx.arc(0, 0, s, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-s * 0.35, -s * 0.35, s * 0.2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'smoke':
      ctx.beginPath();
      ctx.arc(0, 0, s * (2 - t), 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'nut':
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
      }
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#333';
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'star':
    case 'burst':
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const r = i % 2 ? s * 0.4 : s;
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
      break;
    case 'note':
      ctx.font = `${s * 2}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('♪', 0, s);
      break;
    case 'confetti':
      ctx.fillRect(-s / 2, -s / 4, s, s / 2);
      break;
  }
}
