import * as path from 'path';

import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

export default ({ mode }) => {
  // loadEnv(mode, process.cwd()) will load the .env files depending on the mode
  // import.meta.env.VITE_BASE_APP available here with: process.env.VITE_BASE_APP
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [
      react(),
      svgr(),
      visualizer({
        emitFile: true,
        filename: 'stats.html',
      }),
    ],
    base: process.env.VITE_BASE_APP,
    build: {
      emptyOutDir: true,
      manifest: true,
      sourcemap: true,
      assetsDir: './', // put the assets next to the index.html file
    },
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    },
  });
};
