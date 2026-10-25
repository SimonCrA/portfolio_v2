import { test, expect, type Page } from '@playwright/test'

const WINDOWS = [
  { route: '/', name: '0: Inicio' },
  { route: '/projects', name: '1: Proyectos' },
  { route: '/blog', name: '2: Blog' },
  { route: '/videos', name: '3: Videos' },
  { route: '/sobre-mi', name: '4: Sobre mí' },
]
const POST = '/blog/cv/github-latex'

const statusNav = (page: Page) => page.getByRole('navigation', { name: 'Ventanas' })
const current = (page: Page) => statusNav(page).locator('[aria-current="page"]')

test.describe('keyboard', () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(!!isMobile, 'keys are desktop only')
  })

  test('0-4 reach each window and mark it current', async ({ page }) => {
    await page.goto('/')
    for (const [i, w] of WINDOWS.entries()) {
      if (i === 0) continue
      await page.keyboard.press(String(i))
      await expect(page).toHaveURL(w.route)
      await expect(current(page)).toHaveAccessibleName(w.name)
    }
    await page.keyboard.press('0')
    await expect(page).toHaveURL('/')
    await expect(current(page)).toHaveAccessibleName('0: Inicio')
  })

  test('back and forward work after key switches', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('1')
    await expect(page).toHaveURL('/projects')
    await page.keyboard.press('3')
    await expect(page).toHaveURL('/videos')
    await page.goBack()
    await expect(page).toHaveURL('/projects')
    await expect(current(page)).toHaveAccessibleName('1: Proyectos')
    await page.goBack()
    await expect(page).toHaveURL('/')
    await expect(current(page)).toHaveAccessibleName('0: Inicio')
    await page.goForward()
    await expect(page).toHaveURL('/projects')
  })

  test('after many navigations one press navigates exactly once', async ({ page }) => {
    await page.goto('/')
    for (const k of ['1', '2', '3', '4', '0', '1']) {
      await page.keyboard.press(k)
      await expect(page).toHaveURL(WINDOWS[Number(k)].route)
    }
    await page.keyboard.press('2')
    await expect(page).toHaveURL('/blog')
    const length = await page.evaluate(() => history.length)
    await page.keyboard.press('1')
    await expect(page).toHaveURL('/projects')
    await page.waitForTimeout(300)
    await expect(page).toHaveURL('/projects')
    expect(await page.evaluate(() => history.length)).toBe(length + 1)
  })

  test('the status line keeps the same DOM node across navigations', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => ((document.querySelector('.status') as any).__tag = 'same'))
    await page.keyboard.press('2')
    await expect(page).toHaveURL('/blog')
    await page.keyboard.press('4')
    await expect(page).toHaveURL('/sobre-mi')
    expect(await page.evaluate(() => (document.querySelector('.status') as any).__tag)).toBe('same')
    await expect(current(page)).toHaveAccessibleName('4: Sobre mí')
  })

  test('on a Post j/k scroll and q returns home', async ({ page }) => {
    await page.goto(POST)
    await page.keyboard.press('j')
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0)
    await page.keyboard.press('j')
    await page.waitForTimeout(500)
    const down = await page.evaluate(() => scrollY)
    await page.keyboard.press('k')
    await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(down)
    await page.keyboard.press('q')
    await expect(page).toHaveURL('/')
  })

  test('j, k and q do nothing outside a Post', async ({ page }) => {
    await page.goto('/blog')
    await page.keyboard.press('q')
    await page.waitForTimeout(200)
    await expect(page).toHaveURL('/blog')
  })

  test('keys typed into a field do nothing', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      const input = document.createElement('input')
      input.id = 'tmp-input'
      document.body.append(input)
      input.focus()
    })
    await page.keyboard.type('2')
    await page.waitForTimeout(200)
    await expect(page).toHaveURL('/')
    await expect(page.locator('#tmp-input')).toHaveValue('2')
  })

  test('Ctrl+2 does nothing', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Control+2')
    await page.waitForTimeout(200)
    await expect(page).toHaveURL('/')
  })

  test('the navigator preview still switches on hover after navigating back home', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('1')
    await expect(page).toHaveURL('/projects')
    await page.keyboard.press('0')
    await expect(page).toHaveURL('/')
    const nav = page.getByRole('region', { name: 'Navegador' })
    await nav.getByRole('link', { name: /videos\// }).hover()
    await expect(page.locator('[data-preview="videos"]')).toBeVisible()
    await expect(page.locator('[data-preview="blog"]')).toBeHidden()
  })

  test('the pager % updates on a Post reached by client navigation', async ({ page }) => {
    await page.goto('/blog')
    await page.evaluate(() => ((document.body as any).__tag = 'same'))
    await page.locator(`a[href="${POST}"]`).first().click()
    await expect(page).toHaveURL(POST)
    expect(await page.evaluate(() => (document.body as any).__tag)).toBeUndefined()
    const pct = page.locator('[data-pct]')
    await expect(pct).toHaveText('0%')
    await page.mouse.wheel(0, 100000)
    await expect(pct).toHaveText('100%')
    await expect(current(page)).toHaveAccessibleName('2: Blog')
  })

  test('giscus loads on a Post reached by client navigation', async ({ page }) => {
    await page.goto('/blog')
    await page.locator(`a[href="${POST}"]`).first().click()
    await expect(page).toHaveURL(POST)
    await expect(page.locator('script[src*="giscus.app/client.js"]')).toHaveCount(1)
    await expect(page.locator('script[src*="giscus.app/client.js"]')).toHaveAttribute('data-astro-rerun', '')
  })
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('status line links still navigate', async ({ page }) => {
    await page.goto('/')
    await statusNav(page).getByRole('link', { name: '2: Blog' }).click()
    await expect(page).toHaveURL('/blog')
    await statusNav(page).getByRole('link', { name: '4: Sobre mí' }).click()
    await expect(page).toHaveURL('/sobre-mi')
    await expect(current(page)).toHaveAccessibleName('4: Sobre mí')
  })
})
