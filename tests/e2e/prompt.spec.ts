import { test, expect, type Page } from '@playwright/test'

const status = (page: Page) => page.locator('.status')
const promptInput = (page: Page) => page.getByRole('textbox', { name: 'Comando' })
const message = (page: Page) => page.locator('.status output')
const windows = (page: Page) => page.getByRole('navigation', { name: 'Ventanas' })
const helpDialog = (page: Page) => page.getByRole('dialog', { name: 'ayuda' })

async function run(page: Page, cmd: string) {
  await page.keyboard.press(':')
  await expect(promptInput(page)).toBeFocused()
  await page.keyboard.type(cmd)
  await page.keyboard.press('Enter')
}

test.describe('prompt (keys)', () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(!!isMobile, 'keys are desktop only')
  })

  test('":" opens the prompt with focus in it; Esc closes it', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press(':')
    await expect(promptInput(page)).toBeVisible()
    await expect(promptInput(page)).toBeFocused()
    await expect(windows(page)).toBeHidden()
    await page.keyboard.press('Escape')
    await expect(promptInput(page)).toBeHidden()
    await expect(windows(page)).toBeVisible()
  })

  test('window commands navigate', async ({ page }) => {
    await page.goto('/')
    await run(page, 'blog')
    await expect(page).toHaveURL('/blog')
    await run(page, '3')
    await expect(page).toHaveURL('/videos')
    await run(page, 'cd proyectos')
    await expect(page).toHaveURL('/projects')
    await run(page, 'cd videos')
    await expect(page).toHaveURL('/videos')
    await run(page, '~')
    await expect(page).toHaveURL('/')
  })

  for (const cmd of ['Sobre-Mí', 'sobremi', 'cd sobre-mi', 'CD Sobre-Mí']) {
    test(`"${cmd}" reaches /sobre-mi`, async ({ page }) => {
      await page.goto('/')
      await run(page, cmd)
      await expect(page).toHaveURL('/sobre-mi')
    })
  }

  test(':cv opens a popup and shows a message', async ({ page, context }) => {
    await page.goto('/')
    const popup = context.waitForEvent('page')
    await run(page, 'cv')
    await popup
    await expect(message(page)).toContainText('CV')
  })

  test(':salir shows the info message', async ({ page }) => {
    await page.goto('/')
    await run(page, 'salir')
    await expect(message(page)).toContainText('nada que cerrar')
    await expect(message(page)).toHaveAttribute('data-kind', 'info')
  })

  test('unknown command shows an error and the status line comes back', async ({ page }) => {
    await page.goto('/')
    await run(page, 'foo')
    await expect(message(page)).toContainText('Comando desconocido: foo')
    await expect(message(page)).toHaveAttribute('data-kind', 'error')
    await expect(windows(page)).toBeHidden()
    await expect(message(page)).toBeHidden({ timeout: 5000 })
    await expect(windows(page)).toBeVisible()
  })

  test('? opens the help dialog and Esc closes it', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('?')
    const dialog = helpDialog(page)
    await expect(dialog).toBeVisible()
    for (const key of ['j\\s+k', 'enter', '/']) await expect(dialog.locator('th', { hasText: new RegExp(`^${key}$`) })).toBeVisible()
    await page.keyboard.press('2')
    await expect(page).toHaveURL('/')
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })

  test('help closes with q, ? and a click outside', async ({ page }) => {
    await page.goto('/')
    const dialog = helpDialog(page)
    await page.keyboard.press('?')
    await page.keyboard.press('q')
    await expect(dialog).toBeHidden()
    await page.keyboard.press('?')
    await expect(dialog).toBeVisible()
    await page.keyboard.press('?')
    await expect(dialog).toBeHidden()
    await page.keyboard.press('?')
    await expect(dialog).toBeVisible()
    await page.mouse.click(5, 5)
    await expect(dialog).toBeHidden()
  })

  test(':ayuda opens the help dialog', async ({ page }) => {
    await page.goto('/')
    await run(page, 'ayuda')
    await expect(helpDialog(page)).toBeVisible()
  })

  test('typing in the prompt does not trigger window keys', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press(':')
    await page.keyboard.type('2')
    await expect(promptInput(page)).toHaveValue('2')
    await expect(page).toHaveURL('/')
  })

  test('the prompt works after a client navigation', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('2')
    await expect(page).toHaveURL('/blog')
    await run(page, 'inicio')
    await expect(page).toHaveURL('/')
    await page.keyboard.press('?')
    await expect(helpDialog(page)).toBeVisible()
  })

  test('the cursor stops blinking under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await expect(page.locator('.live .cursor')).toHaveCSS('animation-name', 'none')
  })
})

test.describe('prompt (mouse)', () => {
  test('the ": comando" button opens the prompt', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'hidden on phones')
    await page.goto('/')
    await status(page).getByRole('button', { name: ': comando' }).click()
    await expect(promptInput(page)).toBeFocused()
  })

  test('the "? ayuda" button opens the help dialog', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'hidden on phones')
    await page.goto('/')
    await status(page).getByRole('button', { name: '? ayuda' }).click()
    await expect(helpDialog(page)).toBeVisible()
  })

  test('the home live prompt opens the prompt', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Abrir el prompt de comandos' }).click()
    await expect(promptInput(page)).toBeFocused()
  })

  test('the cursor blinks by default', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.live .cursor')).toHaveCSS('animation-name', 'blink')
  })

  test('the live prompt still works after navigating back home', async ({ page }) => {
    await page.goto('/')
    await windows(page).getByRole('link', { name: '2: Blog' }).click()
    await expect(page).toHaveURL('/blog')
    await windows(page).getByRole('link', { name: '0: Inicio' }).click()
    await expect(page).toHaveURL('/')
    await page.getByRole('button', { name: 'Abrir el prompt de comandos' }).click()
    await expect(promptInput(page)).toBeFocused()
  })
})

test.describe('prompt (phone)', () => {
  test('hints and buttons are hidden, no horizontal overflow', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'phone only')
    await page.goto('/')
    await expect(status(page).getByRole('button', { name: ': comando' })).toBeHidden()
    await expect(status(page).getByRole('button', { name: '? ayuda' })).toBeHidden()
    await expect(page.locator('.live-hint')).toBeHidden()
    await expect(page.getByRole('button', { name: 'Abrir el prompt de comandos' })).toBeVisible()
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBeLessThanOrEqual(0)
  })
})
