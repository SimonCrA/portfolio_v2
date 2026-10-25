import { test, expect } from '@playwright/test'

// ADR 0002: every page stays readable whatever the theme, with or without JavaScript.
test.use({ javaScriptEnabled: false })

const WINDOWS = ['/', '/projects', '/blog', '/videos', '/sobre-mi']

for (const route of WINDOWS) {
  test(`${route} renders its main content without JavaScript`, async ({ page }) => {
    await page.goto(route)
    const main = page.locator('main').first()
    await expect(main).toBeVisible()
    expect((await main.innerText()).trim().length).toBeGreaterThan(0)
  })
}

test('a Post renders without JavaScript', async ({ page }) => {
  await page.goto('/blog')
  const href = await page.locator('[data-list] a').first().getAttribute('href')
  await page.goto(href!)
  await expect(page.locator('h1').first()).toBeVisible()
  await expect(page.locator('article').first()).toBeVisible()
})

test('status-line links navigate without JavaScript', async ({ page }) => {
  await page.goto('/')
  await page.locator('nav[aria-label="Ventanas"] a[href="/blog"]').click()
  await expect(page).toHaveURL(/\/blog\/?$/)
  await page.locator('nav[aria-label="Ventanas"] a[href="/projects"]').click()
  await expect(page).toHaveURL(/\/projects\/?$/)
})
