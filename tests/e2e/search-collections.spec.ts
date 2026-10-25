import { test, expect, type Page } from '@playwright/test'
import { POSTS, PROJECTS } from './content'

// Fixture Posts and Projects share the `fixture` Tag; only the fixture Post has `e2e-solo-post`.
const rows = (page: Page) => page.locator('[data-list] > li:not([hidden])')
const promptInput = (page: Page) => page.getByRole('textbox', { name: 'Comando' })
const message = (page: Page) => page.locator('.status output')
const withTag = <T extends { tags?: string[] }>(items: T[], tag: string) => items.filter((i) => i.tags?.includes(tag))
const postsWithFixture = POSTS.filter((p) => p.title.includes('e2e-fixture')).length
const projectsWithFixture = withTag(PROJECTS, 'fixture').length

async function run(page: Page, cmd: string) {
  await page.keyboard.press(':')
  await expect(promptInput(page)).toBeFocused()
  await page.keyboard.type(cmd)
  await page.keyboard.press('Enter')
}

test.describe('window-aware search', () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(!!isMobile, 'keys are desktop only')
  })

  test('on /projects, / filters Projects in place and sets ?q=', async ({ page }) => {
    await page.goto('/projects')
    await page.keyboard.press('/')
    await expect(promptInput(page)).toHaveValue('buscar ')
    await page.keyboard.type('fixture')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/projects\?q=fixture$/)
    await expect(rows(page)).toHaveCount(projectsWithFixture)
    await expect(page.locator('[data-cmd]')).toHaveText('eza -l --icons proyectos/ | grep -i "fixture"')
  })

  test('on /blog, a search that also matches Projects says so and links there', async ({ page }) => {
    await page.goto('/blog')
    await run(page, 'buscar fixture')
    await expect(rows(page)).toHaveCount(postsWithFixture)
    await expect(message(page)).toContainText(`${postsWithFixture} post con «fixture» y ${projectsWithFixture} proyectos`)
    await message(page).getByRole('link', { name: `ver ${projectsWithFixture} proyectos` }).click()
    await expect(page).toHaveURL(/\/projects\?q=fixture$/)
    await expect(rows(page)).toHaveCount(projectsWithFixture)
  })

  test('on /projects, a search that also matches Posts links to the Blog', async ({ page }) => {
    await page.goto('/projects')
    await run(page, 'buscar fixture')
    await message(page).getByRole('link', { name: `ver ${postsWithFixture} post` }).click()
    await expect(page).toHaveURL(/\/blog\?q=fixture$/)
    await expect(rows(page)).toHaveCount(postsWithFixture)
  })

  test('the empty state points to matches in the other collection', async ({ page }) => {
    await page.goto('/projects')
    await run(page, 'buscar e2e-solo-post')
    await expect(rows(page)).toHaveCount(0)
    const other = page.locator('[data-empty] [data-other-link]')
    await expect(other).toHaveText(`Ver ${postsWithFixture} post con «e2e-solo-post»`)
    await expect(other).toHaveAttribute('href', '/blog?q=e2e-solo-post')
  })

  test('XSS on /projects: the text is shown literally and nothing runs', async ({ page }) => {
    page.on('dialog', (d) => {
      void d.dismiss()
      throw new Error(`unexpected dialog: ${d.message()}`)
    })
    await page.goto('/projects')
    const payload = '<img src=x onerror=alert(1)>'
    await run(page, `buscar ${payload}`)
    await expect(page.locator('[data-empty-q]')).toHaveText(payload)
    await expect(message(page)).toContainText(payload)
    await expect(page.locator('main img[src="x"]')).toHaveCount(0)
  })
})

test('loading /projects?q= arrives filtered and points to the Blog when empty', async ({ page }) => {
  await page.goto('/projects?q=e2e-solo-post')
  await expect(rows(page)).toHaveCount(0)
  await expect(page.locator('[data-empty] [data-other-link]')).toHaveAttribute('href', '/blog?q=e2e-solo-post')
})
