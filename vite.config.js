import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sharedPackagesRoot = path.resolve(__dirname, '../My-Investment-Port/packages');

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@vit129/thai-tax-core': path.resolve(sharedPackagesRoot, 'tax-core/src/index.ts'),
      '@vit129/tax-ui': path.resolve(sharedPackagesRoot, 'tax-ui/src/index.js'),
    },
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: 5180,
    fs: {
      allow: [__dirname, sharedPackagesRoot],
    },
  },
  test: {
    environment: 'node',
    globals: true,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      'tests/tests-api/**',
      'tests/tests-web/**',
      'tests/taxLogicScenario/**',
    ],
  },
});
