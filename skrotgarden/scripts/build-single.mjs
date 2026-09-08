/**
 * Bygger hela spelet till EN html-fil (dist/skrotgarden.html) med JS, CSS och
 * alla assets inbäddade. Praktiskt för att skicka/publicera utan server.
 * Kör: npm run build:single
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, resolve, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const assetsDir = resolve(root, 'public/assets');

execSync('npx vite build', { cwd: root, stdio: 'inherit' });

const MIME = { '.svg': 'image/svg+xml', '.png': 'image/png', '.wav': 'audio/wav', '.mp3': 'audio/mpeg' };

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = resolve(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const embedded = {};
const pngs = new Set();
for (const file of walk(assetsDir)) {
  const ext = extname(file);
  if (!MIME[ext]) continue;
  const rel = relative(assetsDir, file).split('\\').join('/');
  if (ext === '.png') pngs.add(rel.slice(0, -4));
  embedded[rel] = `data:${MIME[ext]};base64,${readFileSync(file).toString('base64')}`;
}
// Hoppa över SVG-platshållare som redan har en riktig PNG.
for (const key of Object.keys(embedded)) {
  if (key.endsWith('.svg') && pngs.has(key.slice(0, -4))) delete embedded[key];
}

let html = readFileSync(resolve(dist, 'index.html'), 'utf8');
html = html.replace(/<script type="module"[^>]*src="\.\/(assets\/[^"]+\.js)"><\/script>/, (_, src) => {
  const js = readFileSync(resolve(dist, src), 'utf8');
  return `<script type="module">${js}</script>`;
});
html = html.replace(/<link rel="stylesheet"[^>]*href="\.\/(assets\/[^"]+\.css)">/, (_, href) => {
  return `<style>${readFileSync(resolve(dist, href), 'utf8')}</style>`;
});
html = html.replace(/<link rel="icon"[^>]*>\s*/, '');
const bundle = `<script>window.__SKROT_ASSETS__=${JSON.stringify(embedded)};</script>`;
html = html.replace('<div id="root"></div>', `${bundle}\n    <div id="root"></div>`);

writeFileSync(resolve(dist, 'skrotgarden.html'), html);

// Variant utan <html>/<head>/<body> för värdar som själva skapar dokumentskalet.
const inner = html
  .replace(/^[\s\S]*?<head>/, '')
  .replace(/<\/head>\s*<body>/, '')
  .replace(/<\/body>\s*<\/html>\s*$/, '')
  .replace(/<meta[^>]*>\s*/g, '');
writeFileSync(resolve(dist, 'skrotgarden.fragment.html'), inner);

const kb = Math.round(statSync(resolve(dist, 'skrotgarden.html')).size / 1024);
console.log(`dist/skrotgarden.html (${kb} kB), ${Object.keys(embedded).length} assets inbäddade`);
