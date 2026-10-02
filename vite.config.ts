import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react-swc';
import inkManifest from './vite-plugin-ink-manifest';
import path from 'node:path';

// App.tsx compiles to ~1.7 MB and its inline dev sourcemap adds another ~1.3 MB.
// The preview proxy occasionally truncates that payload, which surfaces as
// "SyntaxError: Unexpected end of input". Skipping the inline map for oversized
// modules keeps the response small enough to arrive intact.
function dropOversizedDevSourcemaps(maxCodeLength = 1_000_000): Plugin {
  return {
    name: 'drop-oversized-dev-sourcemaps',
    apply: 'serve',
    enforce: 'post',
    transform(code) {
      if (code.length < maxCodeLength) return null;
      return { code, map: { mappings: '' } };
    },
  };
}

export default defineConfig({
  plugins: [react(), inkManifest(), dropOversizedDevSourcemaps()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: { port: 3000, open: true },
});
