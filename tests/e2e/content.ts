import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// The Posts the E2E build contains: the real blog plus the fixture Posts (E2E_FIXTURES=1), newest first.
export const FIXTURE_POST = { slug: 'e2e/fixture-post', title: 'Post de prueba (e2e-fixture)' }

function read(dir: string) {
  return readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => {
      const fm = readFileSync(join(dir, f), 'utf8').split('---')[1]
      const get = (k: string) => fm.match(new RegExp(`^${k}:\\s*(.+)$`, 'm'))?.[1].trim().replace(/^['"]|['"]$/g, '') ?? ''
      return { slug: get('slug') || f.replace(/\.mdx?$/, ''), title: get('title'), date: new Date(get('publishDate')).valueOf() }
    })
}

export const POSTS = [...read('src/content/blog'), ...read('src/content/blogFixtures')].sort((a, b) => b.date - a.date)
