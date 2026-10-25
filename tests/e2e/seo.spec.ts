import { test, expect } from '@playwright/test'
import { POSTS, PROJECTS } from './content'

const SITE = 'https://www.simonctech.com'
const PAGES = ['/', '/sobre-mi/', '/blog/', '/projects/', '/videos/', `/blog/${POSTS[0].slug}/`, `/projects/${PROJECTS[0].slug}/`]

const head = (page: import('@playwright/test').Page) =>
  page.evaluate(() => ({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '',
    ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute('content') ?? '',
    h1: [...document.querySelectorAll('h1')].map((h) => h.textContent?.trim()),
    markdown: document.querySelector('link[rel="alternate"][type="text/markdown"]')?.getAttribute('href') ?? '',
    jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent ?? ''),
  }))

test.describe('search metadata', () => {
  test.skip(({ isMobile }) => !!isMobile, 'metadata does not depend on the device')

  test('every page has a unique title and description with the author, a canonical URL and one h1', async ({ page }) => {
    const seen = { titles: new Set<string>(), descriptions: new Set<string>() }
    for (const path of PAGES) {
      await page.goto(path)
      const h = await head(page)
      expect(h.title, path).toContain('Simón Clemente')
      expect(h.description.length, `${path} description`).toBeGreaterThan(40)
      expect(h.canonical, path).toBe(`${SITE}${path}`)
      expect(h.ogUrl, path).toBe(h.canonical)
      expect(h.h1, `${path} h1`).toHaveLength(1)
      seen.titles.add(h.title)
      seen.descriptions.add(h.description)
    }
    expect(seen.titles.size).toBe(PAGES.length)
    expect(seen.descriptions.size).toBe(PAGES.length)
  })

  test('structured data parses and matches what the page shows', async ({ page }) => {
    await page.goto(`/blog/${POSTS[0].slug}/`)
    const post = (await head(page)).jsonLd.map((j) => JSON.parse(j))[0]['@graph'].find((n: { '@type': string }) => n['@type'] === 'BlogPosting')
    expect(post.headline).toBe(POSTS[0].title)
    expect(post.author['@id']).toBe(`${SITE}/sobre-mi/#person`)
    await page.goto('/sobre-mi/')
    const profile = (await head(page)).jsonLd.map((j) => JSON.parse(j))[0]['@graph'].find((n: { '@type': string }) => n['@type'] === 'ProfilePage')
    const links = await page.locator('.links a').evaluateAll((as) => as.map((a) => a.getAttribute('href')))
    expect(profile.mainEntity.name).toBe('Simón Clemente')
    expect(profile.mainEntity.sameAs).toEqual(links)
  })

  test('each page links its Markdown version, which names the canonical page', async ({ page, request }) => {
    for (const path of PAGES) {
      await page.goto(path)
      const { markdown, canonical } = await head(page)
      expect(markdown, path).toMatch(/\.md$/)
      const res = await request.get(markdown)
      expect(res.status(), markdown).toBe(200)
      expect(await res.text(), markdown).toContain(canonical)
    }
  })

  test('llms.txt and sitemap.md only link Markdown pages that exist', async ({ request }) => {
    for (const file of ['/llms.txt', '/sitemap.md']) {
      const text = await (await request.get(file)).text()
      const links = [...text.matchAll(/\((https:\/\/www\.simonctech\.com[^)]+)\)/g)].map((m) => m[1].replace(SITE, ''))
      expect(links.length, file).toBeGreaterThan(4)
      for (const link of links) expect((await request.get(link)).status(), `${file} → ${link}`).toBe(200)
    }
  })

  test('robots.txt points to the XML sitemap and lets pages be crawled', async ({ request }) => {
    const robots = await (await request.get('/robots.txt')).text()
    expect(robots).toContain('Sitemap: https://www.simonctech.com/sitemap-index.xml')
    expect(robots).toMatch(/User-agent: \*\nAllow: \//)
  })

  test('the favicon set exists and the home page declares it', async ({ page, request }) => {
    for (const icon of ['/favicon.svg', '/favicon.ico', '/apple-touch-icon.png']) expect((await request.get(icon)).status(), icon).toBe(200)
    await page.goto('/')
    await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute('href', '/favicon.svg')
  })

  test('the 404 page is not indexable and has no canonical', async ({ request }) => {
    const html = await (await request.get('/404.html')).text()
    expect(html).toContain('<meta name="robots" content="noindex">')
    expect(html).not.toContain('rel="canonical"')
  })
})
