import { test, expect } from '@playwright/test'

const WINDOWS = [
  { name: '0: Inicio', route: '/' },
  { name: '1: Proyectos', route: '/projects' },
  { name: '2: Blog', route: '/blog' },
  { name: '3: Videos', route: '/videos' },
  { name: '4: Sobre mí', route: '/sobre-mi' },
]

test.describe('home in the session layout', () => {
  test('shows the zsh pane with intro and Now', async ({ page }) => {
    await page.goto('/')
    const zsh = page.getByRole('region', { name: /quién soy/ })
    await expect(zsh).toBeVisible()
    await expect(zsh.getByRole('heading', { level: 1, name: 'Simón Clemente' })).toBeVisible()
    await expect(zsh.getByText('whoami')).toBeVisible()
    await expect(zsh.getByText('cat ahora.txt')).toBeVisible()
  })

  test('status line lists every window as a link and marks Inicio as current', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'Ventanas' })
    for (const w of WINDOWS) {
      await expect(nav.getByRole('link', { name: w.name })).toHaveAttribute('href', w.route)
    }
    const current = nav.locator('[aria-current="page"]')
    await expect(current).toHaveCount(1)
    await expect(current).toHaveAccessibleName('0: Inicio')
    await expect(current.getByText('*')).toBeVisible()
  })

  test('status line carries the CV link', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'cv.pdf' })).toHaveAttribute('href', /resume_es\.pdf$/)
  })

  test('decorative banner is hidden from assistive tech', async ({ page }) => {
    await page.goto('/')
    for (const banner of await page.locator('pre.banner').all()) {
      await expect(banner).toHaveAttribute('aria-hidden', 'true')
    }
  })

  test('fonts are self-hosted', async ({ page }) => {
    const external: string[] = []
    page.on('request', (r) => {
      if (/fonts\.(googleapis|gstatic)\.com/.test(r.url())) external.push(r.url())
    })
    await page.goto('/', { waitUntil: 'networkidle' })
    expect(external).toEqual([])
    expect(await page.evaluate(() => document.fonts.check('16px "Atkinson Hyperlegible Mono"'))).toBe(true)
  })

  test('has no horizontal overflow', async ({ page }) => {
    await page.goto('/')
    const [scrollWidth, innerWidth] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth])
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth)
  })
})

test.describe('phone layout', () => {
  test.skip(({ isMobile }) => !isMobile, 'phone only')

  test('shows the narrow banner and only the current window name', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('pre.banner-narrow')).toBeVisible()
    await expect(page.locator('pre.banner-wide')).toBeHidden()
    const nav = page.getByRole('navigation', { name: 'Ventanas' })
    await expect(nav.getByText(':inicio')).toBeVisible()
    await expect(nav.getByText(':blog')).toBeHidden()
    await expect(nav.getByText('2', { exact: true })).toBeVisible()
  })
})

test.describe('desktop layout', () => {
  test.skip(({ isMobile }) => !!isMobile, 'desktop only')

  test('shows the wide banner and every window name', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('pre.banner-wide')).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Ventanas' }).getByText(':blog')).toBeVisible()
  })
})

test('pages not yet migrated still render with the old layout', async ({ page }) => {
  const response = await page.goto('/projects')
  expect(response?.status()).toBe(200)
  await expect(page.locator('body')).toBeVisible()
})
