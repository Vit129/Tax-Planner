import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/taxLogicScenario',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:5180',
    headless: true,
    channel: 'chrome',
  },
  webServer: {
    command: 'npm run dev',
    port: 5180,
    reuseExistingServer: true,
    timeout: 15000,
  },
});
