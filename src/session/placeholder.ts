// No stubs ship (spec #20): the build fails, naming the file, when Projects or Sobre mí still hold
// placeholder text. The check runs where those entries are loaded, so it also covers the Markdown
// body, which the collection schemas never see.
const PLACEHOLDER = /\bstub\b|texto de ejemplo/i

const strings = (value: unknown): string[] =>
  typeof value === 'string' ? [value] : Array.isArray(value) ? value.flatMap(strings) : value && typeof value === 'object' ? Object.values(value).flatMap(strings) : []

export function assertNoPlaceholder(file: string, data: unknown, body: string) {
  const hit = [...strings(data), body].find((text) => PLACEHOLDER.test(text))
  if (hit)
    throw new Error(`${file} todavía tiene texto de relleno («${hit.match(PLACEHOLDER)![0]}»). Reemplázalo con el contenido real antes de publicar.`)
}
