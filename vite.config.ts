import * as path from 'path';

import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv, type PluginOption } from 'vite';
import svgr from 'vite-plugin-svgr';

export default ({ mode }) => {
  // loadEnv(mode, process.cwd()) will load the .env files depending on the mode
  // import.meta.env.VITE_BASE_APP available here with: process.env.VITE_BASE_APP
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [react(), svgr(), visualizer() as PluginOption],
    base: process.env.VITE_BASE_APP,
    build: {
      target: 'esnext',
      emptyOutDir: true,
      manifest: true,
      sourcemap: process.env.VITE_ENV != 'prod',
      assetsDir: './', // put the assets next to the index.html file
      rollupOptions: {
        external: ['@faker-js/faker'],
      },
    },
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    },
  });
};
