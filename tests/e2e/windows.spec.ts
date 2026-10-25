import { test, expect } from '@playwright/test'
import { POSTS as posts } from './content'

const WINDOWS = [
  { route: '/projects', name: '1: Proyectos' },
  { route: '/blog', name: '2: Blog' },
  { route: '/videos', name: '3: Videos' },
]

test.describe('blog window', () => {
  test('lists every Post newest first, linking to it with its tags', async ({ page }) => {
    await page.goto('/blog')
    const rows = page.locator('[data-list] a')
    await expect(rows).toHaveCount(posts.length)
    const hrefs = await rows.evaluateAll((els) => els.map((e) => e.getAttribute('href')))
    // Posts sharing a date have no defined relative order, so compare the set and the date sequence.
    expect([...hrefs].sort()).toEqual(posts.map((p) => `/blog/${p.slug}`).sort())
    const dates = hrefs.map((h) => posts.find((p) => `/blog/${p.slug}` === h)!.date)
    expect(dates).toEqual([...dates].sort((a, b) => b - a))
    for (const row of await page.locator('[data-list] li').all()) {
      await expect(row.getByText(/#\S+/).first()).toBeVisible()
      await expect(row.getByText('post', { exact: true })).toBeVisible()
      await expect(row).toHaveAttribute('data-search', /\S/)
    }
    await expect(page.getByRole('region', { name: 'blog' }).getByText('ls -lt blog/')).toBeVisible()
  })

  test('the paginated route is gone and nothing links to it', async ({ page, request }) => {
    expect((await request.get('/blog/2')).status()).toBe(404)
    for (const route of ['/', '/blog', '/projects', '/videos']) {
      await page.goto(route)
      const hrefs = await page.locator('a').evaluateAll((els) => els.map((e) => e.getAttribute('href') ?? ''))
      expect(hrefs.filter((h) => /^\/blog\/\d+\/?$/.test(h))).toEqual([])
    }
  })
})

test('projects shows its empty state', async ({ page }) => {
  await page.goto('/projects')
  await expect(page.getByText('eza -l --icons proyectos/')).toBeVisible()
  await expect(page.getByText('Los Proyectos llegarán pronto.')).toBeVisible()
})

test('videos shows its empty state', async ({ page }) => {
  await page.goto('/videos')
  await expect(page.getByText('ls -lt videos/')).toBeVisible()
  await expect(page.getByText(/Los Videos llegarán pronto/)).toBeVisible()
})

for (const w of WINDOWS) {
  test.describe(w.route, () => {
    test('marks itself current in the status line', async ({ page }) => {
      await page.goto(w.route)
      const current = page.getByRole('navigation', { name: 'Ventanas' }).locator('[aria-current="page"]')
      await expect(current).toHaveCount(1)
      await expect(current).toHaveAccessibleName(w.name)
    })

    test('has no horizontal overflow', async ({ page }) => {
      await page.goto(w.route)
      const [scrollWidth, innerWidth] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth])
      expect(scrollWidth).toBeLessThanOrEqual(innerWidth)
    })
  })
}
