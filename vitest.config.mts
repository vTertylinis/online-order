import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({
        launchOptions: process.env['CHROME_BIN']
          ? { executablePath: process.env['CHROME_BIN'] }
          : { channel: 'chrome' },
      }),
      instances: [{ browser: 'chromium' }],
    },
  },
});
