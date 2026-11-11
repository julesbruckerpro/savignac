import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.PORT ?? 3100);
// Navigateur déjà présent sur la machine (conteneur, CI) : PW_CHROMIUM=/chemin/vers/chromium
const launchOptions = process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {};

/** Parcours critiques : configurateur → panier → commande démo, sur mobile (iPhone 14) et desktop (1440 px). */
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: `http://localhost:${PORT}`, trace: 'off', locale: 'fr-FR', launchOptions },
  webServer: { command: `npx next start -p ${PORT}`, url: `http://localhost:${PORT}`, reuseExistingServer: true, timeout: 120_000 },
  projects: [
    { name: 'desktop', use: { browserName: 'chromium', viewport: { width: 1440, height: 900 } } },
    { name: 'iphone-14', use: { ...devices['iPhone 14'], browserName: 'chromium' } },
  ],
});
