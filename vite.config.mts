import angular from '@analogjs/vite-plugin-angular';
import { defineConfig } from 'vite';
import { nxReadySignal } from '@nx/vite/plugins/nx-ready-signal.plugin';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: './node_modules/.vite/whiskmate',
  plugins: [angular({ jit: false }), nxReadySignal()],
  resolve: {
    tsconfigPaths: true,
  },
});
