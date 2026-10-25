import { test, expect } from '@playwright/test'

// Where #16 (lists) and #17 (search) meet: the filtered list is what selection, :abrir and the label see.
test.skip(({ isMobile }) => !!isMobile, 'keyboard only')

test('a search narrows what :abrir and the position label count', async ({ page }) => {
  await page.goto('/blog')
  await page.keyboard.press('/')
  await page.keyboard.type('latex')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\?q=latex/)
  await expect(page.locator('.pane-pos')).toHaveText('[1-1/1]')

  await page.keyboard.press(':')
  await page.keyboard.type('abrir 2')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('status').or(page.locator('output'))).toContainText('del 1 al 1')

  await page.keyboard.press(':')
  await page.keyboard.type('abrir 1')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/blog\/cv\/github-latex/)
})

test('j then Enter opens the only match', async ({ page }) => {
  await page.goto('/blog?q=imagenes')
  await page.keyboard.press('j')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/blog\/optimizar\/imagenes-web/)
})
