// No stubs ship (spec #20): the build fails, naming the file, when Projects or Sobre mí still hold
// placeholder text. The check runs where those entries are loaded, so it also covers the Markdown
// body, which the collection schemas never see. Placeholder text is "texto de ejemplo" or any line
// of the Project template, read from the template itself so the two never drift apart.
import { readFileSync } from 'node:fs'

const TEMPLATE = 'src/content/projects/_plantilla.md'

function templateLines(): string[] {
  const [, frontmatter = '', body = ''] = readFileSync(TEMPLATE, 'utf8').split(/^---$/m)
  const values = [...frontmatter.matchAll(/^(?:title|summary): (.+)$/gm)].map((m) => m[1])
  const prose = body.split('\n').filter((line) => line.trim() && !line.startsWith('#'))
  return [...values, ...prose].map((line) => line.trim())
}

const PLACEHOLDERS = ['texto de ejemplo', ...templateLines()].map((text) => text.toLowerCase())

const strings = (value: unknown): string[] =>
  typeof value === 'string' ? [value] : Array.isArray(value) ? value.flatMap(strings) : value && typeof value === 'object' ? Object.values(value).flatMap(strings) : []

export function assertNoPlaceholder(file: string, data: unknown, body: string) {
  const text = [...strings(data), body].join('\n').toLowerCase()
  const hit = PLACEHOLDERS.find((placeholder) => text.includes(placeholder))
  if (hit) throw new Error(`${file} todavía tiene texto de relleno («${hit}»). Reemplázalo con el contenido real antes de publicar.`)
}
