import { test, expect } from '@playwright/test'
import { FIXTURE_POST } from './content'

const href = `/blog/${FIXTURE_POST.slug}`

test.describe('fixture content (E2E_FIXTURES=1)', () => {
  test('the fixture Post is listed in the Blog', async ({ page }) => {
    await page.goto('/blog')
    await expect(page.locator(`[data-list] a[href="${href}"]`)).toContainText(FIXTURE_POST.title)
  })

  test('the fixture Post is in the Latest feed', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator(`[data-latest-scroll] a[href="${href}"]`)).toBeAttached()
  })

  test('search finds the fixture Post by its Tag', async ({ page }) => {
    await page.goto('/blog?q=fixture')
    await expect(page.locator('[data-list] li:not([hidden]) > a')).toHaveCount(1)
    await expect(page.locator('[data-list] li:not([hidden]) > a')).toHaveAttribute('href', href)
  })

  test('the fixture Post renders in the reader', async ({ page }) => {
    await page.goto(href)
    await expect(page.getByRole('heading', { level: 1, name: FIXTURE_POST.title })).toBeVisible()
    await expect(page.locator('.frontmatter')).toContainText('tags: [fixture, pruebas]')
  })
})
