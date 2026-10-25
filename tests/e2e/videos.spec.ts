import { test, expect } from '@playwright/test'
import { VIDEOS } from './content'

// The E2E build uses fixture Videos instead of the YouTube feed, so these tests never need the network.
test.describe('videos window', () => {
  test('lists the Videos newest first, each opening YouTube in a new tab', async ({ page }) => {
    await page.goto('/videos')
    await expect(page.getByText('ls -lt videos/')).toBeVisible()
    const rows = page.locator('[data-list] > li > a')
    await expect(rows).toHaveCount(VIDEOS.length)
    for (const [i, v] of VIDEOS.entries()) {
      await expect(rows.nth(i)).toHaveAttribute('href', v.url)
      await expect(rows.nth(i)).toHaveAttribute('target', '_blank')
      await expect(rows.nth(i)).toHaveAttribute('rel', /noopener/)
      await expect(rows.nth(i).locator('.title')).toHaveText(v.title)
      await expect(rows.nth(i).locator('.kind')).toHaveText(v.short ? 'short' : 'video')
      await expect(rows.nth(i).locator('.views')).toHaveText(v.views)
      await expect(rows.nth(i).locator('img.thumb')).toHaveAttribute('alt', '')
    }
  })

  test('list keys move the selection', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'keys are desktop only')
    await page.goto('/videos')
    const rows = page.locator('[data-list] > li > a')
    await expect(rows.first()).toHaveAttribute('aria-current', 'true')
    await page.keyboard.press('j')
    await expect(rows.nth(1)).toHaveAttribute('aria-current', 'true')
  })

  test('the navigator counts the Videos and links them to YouTube', async ({ page, isMobile }) => {
    await page.goto('/')
    const nav = page.getByRole('region', { name: 'Navegador' })
    await expect(nav.getByRole('link', { name: /videos\// })).toContainText(`${VIDEOS.length} videos`)
    test.skip(!!isMobile, 'preview is hidden on phones')
    await nav.getByRole('link', { name: /videos\// }).hover()
    await expect(nav.locator('[data-preview="videos"] .tree a').first()).toHaveAttribute('href', VIDEOS[0].url)
  })

  test('the Latest feed links Videos to YouTube in a new tab', async ({ page }) => {
    await page.goto('/')
    const row = page.locator(`[data-latest-scroll] a[href="${VIDEOS[0].url}"]`)
    await expect(row.locator('.kind')).toHaveText('video')
    await expect(row).toHaveAttribute('target', '_blank')
  })

  test('has no horizontal overflow at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/videos')
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0)
  })
})
