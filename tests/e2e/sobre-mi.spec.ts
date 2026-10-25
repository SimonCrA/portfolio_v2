import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { parse } from 'yaml'

const [, frontmatter, body] = readFileSync('src/content/about/sobre-mi.md', 'utf8').split(/^---$/m)
const about = parse(frontmatter) as {
  intro: string
  now: string
  nowUpdated: Date | string
  uses: { group: string; items: { what: string; value: string }[] }[]
}
const updated = new Date(about.nowUpdated).toISOString().slice(0, 10)

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
    for (const h of ['Ahora', 'Con qué trabajo', 'Dónde encontrarme']) {
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

  test('Now shows its updated date here and on the home page', async ({ page }) => {
    for (const path of ['/', '/sobre-mi']) {
      await page.goto(path)
      await expect(page.locator('[data-now]')).toHaveText(about.now)
      await expect(page.locator('[data-now-updated]')).toHaveAttribute('datetime', updated)
    }
  })

  test('Con qué trabajo renders every group and item from the content file', async ({ page }) => {
    await page.goto('/sobre-mi')
    for (const g of about.uses) {
      const heading = page.getByRole('heading', { level: 3, name: g.group })
      await expect(heading).toBeVisible()
      const items = heading.locator('xpath=following-sibling::ul[1]').getByRole('listitem')
      await expect(items).toHaveCount(g.items.length)
      for (const [n, i] of g.items.entries()) {
        await expect(items.nth(n)).toContainText(i.what)
        await expect(items.nth(n)).toContainText(i.value)
      }
    }
  })

  test('the story is the body, not a copy of the intro', async ({ page }) => {
    await page.goto('/sobre-mi')
    const firstParagraph = body.trim().split('\n')[0]
    await expect(page.locator('.prose').getByText(firstParagraph)).toBeVisible()
    expect(body.trim()).not.toBe(about.intro)
  })

  test('has no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 })
    await page.goto('/sobre-mi')
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBeLessThanOrEqual(0)
  })
})
