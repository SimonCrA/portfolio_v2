// Markdown versions of the pages, built from the same content as the HTML (llms.txt profile).
// Each document names its canonical HTML page; /sitemap.md maps them all.
import type { CollectionEntry } from 'astro:content'
import { AUTHOR, SITE_URL } from '../config'
import { fmtDate } from './date'

export const abs = (path: string) => new URL(path, SITE_URL).href

/** A Markdown document that names its canonical HTML page. The site is static, so the
 * `text/markdown` type and the `Link: rel="canonical"` header come from vercel.json. */
export function markdownResponse(canonicalPath: string, title: string, body: string, updated?: Date) {
  const head = [
    `# ${title}`,
    '',
    `> Versión en Markdown de ${abs(canonicalPath)} · idioma: español${updated ? ` · actualizado: ${updated.toISOString().slice(0, 10)}` : ''} · autor: ${AUTHOR}`,
    '',
  ].join('\n')
  return new Response(`${head}\n${body.trim()}\n`)
}

/** Same rule as the HTML (rehype-demote-headings): a body that uses `#` sections moves every heading
 * one level down, so the document title stays the only `#`. Lines inside code fences are left alone. */
export function demoteHeadings(body: string) {
  let fenced = false
  const lines = body.split('\n')
  const hasH1 = lines.some((line) => (/^(```|~~~)/.test(line) ? ((fenced = !fenced), false) : !fenced && /^# /.test(line)))
  if (!hasH1) return body
  fenced = false
  return lines
    .map((line) => {
      if (/^(```|~~~)/.test(line)) fenced = !fenced
      return !fenced && /^#{1,5} /.test(line) ? `#${line}` : line
    })
    .join('\n')
}

export const postLine = (p: CollectionEntry<'blog'>) =>
  `- [${p.data.title}](${abs(`/blog/${p.slug}.md`)}) (${fmtDate(p.data.publishDate)}): ${p.data.description}`

export const projectLine = (p: CollectionEntry<'projects'>) =>
  `- [${p.data.title}](${abs(`/projects/${p.slug}.md`)}) (${p.data.status}, ${p.data.kind}): ${p.data.summary}`
