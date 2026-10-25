import { test, expect, type Page } from '@playwright/test'
import { POSTS, PROJECTS, VIDEOS } from './content'

// The home feed mixes Posts, Projects and Videos.
const FEED = POSTS.length + PROJECTS.length + VIDEOS.length

// How far the reader has scrolled: its pane on desktop, the page on phones.
const readerScroll = (page: Page) => page.evaluate(() => Math.max(scrollY, document.querySelector('[data-scroll-box]')?.scrollTop ?? 0))

const promptInput = (page: Page) => page.getByRole('textbox', { name: 'Comando' })
const message = (page: Page) => page.locator('.status output')
const feedRows = (page: Page) => page.locator('[data-list] > li:not([hidden]) > a')
const selected = (page: Page) => page.locator('[data-list] a[aria-current="true"]')
const feedPane = (page: Page) => page.locator('.pane-latest')

async function run(page: Page, cmd: string) {
  await page.keyboard.press(':')
  await expect(promptInput(page)).toBeFocused()
  await page.keyboard.type(cmd)
  await page.keyboard.press('Enter')
}

test.describe('lists (keys)', () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(!!isMobile, 'keys are desktop only')
  })

  test('j/j/k move the selection and Enter opens the selected Post', async ({ page }) => {
    await page.goto('/')
    const rows = feedRows(page)
    await expect(rows.nth(0)).toHaveAttribute('aria-current', 'true')
    await page.keyboard.press('j')
    await page.keyboard.press('j')
    await expect(rows.nth(2)).toHaveAttribute('aria-current', 'true')
    await page.keyboard.press('k')
    await expect(rows.nth(1)).toHaveAttribute('aria-current', 'true')
    await expect(selected(page)).toHaveCount(1)
    const href = await rows.nth(1).getAttribute('href')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(href!)
    await expect(page.locator('[data-post]')).toBeVisible()
  })

  test('hovering a row selects it', async ({ page }) => {
    await page.goto('/')
    await feedRows(page).nth(3).hover()
    await expect(feedRows(page).nth(3)).toHaveAttribute('aria-current', 'true')
    await expect(selected(page)).toHaveCount(1)
  })

  test('Enter on a focused link does not open the row twice', async ({ page }) => {
    await page.goto('/')
    const href = await feedRows(page).nth(2).getAttribute('href')
    const link = feedRows(page).nth(2)
    await link.evaluate((a) => {
      ;(window as any).clicks = 0
      a.addEventListener('click', () => (window as any).clicks++)
    })
    await link.focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(href!)
    expect(await page.evaluate(() => (window as any).clicks)).toBe(1)
  })

  test(':abrir opens item n, :open is an alias', async ({ page }) => {
    await page.goto('/')
    const href = await feedRows(page).nth(1).getAttribute('href')
    await run(page, 'abrir 2')
    await expect(page).toHaveURL(href!)
    await page.goto('/')
    const first = await feedRows(page).first().getAttribute('href')
    await run(page, 'open 1')
    await expect(page).toHaveURL(first!)
  })

  test(':abrir out of range shows the range error', async ({ page }) => {
    await page.goto('/')
    await run(page, 'abrir 99')
    await expect(message(page)).toHaveText(`Escribe un número del 1 al ${FEED}: por ejemplo :abrir 1`)
    await expect(page).toHaveURL('/')
  })

  test(':abrir without a list says so', async ({ page }) => {
    await page.goto('/sobre-mi')
    await run(page, 'abrir 1')
    await expect(message(page)).toHaveText('Esta ventana no tiene una lista que abrir.')
  })

  test('the feed position label and cue follow the feed scroll', async ({ page }) => {
    await page.goto('/')
    // The Posts fit the pane at any desktop height, so grow the feed (4x) until it overflows.
    await page.locator('[data-list]').evaluate((ol) => {
      const rows = [...ol.children]
      for (let i = 0; i < 3; i++) rows.forEach((li) => ol.append(li.cloneNode(true)))
    })
    await expect(page.locator('[data-latest-scroll]')).toHaveJSProperty('scrollTop', 0)
    const pos = feedPane(page).locator('[data-list-pos]')
    const more = feedPane(page).locator('[data-list-more] > span')
    await expect(pos).toHaveAttribute('aria-hidden', 'true')
    await expect(pos).toHaveText(new RegExp(`^\\[1-\\d+/${FEED * 4}\\]$`))
    const before = await pos.textContent()
    await expect(more).toBeVisible()
    await expect(more).toContainText('más abajo')
    await page.locator('[data-latest-scroll]').evaluate((el) => (el.scrollTop = el.scrollHeight))
    await expect(pos).toHaveText(new RegExp(`^\\[\\d+-${FEED * 4}/${FEED * 4}\\]$`))
    await expect(pos).not.toHaveText(before!)
    await expect(more).toBeHidden()
  })

  test('on a Post, j still scrolls the reader', async ({ page }) => {
    await page.goto('/')
    const href = await feedRows(page).first().getAttribute('href')
    await page.goto(href!)
    await page.setViewportSize({ width: 1440, height: 300 })
    await page.keyboard.press('j')
    await expect.poll(() => readerScroll(page)).toBeGreaterThan(0)
  })
})

test.describe('lists on /blog', () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(!!isMobile, 'keys are desktop only')
  })

  test('selection works and the label counts the visible rows', async ({ page }) => {
    await page.goto('/blog')
    const rows = feedRows(page)
    await expect(rows.first()).toHaveAttribute('aria-current', 'true')
    await page.keyboard.press('j')
    await expect(rows.nth(1)).toHaveAttribute('aria-current', 'true')
    const pos = page.locator('[data-list-pos]')
    await expect(pos).toHaveText(new RegExp(`^\\[1-\\d+/${POSTS.length}\\]$`))
    // Hiding a row (what search does) updates the total and moves a hidden cursor off it.
    await page.locator('[data-list] > li').nth(1).evaluate((li) => li.setAttribute('hidden', ''))
    await expect(pos).toHaveText(new RegExp(`^\\[1-\\d+/${POSTS.length - 1}\\]$`))
    await expect(selected(page)).toHaveCount(1)
    await expect(rows).toHaveCount(POSTS.length - 1)
  })

  test(':abrir uses only the visible rows', async ({ page }) => {
    await page.goto('/blog')
    await page.locator('[data-list] > li').first().evaluate((li) => li.setAttribute('hidden', ''))
    const href = await feedRows(page).first().getAttribute('href')
    await run(page, 'abrir 1')
    await expect(page).toHaveURL(href!)
  })
})
