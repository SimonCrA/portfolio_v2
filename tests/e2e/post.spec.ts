import { test, expect } from '@playwright/test'

const POSTS = [
  { slug: 'cv/github-latex', title: /CV dinámico/, tags: ['git', 'herramientas'] },
  { slug: 'javasctipt/loops', title: /Ciclos en JavaScript/, tags: ['javascript'] },
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
      await page.mouse.move(200, 400)
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

test.describe('reader body', () => {
  const route = '/blog/cv/github-latex'

  test('code blocks name their language and copy their code', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto(route)
    const block = page.locator('.code-block[data-lang="bash"]').first()
    await expect(block).toBeAttached()
    const copy = block.locator('button.code-copy')
    await expect(copy).toHaveText('[copiar]')
    await copy.click()
    await expect(copy).toHaveText('[copiado]')
    const code = await block.locator('pre').innerText()
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(code)
  })

  test('inline code and quotes have no typographic decorations', async ({ page }) => {
    await page.goto(route)
    const inline = page.locator('.prose :not(pre) > code').first()
    expect(await inline.evaluate((el) => getComputedStyle(el, '::before').content)).toBe('none')
    const quote = page.locator('.prose blockquote p').first()
    expect(await quote.evaluate((el) => getComputedStyle(el, '::before').content)).toBe('none')
    expect(await quote.evaluate((el) => getComputedStyle(el.closest('blockquote')!).fontStyle)).toBe('normal')
  })
})

test.describe('post as an article', () => {
  const route = '/blog/javasctipt/arrays-methods-intermediate'

  test('the text column stays near 70 characters wide', async ({ page }) => {
    await page.goto(route)
    const width = await page.locator('.prose p').first().evaluate((el) => el.getBoundingClientRect().width / parseFloat(getComputedStyle(el).fontSize))
    expect(width).toBeLessThanOrEqual(40)
  })

  test('the index lists the sections and marks the one being read', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'the side index needs a wide pane')
    await page.goto(route)
    const index = page.getByRole('navigation', { name: 'Índice del post' })
    await expect(index).toBeVisible()
    await expect(index.getByRole('link', { name: 'reduce()' })).toHaveAttribute('href', /#reduce/)
    await expect(index.locator('[aria-current]')).toHaveText('Introducción')
    await index.getByRole('link', { name: 'reduce()' }).click()
    await expect(page.getByRole('heading', { name: 'reduce()' })).toBeInViewport()
    await expect(index.locator('[aria-current]')).toHaveText('reduce()')
  })

  test('on a phone the index sits open above the text', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'phone', 'phones show the index above the text')
    await page.goto(route)
    await expect(page.getByRole('navigation', { name: 'Índice del post' })).toBeHidden()
    const folded = page.locator('details.toc-inline')
    await expect(folded).toHaveAttribute('open', '')
    await folded.getByRole('link', { name: 'filter()' }).click()
    await expect(page.getByRole('heading', { name: 'filter()' })).toBeInViewport()
  })
})

test.describe('series', () => {
  test('a part lists the whole series and links the other parts', async ({ page }) => {
    await page.goto('/blog/javasctipt/arrays-methods')
    const series = page.getByRole('navigation', { name: 'Serie Arreglos en JavaScript' })
    await expect(series).toContainText('parte 1 de 2')
    await expect(series.locator('[aria-current="page"]')).toContainText('Arreglos y sus métodos (estás aquí)')
    await expect(series.getByRole('link', { name: 'Arreglos y sus métodos (intermedio)' })).toHaveAttribute('href', '/blog/javasctipt/arrays-methods-intermediate')
  })

  test('a post outside a series has none', async ({ page }) => {
    await page.goto('/blog/cv/github-latex')
    await expect(page.locator('.series')).toHaveCount(0)
  })
})
