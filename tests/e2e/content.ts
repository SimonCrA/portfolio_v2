import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'yaml'

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

// The Projects the E2E build contains, in the site's order: Featured first, then newest.

export interface ProjectEntry {
  slug: string
  title: string
  summary: string
  kind: 'software' | 'hardware'
  status: string
  date: Date
  updated?: Date
  tags: string[]
  stack: string[]
  repo?: string
  demo?: string
  image?: string
  featured: boolean
}

function readProjects(dir: string): (ProjectEntry & { id: string })[] {
  return readdirSync(dir)
    .filter((f) => /^[^_].*\.mdx?$/.test(f))
    .map((f) => {
      const data = parse(readFileSync(join(dir, f), 'utf8').split(/^---$/m)[1])
      return { ...data, slug: f.replace(/\.mdx?$/, ''), id: f, date: new Date(data.date), updated: data.updated && new Date(data.updated), featured: !!data.featured }
    })
}

export const PROJECTS = [...readProjects('src/content/projects'), ...readProjects('src/content/projectsFixtures')].sort(
  (a, b) => Number(b.featured) - Number(a.featured) || b.date.valueOf() - a.date.valueOf() || b.id.localeCompare(a.id),
)
