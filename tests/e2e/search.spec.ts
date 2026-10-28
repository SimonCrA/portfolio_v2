import { test, expect, type Page } from '@playwright/test'

const rows = (page: Page) => page.locator('[data-list] > li[data-search]:not([hidden])')
const allRows = (page: Page) => page.locator('[data-list] > li[data-search]')
const promptInput = (page: Page) => page.getByRole('textbox', { name: 'Comando' })
const message = (page: Page) => page.locator('.status output')
const empty = (page: Page) => page.locator('[data-empty]')

async function run(page: Page, cmd: string, key = ':') {
  await page.keyboard.press(key)
  await expect(promptInput(page)).toBeFocused()
  await page.keyboard.type(cmd)
  await page.keyboard.press('Enter')
}

test.describe('search (keys)', () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(!!isMobile, 'keys are desktop only')
  })

  test('"/" prefills the prompt; filters, sets ?q=, grep line and count message', async ({ page }) => {
    await page.goto('/blog')
    const total = await allRows(page).count()
    expect(total).toBeGreaterThan(1)
    await page.keyboard.press('/')
    await expect(promptInput(page)).toHaveValue('buscar ')
    await page.keyboard.type('latex')
    await page.keyboard.press('Enter')
    await expect(rows(page)).toHaveCount(1)
    await expect(page).toHaveURL(/\/blog\?q=latex$/)
    await expect(page.locator('[data-cmd]')).toHaveText('ls -lt blog/ | grep -i "latex"')
    await expect(message(page)).toContainText('1 post con «latex»')
    await expect(empty(page)).toBeHidden()
  })

  test('"/texto" typed at the prompt filters', async ({ page }) => {
    await page.goto('/blog')
    await run(page, '/latex')
    await expect(rows(page)).toHaveCount(1)
  })

  test('":grep" filters', async ({ page }) => {
    await page.goto('/blog')
    await run(page, 'grep latex')
    await expect(rows(page)).toHaveCount(1)
  })

  test('":buscar imagenes" matches the Post', async ({ page }) => {
    await page.goto('/blog')
    await run(page, 'buscar imagenes')
    await expect(rows(page)).toHaveCount(1)
    await expect(rows(page).first()).toContainText('imágenes')
  })

  test('":buscar imágenes" (accented) matches too', async ({ page }) => {
    await page.goto('/blog')
    await run(page, 'buscar imágenes')
    await expect(rows(page)).toHaveCount(1)
    await expect(rows(page).first()).toContainText('imágenes')
  })

  test('a Tag matches', async ({ page }) => {
    await page.goto('/blog')
    await run(page, 'buscar herramientas')
    expect(await rows(page).count()).toBeGreaterThan(1)
    await expect(page).toHaveURL(/q=herramientas/)
  })

  test('no match shows the empty state and an error; ":buscar" clears', async ({ page }) => {
    await page.goto('/blog')
    const total = await allRows(page).count()
    await run(page, 'buscar zzz')
    await expect(rows(page)).toHaveCount(0)
    await expect(empty(page)).toBeVisible()
    await expect(empty(page)).toContainText('Ningún post coincide con «zzz»')
    await expect(empty(page).locator('code')).toHaveCount(4) // 3 tags + :buscar
    await expect(message(page)).toHaveAttribute('data-kind', 'error')
    await run(page, 'buscar')
    await expect(rows(page)).toHaveCount(total)
    await expect(empty(page)).toBeHidden()
    await expect(page).not.toHaveURL(/q=/)
    await expect(page.locator('[data-cmd]')).toHaveText('ls -lt blog/')
  })

  test('":buscar latex" from / navigates to /blog?q=latex, filtered', async ({ page }) => {
    await page.goto('/')
    await run(page, 'buscar latex')
    await expect(page).toHaveURL(/\/blog\?q=latex$/)
    await expect(rows(page)).toHaveCount(1)
  })

  test('XSS: the text is shown literally and nothing runs', async ({ page }) => {
    page.on('dialog', (d) => {
      void d.dismiss()
      throw new Error(`unexpected dialog: ${d.message()}`)
    })
    await page.goto('/blog')
    const payload = '<img src=x onerror=alert(1)>'
    await run(page, `buscar ${payload}`)
    await expect(empty(page)).toBeVisible()
    await expect(page.locator('[data-empty-q]')).toHaveText(payload)
    await expect(page.locator('[data-cmd]')).toContainText(payload)
    await expect(message(page)).toContainText(payload)
    await expect(page.locator('main img[src="x"]')).toHaveCount(0)
    await page.waitForTimeout(300)
  })
})

test('loading /blog?q=github arrives filtered', async ({ page }) => {
  await page.goto('/blog?q=github')
  await expect(rows(page)).toHaveCount(1)
  await expect(page.locator('[data-cmd]')).toHaveText('ls -lt blog/ | grep -i "github"')
})

test('clicking a Tag on a Post arrives filtered', async ({ page }) => {
  await page.goto('/blog')
  await page.locator('[data-list] a').first().click()
  await expect(page.locator('[data-post]')).toBeVisible()
  const tag = page.locator('a[href^="/blog?q="]').first()
  const name = (await tag.innerText()).trim()
  await tag.click()
  await expect(page).toHaveURL(new RegExp(`/blog\\?q=${name}`))
  const n = await rows(page).count()
  expect(n).toBeGreaterThan(0)
  await expect(page.locator('[data-cmd]')).toContainText(`grep -i "${name}"`)
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })
  test('/blog?q=latex shows every Post, empty state hidden', async ({ page }) => {
    await page.goto('/blog')
    const total = await allRows(page).count()
    await page.goto('/blog?q=latex')
    await expect(rows(page)).toHaveCount(total)
    await expect(empty(page)).toBeHidden()
  })
})
