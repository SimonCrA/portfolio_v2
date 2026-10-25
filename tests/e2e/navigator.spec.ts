import { test, expect } from '@playwright/test'
import { POSTS as ALL_POSTS, PROJECTS } from './content'
import { readFileSync } from 'node:fs'
import { parse } from 'yaml'

const { now } = parse(readFileSync('src/content/about/sobre-mi.md', 'utf8').split(/^---$/m)[1]) as { now: string }

const POSTS = ALL_POSTS.length

test.describe('home navigator', () => {
  test('lists every section and the CV with real summaries', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('region', { name: 'Navegador' })
    await expect(nav.getByRole('link', { name: /proyectos\//i })).toHaveAttribute('href', '/projects')
    await expect(nav.getByRole('link', { name: /blog\// })).toHaveAttribute('href', '/blog')
    await expect(nav.getByRole('link', { name: /videos\// })).toHaveAttribute('href', '/videos')
    await expect(nav.getByRole('link', { name: /sobre-mi\// })).toHaveAttribute('href', '/sobre-mi')
    await expect(nav.getByRole('link', { name: /cv\.pdf/ })).toHaveAttribute('href', /resume_es\.pdf$/)
    await expect(nav.getByRole('link', { name: /blog\// })).toContainText(`${POSTS} posts`)
    await expect(nav.getByRole('link', { name: /proyectos\// })).toContainText(`${PROJECTS.length} proyectos`)
    await expect(nav.getByRole('link', { name: /sobre-mi\// })).toContainText('quién soy')
  })

  test('sits in the left column under the zsh pane on desktop', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'desktop only')
    await page.goto('/')
    const zsh = await page.getByRole('region', { name: /quién soy/ }).boundingBox()
    const nav = await page.getByRole('region', { name: 'Navegador' }).boundingBox()
    expect(nav!.y).toBeGreaterThan(zsh!.y + zsh!.height - 1)
    expect(Math.abs(nav!.x - zsh!.x)).toBeLessThan(2)
  })

  test('decorative icons are hidden from assistive tech', async ({ page }) => {
    await page.goto('/')
    const icons = page.getByRole('region', { name: 'Navegador' }).locator('svg')
    expect(await icons.count()).toBe(5)
    for (const icon of await icons.all()) await expect(icon).toHaveAttribute('aria-hidden', 'true')
  })

  test('previews the newest Post titles by default, linked, with dates', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'preview is hidden on phones')
    await page.goto('/')
    const nav = page.getByRole('region', { name: 'Navegador' })
    await expect(nav.getByText('tree blog/')).toBeVisible()
    const links = nav.locator('li', { has: page.locator('a[href^="/blog/"]') })
    await expect(links).toHaveCount(4)
    await expect(links.first().getByRole('link')).toHaveAttribute('href', /^\/blog\/.+/)
    await expect(links.first()).toContainText(/\d{4}/)
  })

  test('hover switches the preview', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'preview is hidden on phones')
    await page.goto('/')
    const nav = page.getByRole('region', { name: 'Navegador' })
    await nav.getByRole('link', { name: /sobre-mi\// }).hover()
    await expect(nav.getByText('tree sobre-mi/')).toBeVisible()
    await expect(nav.getByText(now)).toBeVisible()
    await expect(nav.getByText('tree blog/')).toBeHidden()
    await nav.getByRole('link', { name: /videos\// }).hover()
    await expect(nav.getByText('tree videos/')).toBeVisible()
    await nav.getByRole('link', { name: /cv\.pdf/ }).hover()
    await expect(nav.getByText('tree cv.pdf')).toBeVisible()
  })

  test('keyboard focus switches the preview', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'preview is hidden on phones')
    await page.goto('/')
    const nav = page.getByRole('region', { name: 'Navegador' })
    await nav.getByRole('link', { name: /proyectos\// }).focus()
    await expect(nav.getByText('tree proyectos/')).toBeVisible()
    await expect(nav.getByText('tree blog/')).toBeHidden()
    await page.keyboard.press('Tab')
    await expect(nav.getByText('tree blog/')).toBeVisible()
  })

  test('has no horizontal overflow', async ({ page }) => {
    await page.goto('/')
    const [scrollWidth, innerWidth] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth])
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth)
  })
})

test.describe('navigator on phones', () => {
  test.skip(({ isMobile }) => !isMobile, 'phone only')

  test('hides the preview and the key badges but keeps the links', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('region', { name: 'Navegador' })
    await expect(nav.getByText('tree blog/')).toBeHidden()
    await expect(nav.locator('kbd')).toHaveCount(4)
    for (const kbd of await nav.locator('kbd').all()) await expect(kbd).toBeHidden()
    await expect(nav.getByRole('link', { name: /blog\// })).toBeVisible()
  })
})

test.describe('navigator on desktop', () => {
  test.skip(({ isMobile }) => !!isMobile, 'desktop only')

  test('shows the window number badges', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('region', { name: 'Navegador' })
    await expect(nav.locator('kbd')).toHaveText(['1', '2', '3', '4'])
  })

  test('previews Projects Featured first, then newest, linked', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'preview is hidden on phones')
    await page.goto('/')
    const nav = page.getByRole('region', { name: 'Navegador' })
    await nav.getByRole('link', { name: /proyectos\// }).hover()
    const links = nav.locator('[data-preview="proyectos"] .tree a')
    await expect(links).toHaveCount(Math.min(4, PROJECTS.length))
    const expected = PROJECTS.slice(0, 4)
    for (const [i, p] of expected.entries()) {
      await expect(links.nth(i)).toHaveAttribute('href', `/projects/${p.slug}`)
      await expect(links.nth(i)).toHaveText(`${p.featured ? '★ ' : ''}${p.title}`)
    }
  })
})
