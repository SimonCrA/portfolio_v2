import { test, expect } from '@playwright/test'

const POSTS = [
  { slug: 'cv/github-latex', title: /CV dinámico/, tags: ['github', 'actions', 'latex'] },
  { slug: 'javasctipt/loops', title: /ciclos en javascript/, tags: ['javascript', 'arrays'] },
]

for (const post of POSTS) {
  const route = `/blog/${post.slug}`
  test.describe(`reader ${route}`, () => {
    test('shows front matter, title and description', async ({ page }) => {
      await page.goto(route)
      const pane = page.getByRole('article')
      await expect(page.getByRole('heading', { level: 2, name: `glow ~/blog/${post.slug}.md` })).toBeVisible()
      const fm = pane.locator('.frontmatter')
      await expect(fm).toContainText(/fecha: \d+ de \w+ de \d{4}/)
      await expect(fm).toContainText(/lectura: \d+ min/)
      await expect(fm).toContainText('tags: [')
      await expect(pane.getByRole('heading', { level: 1, name: post.title })).toBeVisible()
      await expect(pane.locator('.reader-lead')).toBeVisible()
    })

    test('tags link to the blog filter', async ({ page }) => {
      await page.goto(route)
      for (const tag of post.tags) {
        await expect(page.locator('.frontmatter').getByRole('link', { name: tag, exact: true })).toHaveAttribute('href', `/blog?q=${tag}`)
      }
    })

    test('status line marks Blog as current', async ({ page }) => {
      await page.goto(route)
      await expect(page.getByRole('navigation', { name: 'Ventanas' }).locator('[aria-current="page"]')).toHaveAccessibleName('2: Blog')
    })

    test('pager bar starts at 0% and grows on scroll', async ({ page }) => {
      await page.goto(route)
      const bar = page.locator('.pagerbar')
      await expect(bar.getByRole('link', { name: /blog/ })).toHaveAttribute('href', '/blog')
      await expect(bar).toContainText(/\d+ min de lectura/)
      const pct = bar.locator('[data-pct]')
      await expect(pct).toHaveText('0%')
      await page.mouse.wheel(0, 1500)
      await expect(pct).not.toHaveText('0%')
    })

    test('has a code block and no horizontal overflow', async ({ page }) => {
      await page.goto(route)
      await expect(page.locator('.prose pre').first()).toBeAttached()
      const [sw, iw] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth])
      expect(sw).toBeLessThanOrEqual(iw)
    })

    test('giscus uses the gruvbox dark theme', async ({ page }) => {
      await page.goto(route)
      await expect(page.locator('script[src*="giscus.app"]')).toHaveAttribute('data-theme', 'gruvbox_dark')
    })
  })
}
