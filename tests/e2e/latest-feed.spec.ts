import { test, expect } from '@playwright/test'

// The fixture has five Posts, so the feed has five rows.
const POSTS = 5

test.describe('latest feed', () => {
  test('is a named region listing every Post newest first, each linked', async ({ page }) => {
    await page.goto('/')
    const pane = page.getByRole('region', { name: 'Últimos' })
    await expect(pane.getByText('ls -lt ultimos/')).toBeVisible()
    const rows = pane.getByRole('link')
    await expect(rows).toHaveCount(POSTS)
    for (const row of await rows.all()) await expect(row).toHaveAttribute('href', /^\/blog\/.+/)
    const dates = await pane.locator('time').evaluateAll((els) => els.map((e) => e.getAttribute('datetime')!))
    expect(dates).toEqual([...dates].sort().reverse())
  })

  test('a row shows icon, title, summary, type and date', async ({ page }) => {
    await page.goto('/')
    const row = page.getByRole('region', { name: 'Últimos' }).getByRole('link').first()
    await expect(row.locator('svg')).toHaveAttribute('aria-hidden', 'true')
    await expect(row.locator('.title')).not.toBeEmpty()
    await expect(row.locator('.summary')).not.toBeEmpty()
    await expect(row).toContainText('post')
    await expect(row.locator('time')).toContainText(/\d{4}/)
  })

  test('scrolls inside the pane on desktop without growing the page', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'desktop only')
    await page.goto('/')
    const viewport = page.viewportSize()!
    const status = await page.locator('.status').boundingBox()
    const docHeight = await page.evaluate(() => document.documentElement.scrollHeight)
    expect(docHeight).toBeLessThanOrEqual(viewport.height + status!.height)
    const m = await page.locator('[data-latest-scroll]').evaluate((el) => ({ s: el.scrollHeight, c: el.clientHeight }))
    expect(m.s).toBeGreaterThanOrEqual(m.c)
  })

  test('phone order is zsh, últimos, navigator, without horizontal overflow', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'phone only')
    await page.goto('/')
    const y = async (name: string | RegExp) => (await page.getByRole('region', { name }).boundingBox())!.y
    const zsh = await y(/quién soy/)
    const feed = await y('Últimos')
    const nav = await y('Navegador')
    expect(zsh).toBeLessThan(feed)
    expect(feed).toBeLessThan(nav)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBeLessThanOrEqual(0)
  })

  test('has no horizontal overflow on any viewport', async ({ page }) => {
    await page.goto('/')
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBeLessThanOrEqual(0)
  })
})
