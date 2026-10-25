import { test, expect, type Page } from '@playwright/test'

const pageOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)

test.describe('home fits the viewport on desktop', () => {
  test.skip(({ isMobile }) => !!isMobile, 'phones scroll the page')

  for (const height of [900, 640]) {
    test(`hovering any navigator entry never scrolls the page at ${height}px`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height })
      await page.goto('/')
      expect(await pageOverflow(page), 'page scroll on load').toBeLessThanOrEqual(0)
      const nav = page.getByRole('region', { name: 'Navegador' })
      for (const name of [/proyectos\//, /blog\//, /videos\//, /sobre-mi\//, /cv\.pdf/, /blog\//]) {
        await nav.getByRole('link', { name }).hover()
        expect(await pageOverflow(page), `page scroll after hovering ${name}`).toBeLessThanOrEqual(0)
      }
    })
  }
})
