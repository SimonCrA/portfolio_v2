import { test, expect } from '@playwright/test'
import { VIDEOS } from './content'

// Regressions found in the code review of PR #19.

test('the status line shows the visitor\'s date, not the build date', async ({ page }) => {
  await page.goto('/')
  const today = await page.evaluate(() => new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }))
  await expect(page.locator('[data-today]')).toHaveText(today)
})

test('j scrolls the Sobre mí reader', async ({ page, isMobile }) => {
  test.skip(!!isMobile, 'keys are desktop only')
  await page.setViewportSize({ width: 1280, height: 420 })
  await page.goto('/sobre-mi')
  await page.keyboard.press('j')
  await expect.poll(() => page.locator('[data-scroll-box]').evaluate((el) => el.scrollTop)).toBeGreaterThan(0)
})

test('a Post date is its calendar day whatever the build timezone', async ({ page }) => {
  await page.goto('/blog/cv/github-latex')
  await expect(page.locator('.frontmatter')).toContainText('fecha: 8 de abril de 2025')
})

test('the fresh Videos list updates view counts and keeps the selected Video', async ({ page, isMobile }) => {
  test.skip(!!isMobile, 'keys are desktop only')
  const ids = ['fixture-video', 'fixture-short']
  const fresh = VIDEOS.map((v, i) => ({ id: ids[i], title: v.title, url: v.url, date: `2001-0${5 - i}-01T00:00:00.000Z`, views: 999, short: v.short, thumbnail: '/posts/post1.webp' }))
  let release!: () => void
  const gate = new Promise<void>((resolve) => (release = resolve))
  await page.route('**/api/videos.json', async (route) => {
    await gate
    await route.fulfill({ json: fresh })
  })
  await page.goto('/videos')
  const rows = page.locator('[data-list] > li > a')
  await page.keyboard.press('j')
  await expect(rows.nth(1)).toHaveAttribute('aria-current', 'true')
  release()
  await expect(rows.first().locator('.views')).toHaveText('999 vistas')
  await expect(rows.nth(1)).toHaveAttribute('aria-current', 'true')
})
