import path from 'path';

import react from '@vitejs/plugin-react';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import { defineConfig } from 'vite';
import { checker } from 'vite-plugin-checker';
import eslint from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

const isDevelopment = process.env.NODE_ENV !== 'production';

const plugins = [react(), tsconfigPaths(), svgr()];

if (isDevelopment) {
  plugins.push([
    eslint({
      emitWarning: false, // doesn't work (warnings still exist)
      failOnError: true, // build should fail on error
      lintOnStart: false, // all files - too slow
    }),
    checker({
      typescript: true,
    }),
  ]);
}

// eslint-disable-next-line import/no-unused-modules
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins,
  build: {
    // by default it's ["chrome79", "edge92", "firefox91", "safari13.1"]
    target: browserslistToEsbuild(['>0.2%', 'not dead', 'not op_mini all']),
    outDir: 'build',
    sourcemap: isDevelopment,
  },
  resolve: {
    alias: [
      {
        // Allow moment.js to be used as an ESM module
        find: /^moment$/,
        replacement: path.resolve(__dirname, './node_modules/moment/moment.js'),
      },
    ],
  },
});
