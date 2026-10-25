import { test, expect } from '@playwright/test'

const LINKS = [
  ['GitHub', 'https://github.com/simoncra'],
  ['LinkedIn', 'https://www.linkedin.com/in/simonctech'],
  ['X', 'https://x.com/simonctech'],
  ['Linktree', 'https://linktr.ee/simonctech'],
]

test.describe('sobre mí window', () => {
  test('renders the heading, the sections, every link and the CV', async ({ page }) => {
    await page.goto('/sobre-mi')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    for (const h of ['Ahora', 'Uses', 'Dónde encontrarme']) {
      await expect(page.getByRole('heading', { level: 2, name: h })).toBeVisible()
    }
    for (const [label, href] of LINKS) {
      const link = page.getByRole('link', { name: label, exact: true })
      await expect(link).toHaveAttribute('href', href)
      await expect(link).toHaveAttribute('target', '_blank')
      await expect(link).toHaveAttribute('rel', /noopener/)
    }
    const cv = page.getByRole('link', { name: /Descargar CV/ })
    await expect(cv).toHaveAttribute('href', /resume_es\.pdf$/)
    await expect(cv).toHaveAttribute('rel', /noopener/)
  })

  test('the avatar has an accessible name', async ({ page }) => {
    await page.goto('/sobre-mi')
    await expect(page.getByRole('img', { name: 'Avatar pixel de Simón' })).toBeVisible()
  })

  test('the status line marks 4: Sobre mí current', async ({ page }) => {
    await page.goto('/sobre-mi')
    await expect(page.locator('.status a[aria-current="page"]')).toHaveAttribute('aria-label', '4: Sobre mí')
  })

  test('Now matches the home page', async ({ page }) => {
    await page.goto('/')
    const home = (await page.locator('[data-now]').textContent())!.trim()
    expect(home.length).toBeGreaterThan(0)
    await page.goto('/sobre-mi')
    await expect(page.locator('[data-now]')).toHaveText(home)
  })

  test('has no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 })
    await page.goto('/sobre-mi')
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBeLessThanOrEqual(0)
  })
})
