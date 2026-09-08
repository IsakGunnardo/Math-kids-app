/** Platshållar-SVG:er. Färgade, tydliga former + etikett så man ser vad som är vad. */

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function label(w, h, text, size = 18) {
  return `<text x="${w / 2}" y="${h - 8}" font-family="sans-serif" font-size="${size}" text-anchor="middle" fill="#fff" stroke="#000" stroke-width="3" paint-order="stroke" opacity="0.9">${esc(text)}</text>`;
}

const shapes = {
  chassis: (w, h, c) =>
    `<path d="M${w * 0.05} ${h * 0.8} L${w * 0.05} ${h * 0.5} L${w * 0.3} ${h * 0.45} L${w * 0.42} ${h * 0.2} L${w * 0.75} ${h * 0.2} L${w * 0.85} ${h * 0.45} L${w * 0.95} ${h * 0.5} L${w * 0.95} ${h * 0.8} Z" fill="${c}" stroke="#000" stroke-width="6" stroke-linejoin="round"/>`,
  wheel: (w, h, c) =>
    `<circle cx="${w / 2}" cy="${h / 2}" r="${w * 0.45}" fill="${c}" stroke="#000" stroke-width="6"/><circle cx="${w / 2}" cy="${h / 2}" r="${w * 0.18}" fill="#bbb" stroke="#000" stroke-width="4"/>`,
  motor: (w, h, c) =>
    `<rect x="${w * 0.1}" y="${h * 0.3}" width="${w * 0.8}" height="${h * 0.55}" rx="14" fill="${c}" stroke="#000" stroke-width="6"/><rect x="${w * 0.25}" y="${h * 0.1}" width="${w * 0.15}" height="${h * 0.25}" fill="#888" stroke="#000" stroke-width="4"/><rect x="${w * 0.55}" y="${h * 0.1}" width="${w * 0.15}" height="${h * 0.25}" fill="#888" stroke="#000" stroke-width="4"/>`,
  steering: (w, h, c) =>
    `<circle cx="${w / 2}" cy="${h / 2}" r="${w * 0.42}" fill="none" stroke="${c}" stroke-width="14"/><circle cx="${w / 2}" cy="${h / 2}" r="${w * 0.12}" fill="${c}"/><line x1="${w * 0.1}" y1="${h / 2}" x2="${w * 0.9}" y2="${h / 2}" stroke="${c}" stroke-width="10"/>`,
  seat: (w, h, c) =>
    `<rect x="${w * 0.15}" y="${h * 0.1}" width="${w * 0.25}" height="${h * 0.7}" rx="12" fill="${c}" stroke="#000" stroke-width="5"/><rect x="${w * 0.15}" y="${h * 0.55}" width="${w * 0.7}" height="${h * 0.3}" rx="12" fill="${c}" stroke="#000" stroke-width="5"/>`,
  light: (w, h, c) =>
    `<circle cx="${w / 2}" cy="${h / 2}" r="${w * 0.4}" fill="${c}" stroke="#000" stroke-width="5"/><circle cx="${w * 0.42}" cy="${h * 0.42}" r="${w * 0.12}" fill="#fff" opacity="0.8"/>`,
  roof: (w, h, c) =>
    `<path d="M${w * 0.05} ${h * 0.85} L${w * 0.25} ${h * 0.2} L${w * 0.75} ${h * 0.2} L${w * 0.95} ${h * 0.85} Z" fill="${c}" stroke="#000" stroke-width="6" stroke-linejoin="round"/>`,
  extra: (w, h, c) =>
    `<polygon points="${w / 2},${h * 0.08} ${w * 0.62},${h * 0.38} ${w * 0.94},${h * 0.4} ${w * 0.7},${h * 0.6} ${w * 0.78},${h * 0.92} ${w / 2},${h * 0.75} ${w * 0.22},${h * 0.92} ${w * 0.3},${h * 0.6} ${w * 0.06},${h * 0.4} ${w * 0.38},${h * 0.38}" fill="${c}" stroke="#000" stroke-width="5" stroke-linejoin="round"/>`,
};

/** Enkla glyfer för UI-knappar så små barn kan tolka platshållarna. */
const glyphs = {
  btn_yard: '<path d="M16 100 L48 40 L64 70 L80 30 L112 100 Z" fill="#c9a36b" stroke="#000" stroke-width="4"/>',
  btn_garage: '<path d="M20 60 L64 24 L108 60 L108 104 L20 104 Z" fill="#7f8c8d" stroke="#000" stroke-width="4"/><rect x="48" y="70" width="32" height="34" fill="#333"/>',
  btn_drive: '<rect x="20" y="52" width="80" height="34" rx="8" fill="#e07b39" stroke="#000" stroke-width="4"/><circle cx="40" cy="92" r="12" fill="#333"/><circle cx="84" cy="92" r="12" fill="#333"/><path d="M40 52 L52 32 L84 32 L92 52 Z" fill="#9fd3f5" stroke="#000" stroke-width="4"/>',
  btn_gas: '<path d="M64 20 L104 70 L80 70 L80 108 L48 108 L48 70 L24 70 Z" fill="#2ecc71" stroke="#000" stroke-width="4"/>',
  btn_brake: '<rect x="30" y="30" width="68" height="68" rx="10" fill="#e74c3c" stroke="#000" stroke-width="4"/>',
  btn_reset: '<path d="M96 64 A32 32 0 1 1 72 33" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round"/><path d="M70 14 L92 36 L64 46 Z" fill="#fff"/>',
  btn_save: '<path d="M64 108 L28 72 A20 20 0 0 1 64 40 A20 20 0 0 1 100 72 Z" fill="#e91e63" stroke="#000" stroke-width="4"/>',
  btn_sound: '<path d="M28 50 L48 50 L72 30 L72 98 L48 78 L28 78 Z" fill="#fff"/><path d="M84 46 Q100 64 84 82" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/>',
  btn_tilt: '<rect x="30" y="40" width="68" height="48" rx="8" fill="#ddd" stroke="#000" stroke-width="4" transform="rotate(-18 64 64)"/><path d="M22 100 Q64 118 106 100" fill="none" stroke="#f1c40f" stroke-width="8" stroke-linecap="round"/>',
  token: '<polygon points="48,8 84,28 84,68 48,88 12,68 12,28" fill="#f1c40f" stroke="#000" stroke-width="4"/><circle cx="48" cy="48" r="14" fill="#7a5c00"/>',
  rotate: '<rect x="48" y="28" width="160" height="200" rx="20" fill="#333" stroke="#fff" stroke-width="8"/><path d="M200 120 A80 80 0 0 1 128 220" fill="none" stroke="#f1c40f" stroke-width="12" stroke-linecap="round"/>',
};

export function placeholderSvg(a) {
  const { width: w, height: h, color: c, kind, label: text } = a;
  const id = a.path.split('/')[1];
  let body = '';
  if (kind === 'part' && shapes[a.slot]) body = shapes[a.slot](w, h, c);
  else if (kind === 'props') body = `<path d="M${w * 0.05} ${h * 0.9} L${w * 0.3} ${h * 0.3} L${w * 0.5} ${h * 0.55} L${w * 0.7} ${h * 0.2} L${w * 0.95} ${h * 0.9} Z" fill="${c}" stroke="#000" stroke-width="6" stroke-linejoin="round"/>`;
  else if (kind === 'char') body = `<circle cx="${w / 2}" cy="${h * 0.22}" r="${w * 0.18}" fill="${c}" stroke="#000" stroke-width="6"/><rect x="${w * 0.25}" y="${h * 0.4}" width="${w * 0.5}" height="${h * 0.45}" rx="30" fill="${c}" stroke="#000" stroke-width="6"/>`;
  else if (kind === 'ui') body = `<rect x="4" y="4" width="${w - 8}" height="${h - 8}" rx="${w * 0.2}" fill="${c}" stroke="#000" stroke-width="4"/>${glyphs[id] ?? ''}`;
  else if (kind === 'bg') body = `<rect width="${w}" height="${h}" fill="${c}"/><rect width="${w}" height="${h}" fill="url(#g)"/>`;
  const defs = kind === 'bg' ? `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.35"/><stop offset="1" stop-color="#000" stop-opacity="0.25"/></linearGradient></defs>` : '';
  const showLabel = kind !== 'ui';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defs}${body}${showLabel ? label(w, h, `${text} ${w}x${h}`, Math.max(14, Math.min(28, w / 14))) : ''}</svg>\n`;
}
