import sharp from 'sharp';

/** Är pixeln "magenta nog" för att räknas som bakgrund? */
export function isKey(r, g, b, tol = 90) {
  return r > 255 - tol && b > 255 - tol && g < tol;
}

/** Läser en bild till råa RGBA-pixlar. */
export async function readRaw(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

/** Gör magenta-bakgrund transparent, med mjuk kant mot rosa mellantoner. */
export function keyOut({ data, width, height }) {
  const out = Buffer.from(data);
  for (let i = 0; i < width * height * 4; i += 4) {
    const r = out[i], g = out[i + 1], b = out[i + 2];
    if (isKey(r, g, b)) out[i + 3] = 0;
    else if (isKey(r, g, b, 140)) out[i + 3] = Math.round(out[i + 3] * 0.5);
  }
  return { data: out, width, height };
}

/**
 * Hittar sammanhängande icke-bakgrundsområden (på en nedskalad mask) och
 * returnerar bounding boxes i originalpixlar, sorterade rad för rad.
 */
export function findBlobs({ data, width, height }, { step = 4, minSize = 40, rows = 1 } = {}) {
  const w = Math.ceil(width / step), h = Math.ceil(height / step);
  const mask = new Uint8Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = (Math.min(height - 1, y * step) * width + Math.min(width - 1, x * step)) * 4;
      mask[y * w + x] = data[i + 3] > 40 && !isKey(data[i], data[i + 1], data[i + 2], 120) ? 1 : 0;
    }
  // Förstora masken lite så att lösa småbitar hänger ihop med sitt objekt.
  const grown = new Uint8Array(mask);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (mask[y * w + x])
        for (let dy = -2; dy <= 2; dy++)
          for (let dx = -2; dx <= 2; dx++) {
            const yy = y + dy, xx = x + dx;
            if (yy >= 0 && yy < h && xx >= 0 && xx < w) grown[yy * w + xx] = 1;
          }
  const seen = new Uint8Array(w * h);
  const blobs = [];
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      if (!grown[y * w + x] || seen[y * w + x]) continue;
      let minX = x, maxX = x, minY = y, maxY = y, n = 0;
      const stack = [[x, y]];
      seen[y * w + x] = 1;
      while (stack.length) {
        const [cx, cy] = stack.pop();
        n++;
        minX = Math.min(minX, cx); maxX = Math.max(maxX, cx);
        minY = Math.min(minY, cy); maxY = Math.max(maxY, cy);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = cx + dx, ny = cy + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const j = ny * w + nx;
          if (grown[j] && !seen[j]) { seen[j] = 1; stack.push([nx, ny]); }
        }
      }
      if (n * step * step >= minSize * minSize) {
        blobs.push({ x: minX * step, y: minY * step, w: (maxX - minX + 1) * step, h: (maxY - minY + 1) * step });
      }
    }
  // Sortera i läsordning: dela upp i rader efter mittpunktens y, sedan x.
  const rowH = height / rows;
  return blobs.sort((a, b) => {
    const ra = Math.floor((a.y + a.h / 2) / rowH), rb = Math.floor((b.y + b.h / 2) / rowH);
    return ra !== rb ? ra - rb : a.x - b.x;
  });
}
