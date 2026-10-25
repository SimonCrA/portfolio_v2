import type { CollectionEntry } from 'astro:content'
import { getSortedProjects } from '../../session/projects'
import { demoteHeadings, markdownResponse } from '../../session/markdown'

export async function getStaticPaths() {
  return (await getSortedProjects()).map((entry) => ({ params: { slug: entry.slug }, props: { entry } }))
}

export function GET({ props }: { props: { entry: CollectionEntry<'projects'> } }) {
  const { entry } = props
  const p = entry.data
  const facts = [
    `- Estado: ${p.status}`,
    `- Tipo: ${p.kind}`,
    `- Fecha: ${p.date.toISOString().slice(0, 10)}${p.updated ? ` (actualizado ${p.updated.toISOString().slice(0, 10)})` : ''}`,
    `- Stack: ${p.stack.join(', ')}`,
    `- Tags: ${p.tags.join(', ')}`,
    ...(p.repo ? [`- Repositorio: ${p.repo}`] : []),
    ...(p.demo ? [`- Demo: ${p.demo}`] : []),
  ].join('\n')
  return markdownResponse(`/projects/${entry.slug}/`, p.title, `${p.summary}\n\n${facts}\n\n${demoteHeadings(entry.body)}`, p.updated ?? p.date)
}
