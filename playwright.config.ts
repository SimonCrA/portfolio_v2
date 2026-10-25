import { defineConfig, devices } from '@playwright/test'

// E2E over the built site: the one test seam of the redesign (spec #7).
// The Vercel adapter has no `astro preview`, so the static output is served as-is.
const PORT = 4321

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'phone', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: `pnpm build && pnpm exec sirv .vercel/output/static --port ${PORT} --quiet`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
