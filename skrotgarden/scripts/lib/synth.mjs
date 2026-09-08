import { render, env } from './wav.mjs';

const sine = (f, t) => Math.sin(2 * Math.PI * f * t);
const square = (f, t) => (sine(f, t) > 0 ? 1 : -1);
const saw = (f, t) => 2 * ((f * t) % 1) - 1;
let seed = 1;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;

/** Enkla syntetiserade platshållarljud, ett per id i data/sfx.ts. */
export const SYNTH = {
  pick: (s) => render(s, (t) => sine(660 + 400 * t, t) * env(t, 0.005, s) * 0.5),
  snap: (s) =>
    render(s, (t) => (sine(220, t) * env(t, 0.002, 0.08) + rnd() * env(t, 0.001, 0.03) * 0.6) * 0.6),
  nope: (s) => render(s, (t) => sine(300 - 150 * t, t) * env(t, 0.01, s) * 0.4),
  engine: (s) =>
    render(s, (t) => (saw(55, t) * 0.4 + saw(110, t) * 0.2 + rnd() * 0.05) * 0.5),
  horn: (s) =>
    render(s, (t) => (square(330, t) * 0.3 + square(415, t) * 0.3) * env(t, 0.02, s) * 0.5),
  bubbles: (s) =>
    render(s, (t) => {
      const k = Math.floor(t * 12);
      const lt = t - k / 12;
      return sine(400 + k * 90 + 800 * lt, t) * env(lt, 0.005, 0.07) * 0.4;
    }),
  clunk: (s) => render(s, (t) => (sine(120, t) * env(t, 0.003, 0.15) + rnd() * env(t, 0.001, 0.05) * 0.5) * 0.7),
  whoosh: (s) => render(s, (t) => rnd() * env(t, s * 0.4, s) * 0.35),
  cheer: (s) =>
    render(s, (t) => {
      const notes = [523, 659, 784, 1047];
      const k = Math.min(3, Math.floor(t * 4));
      return sine(notes[k], t) * env(t - k / 4, 0.01, 0.25) * 0.4;
    }),
  sparkle: (s) =>
    render(s, (t) => {
      const k = Math.floor(t * 16);
      return sine(1200 + ((k * 37) % 5) * 300, t) * env(t - k / 16, 0.002, 0.06) * 0.3;
    }),
};
