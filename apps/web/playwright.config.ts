import { defineConfig } from '@playwright/test';

const baseURL = process.env.E2E_WEB_URL ?? 'http://localhost:5173';

export default defineConfig({
  testDir: './e2e',
  timeout: 60000,
  retries: 0,
  workers: 1, // serial: shared cart + single login budget
  use: { baseURL, locale: 'ar-EG' },
  reporter: [['list']],
});
