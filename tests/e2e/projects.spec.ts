import { test, expect } from '@playwright/test'
import { PROJECTS } from './content'

const rows = (page: import('@playwright/test').Page) => page.locator('[data-list] li:not([hidden]) > a')
const hardware = PROJECTS.find((p) => p.kind === 'hardware' && p.repo && p.demo && p.updated && p.image)!
const software = PROJECTS.find((p) => p.kind === 'software' && !p.repo && !p.demo)!

test.describe('proyectos window', () => {
  test('lists Projects Featured first, then newest, matching the content files', async ({ page }) => {
    await page.goto('/projects')
    await expect(page.getByText('eza -l --icons proyectos/')).toBeVisible()
    const hrefs = await rows(page).evaluateAll((els) => els.map((e) => e.getAttribute('href')))
    expect(hrefs).toEqual(PROJECTS.map((p) => `/projects/${p.slug}`))
  })

  test('each row shows ★ when Featured, the icon by kind, the status and the date', async ({ page }) => {
    await page.goto('/projects')
    for (const p of PROJECTS) {
      const row = page.locator(`a[href="/projects/${p.slug}"]`)
      await expect(row).toContainText(p.title)
      await expect(row).toContainText(p.summary)
      await expect(row.locator('.star')).toHaveCount(p.featured ? 1 : 0)
      await expect(row.locator(`svg.pixel-${p.kind === 'hardware' ? 'chip' : 'code'}`)).toHaveCount(1)
      await expect(row.locator('.state')).toHaveText(p.status)
      await expect(row.locator('.kind')).toHaveText(p.kind)
      await expect(row.locator('time')).toHaveAttribute('datetime', p.date.toISOString())
    }
  })

  test('the template is neither listed nor built', async ({ page }) => {
    await page.goto('/projects')
    await expect(page.locator('a[href*="plantilla"]')).toHaveCount(0)
    const res = await page.goto('/projects/_plantilla')
    expect(res?.status()).toBe(404)
  })

  test('list keys and :abrir open a Project', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'keys are desktop only')
    await page.goto('/projects')
    await expect(rows(page).first()).toHaveAttribute('aria-current', 'true')
    await page.keyboard.press('j')
    await expect(rows(page).nth(1)).toHaveAttribute('aria-current', 'true')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(`/projects/${PROJECTS[1].slug}`)
    await page.goto('/projects')
    await page.keyboard.press(':')
    await page.keyboard.type('abrir 1')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(`/projects/${PROJECTS[0].slug}`)
  })

  test('a Tag link from a Project filters the list', async ({ page }) => {
    await page.goto(`/projects?q=${hardware.tags[1]}`)
    await expect(rows(page)).toHaveCount(1)
    await expect(rows(page)).toHaveAttribute('href', `/projects/${hardware.slug}`)
  })
})

test.describe('project page', () => {
  test('renders the front matter, links, image, body and pager', async ({ page }) => {
    await page.goto(`/projects/${hardware.slug}`)
    await expect(page.getByRole('heading', { level: 2, name: `glow ~/proyectos/${hardware.slug}.md` })).toBeVisible()
    const fm = page.locator('.frontmatter')
    await expect(fm).toContainText(`estado: ${hardware.status}`)
    await expect(fm).toContainText(`tipo: ${hardware.kind}`)
    await expect(fm).toContainText('fecha:')
    await expect(fm).toContainText('actualizado:')
    await expect(fm).toContainText(`stack: [${hardware.stack.join(', ')}]`)
    for (const tag of hardware.tags) await expect(fm.getByRole('link', { name: tag, exact: true })).toHaveAttribute('href', `/projects?q=${tag}`)
    await expect(fm.getByRole('link', { name: /repo/ })).toHaveAttribute('href', hardware.repo!)
    await expect(fm.getByRole('link', { name: /demo/ })).toHaveAttribute('href', hardware.demo!)
    await expect(page.getByRole('heading', { level: 1, name: hardware.title })).toBeVisible()
    await expect(page.locator('.reader figure img')).toHaveAttribute('src', hardware.image!)
    await expect(page.locator('.prose')).not.toBeEmpty()
    await expect(page.locator('.pagerbar').getByRole('link', { name: /proyectos/ })).toHaveAttribute('href', '/projects')
    await expect(page.getByRole('navigation', { name: 'Ventanas' }).locator('[aria-current="page"]')).toHaveAccessibleName('1: Proyectos')
  })

  test('omits repo, demo and actualizado when they are not set', async ({ page }) => {
    await page.goto(`/projects/${software.slug}`)
    const fm = page.locator('.frontmatter')
    await expect(fm).not.toContainText('repo:')
    await expect(fm).not.toContainText('demo:')
    await expect(fm).not.toContainText('actualizado:')
  })

  test('j/k scroll and q returns home', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'keys are desktop only')
    await page.setViewportSize({ width: 1280, height: 400 })
    await page.goto(`/projects/${PROJECTS.find((p) => p.slug === 'vigia')?.slug ?? hardware.slug}`)
    const scrolled = () => page.evaluate(() => Math.max(scrollY, document.querySelector('[data-scroll-box]')?.scrollTop ?? 0))
    await page.keyboard.press('j')
    await expect.poll(scrolled).toBeGreaterThan(0)
    await page.keyboard.press('q')
    await expect(page).toHaveURL('/')
  })
})

test.describe('projects without overflow or JavaScript', () => {
  for (const path of ['/projects', `/projects/${hardware.slug}`]) {
    test(`${path} has no horizontal overflow at 390px`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto(path)
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0)
    })
  }

  test('the list and a page render without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()
    await page.goto('/projects')
    await expect(page.locator(`a[href="/projects/${PROJECTS[0].slug}"]`)).toBeVisible()
    await page.goto(`/projects/${hardware.slug}`)
    await expect(page.getByRole('heading', { level: 1, name: hardware.title })).toBeVisible()
    await context.close()
  })
})
