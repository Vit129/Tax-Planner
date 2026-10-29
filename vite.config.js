import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// The shared packages live in the sibling repo My-Investment-Port. Walk up from this folder so the
// same config works from the repo root and from a git worktree nested inside it
// (override with SHARED_PACKAGES_ROOT).
function findSharedPackagesRoot(from) {
  if (process.env.SHARED_PACKAGES_ROOT) return path.resolve(process.env.SHARED_PACKAGES_ROOT);
  for (let dir = from; ; dir = path.dirname(dir)) {
    const candidate = path.join(dir, 'My-Investment-Port', 'packages');
    if (fs.existsSync(candidate)) return candidate;
    if (path.dirname(dir) === dir) throw new Error('My-Investment-Port/packages not found next to this repo');
  }
}
const sharedPackagesRoot = findSharedPackagesRoot(__dirname);

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
