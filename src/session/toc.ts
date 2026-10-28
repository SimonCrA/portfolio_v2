import type { MarkdownHeading } from 'astro'

export type TocItem = { slug: string; text: string; branch: string }

/**
 * A Post's sections drawn as `tree` output: the top heading level is the trunk and the next one
 * nests under it. Deeper headings stay out of the index. When a single heading sits on top (a
 * Post that opens with `# Introducción` and nests the rest), its level and the next form the trunk.
 */
export function toc(headings: MarkdownHeading[]): TocItem[] {
  const depths = [...new Set(headings.map((h) => h.depth))].sort()
  const single = depths.length > 1 && headings.filter((h) => h.depth === depths[0]).length === 1
  const trunk = single ? depths[1] : depths[0]
  const items = headings.filter((h) => h.depth <= trunk + 1).map((h) => ({ ...h, nested: h.depth > trunk }))
  let trunkLast = false
  return items.map((h, i) => {
    const rest = items.slice(i + 1)
    if (!h.nested) {
      trunkLast = !rest.some((r) => !r.nested)
      return { slug: h.slug, text: h.text, branch: trunkLast ? '└── ' : '├── ' }
    }
    const last = !rest[0]?.nested
    return { slug: h.slug, text: h.text, branch: (trunkLast ? '    ' : '│   ') + (last ? '└── ' : '├── ') }
  })
}
