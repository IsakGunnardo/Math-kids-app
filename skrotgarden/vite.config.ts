import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Ingen extern nätverkstrafik i runtime: allt bundlas lokalt.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { port: 5174 },
  // Egen tom PostCSS-konfig så inte föräldramappens (mattappens) plockas upp.
  css: { postcss: {} },
  build: { target: 'es2020' },
});
