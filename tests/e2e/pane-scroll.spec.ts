import { test, expect, type Page } from '@playwright/test'
import { POSTS } from './content'

// On desktop the session is the viewport: windows never scroll the page, their panes do.
const ROUTES = ['/', '/projects', '/blog', '/videos', '/sobre-mi', `/blog/${POSTS[0].slug}`]
const pageOverflow = (page: Page) => page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)

test.describe('panes scroll, not the page', () => {
  test.skip(({ isMobile }) => !!isMobile, 'phones scroll the page')

  for (const route of ROUTES) {
    test(`${route} fits a short desktop viewport`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 600 })
      await page.goto(route)
      expect(await pageOverflow(page), 'page scroll').toBeLessThanOrEqual(0)
      await page.mouse.move(400, 300)
      await page.mouse.wheel(0, 2000)
      await page.waitForTimeout(200)
      expect(await page.evaluate(() => scrollY), 'the page itself never moved').toBe(0)
    })
  }

  test('a scrolling pane without a list shows the "más abajo" cue until its end', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 600 })
    await page.goto(`/blog/${POSTS[0].slug}`)
    const box = page.locator('[data-scroll-box]')
    const cue = box.locator('[data-scroll-more] > span')
    await expect(cue).toBeVisible()
    await expect(cue).toHaveText('↓ más abajo')
    await box.evaluate((el) => (el.scrollTop = el.scrollHeight))
    await expect(cue).toBeHidden()
  })

  test('a pane that fits shows no cue', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1200 })
    await page.goto('/sobre-mi')
    await expect(page.locator('[aria-labelledby="about-uses"] [data-scroll-more] > span')).toBeHidden()
  })
})
