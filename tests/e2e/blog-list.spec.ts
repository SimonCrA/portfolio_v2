import { test, expect } from '@playwright/test'

test.describe('blog list', () => {
  test('topic chips filter the list and mark the one in use', async ({ page }) => {
    await page.goto('/blog')
    const topics = page.getByRole('navigation', { name: 'Temas' })
    await expect(topics.getByRole('link', { name: /^todos/ })).toHaveAttribute('aria-current', 'true')
    await topics.getByRole('link', { name: '#herramientas 2' }).click()
    await expect(page).toHaveURL(/\/blog\?q=herramientas$/)
    await expect(page.locator('[data-list] > li[data-search]:not([hidden])')).toHaveCount(2)
    await expect(topics.locator('[aria-current]')).toHaveText('#herramientas 2')
  })

  test('posts are grouped by year, and a year with no match hides', async ({ page }) => {
    await page.goto('/blog')
    const years = page.locator('[data-list] > li[data-year]')
    await expect(years.filter({ visible: true })).toContainText(['2025', '2023'])
    await page.goto('/blog?q=herramientas')
    await expect(years.filter({ visible: true })).toHaveText(['2025'])
  })

  test('rows show the reading time and the series part', async ({ page }) => {
    await page.goto('/blog')
    const row = page.locator('.entry-row', { hasText: 'Arreglos y sus métodos (intermedio)' })
    await expect(row.locator('.read')).toHaveText(/^\d+ min$/)
    await expect(row.locator('.series')).toHaveText('serie Arreglos en JavaScript, parte 2 de 2')
  })

  test('the position label counts posts, not years', async ({ page }) => {
    await page.goto('/blog')
    const n = await page.locator('[data-list] > li[data-search]').count()
    await expect(page.locator('[data-list-pos]')).toHaveText(new RegExp(`/${n}\\]$`))
  })
})

test('the RSS feed lists every post', async ({ request, page }) => {
  const rss = await (await request.get('/rss.xml')).text()
  expect(rss).toContain('<rss version="2.0"')
  await page.goto('/blog')
  for (const href of await page.locator('[data-list] .entry-row').evaluateAll((as) => as.map((a) => a.getAttribute('href'))))
    expect(rss).toContain(`https://www.simonctech.com${href}/`)
  await expect(page.locator('link[rel="alternate"][type="application/rss+xml"]')).toHaveAttribute('href', '/rss.xml')
})
