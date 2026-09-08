/**
 * Asset-laddning. Riktig grafik är PNG; platshållare är SVG med samma
 * basnamn. PNG används automatiskt om den finns, annars SVG.
 */
const BASE = `${import.meta.env.BASE_URL}assets/`;

export type ImgExt = 'png' | 'svg';

export function assetUrl(path: string, ext: ImgExt = 'png'): string {
  return `${BASE}${path}.${ext}`;
}

export function sfxUrl(id: string, ext: 'wav' | 'mp3' = 'wav'): string {
  return `${BASE}sfx/${id}.${ext}`;
}

const cache = new Map<string, Promise<HTMLImageElement>>();

function tryLoad(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Kunde inte ladda ${url}`));
    img.src = url;
  });
}

/** Laddar en bild för canvas-rendering, PNG först och SVG som reserv. */
export function loadImage(path: string): Promise<HTMLImageElement> {
  let p = cache.get(path);
  if (!p) {
    p = tryLoad(assetUrl(path, 'png')).catch(() => tryLoad(assetUrl(path, 'svg')));
    cache.set(path, p);
  }
  return p;
}

export function preloadImages(paths: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(paths.map(loadImage));
}
