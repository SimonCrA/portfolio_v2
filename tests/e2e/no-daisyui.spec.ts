import { test, expect } from '@playwright/test'

test('the built site loads no daisyUI', async ({ page }) => {
  const sheets: string[] = []
  page.on('response', async (r) => {
    if ((r.headers()['content-type'] ?? '').includes('text/css')) sheets.push(await r.text())
  })
  await page.goto('/', { waitUntil: 'networkidle' })
  const inline = await page.evaluate(() => [...document.querySelectorAll('style')].map((s) => s.textContent ?? ''))
  const all = [...sheets, ...inline]
  expect(all.length).toBeGreaterThan(0)
  for (const css of all) expect(css).not.toMatch(/daisyui/i)
})
