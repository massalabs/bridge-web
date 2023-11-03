// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { defineConfig } from 'cypress';

import setupNodeEvents from './cypress/plugins';

export default defineConfig({
  video: false,
  userAgent: 'synpress',
  retries: {
    openMode: 0,
    runMode: 0,
  },
  fixturesFolder: './cypress/fixtures',
  screenshotsFolder: './cypress/screenshots',
  chromeWebSecurity: true,
  viewportWidth: 1920,
  viewportHeight: 1080,
  defaultCommandTimeout: 30000,
  pageLoadTimeout: 30000,
  requestTimeout: 30000,
  projectId: 'massaBridge',
  e2e: {
    setupNodeEvents,
    supportFile: './cypress/support/e2e.ts',
    specPattern: './cypress/e2e/**/*.spec.ts',
  },
});
