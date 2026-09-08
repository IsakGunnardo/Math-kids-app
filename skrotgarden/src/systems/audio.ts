import { SFX } from '../data/sfx.ts';
import { sfxUrl } from './assets.ts';

interface PlayOptions {
  rate?: number;
  volume?: number;
}

interface Loop {
  source: AudioBufferSourceNode;
  gain: GainNode;
}

/** Läser en ljudfil till en ArrayBuffer; klarar även inbäddade data-URL:er. */
async function fetchBytes(url: string): Promise<ArrayBuffer> {
  if (url.startsWith('data:')) {
    const b64 = url.slice(url.indexOf(',') + 1);
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes.buffer;
  }
  const res = await fetch(url);
  return res.arrayBuffer();
}

/** Äldre Safari saknar promise-formen av decodeAudioData. */
function decode(ctx: AudioContext, bytes: ArrayBuffer): Promise<AudioBuffer> {
  return new Promise((resolve, reject) => {
    const maybe = ctx.decodeAudioData(bytes, resolve, reject);
    if (maybe && typeof (maybe as Promise<AudioBuffer>).then === 'function') {
      (maybe as Promise<AudioBuffer>).then(resolve, reject);
    }
  });
}

/**
 * Enkel Web Audio-spelare. Väcks av första pekningen (iOS kräver det),
 * laddar alla ljud i bakgrunden och spelar sedan utan fördröjning.
 */
class AudioSystem {
  private ctx: AudioContext | null = null;
  private buffers = new Map<string, AudioBuffer>();
  private loops = new Map<string, Loop>();
  private master: GainNode | null = null;
  enabled = true;

  unlock() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return;
    }
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.connect(this.ctx.destination);
    this.master.gain.value = this.enabled ? 1 : 0;
    for (const s of SFX) void this.load(s.id);
  }

  private async load(id: string) {
    if (!this.ctx || this.buffers.has(id)) return;
    for (const ext of ['mp3', 'wav'] as const) {
      const url = sfxUrl(id, ext);
      // Inbäddat läge: prova bara format som faktiskt bäddats in.
      if (window.__SKROT_ASSETS__ && !url.startsWith('data:')) continue;
      try {
        const bytes = await fetchBytes(url);
        const buf = await decode(this.ctx, bytes);
        this.buffers.set(id, buf);
        return;
      } catch {
        /* prova nästa format */
      }
    }
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    if (this.master) this.master.gain.value = on ? 1 : 0;
  }

  play(id: string, { rate = 1, volume = 1 }: PlayOptions = {}) {
    const buf = this.buffers.get(id);
    if (!this.ctx || !this.master || !buf || !this.enabled) return;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = rate;
    const gain = this.ctx.createGain();
    gain.gain.value = volume;
    src.connect(gain).connect(this.master);
    src.start();
  }

  /** Startar (eller uppdaterar) ett loopat ljud, t.ex. motorn. */
  loop(id: string, { rate = 1, volume = 1 }: PlayOptions = {}) {
    if (!this.ctx || !this.master) return;
    let l = this.loops.get(id);
    if (!l) {
      const buf = this.buffers.get(id);
      if (!buf) return;
      const source = this.ctx.createBufferSource();
      source.buffer = buf;
      source.loop = true;
      const gain = this.ctx.createGain();
      gain.gain.value = 0;
      source.connect(gain).connect(this.master);
      source.start();
      l = { source, gain };
      this.loops.set(id, l);
    }
    const t = this.ctx.currentTime;
    l.source.playbackRate.setTargetAtTime(rate, t, 0.08);
    l.gain.gain.setTargetAtTime(volume, t, 0.08);
  }

  stopLoop(id: string) {
    const l = this.loops.get(id);
    if (!l) return;
    try {
      l.source.stop();
    } catch {
      /* redan stoppad */
    }
    this.loops.delete(id);
  }
}

export const audio = new AudioSystem();
