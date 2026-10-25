import type { CollectionEntry } from 'astro:content'
import { getSortedPosts } from '../../session/posts'
import { demoteHeadings, markdownResponse } from '../../session/markdown'

export async function getStaticPaths() {
  return (await getSortedPosts()).map((entry) => ({ params: { slug: entry.slug }, props: { entry } }))
}

export function GET({ props }: { props: { entry: CollectionEntry<'blog'> } }) {
  const { entry } = props
  const p = entry.data
  return markdownResponse(`/blog/${entry.slug}/`, p.title, `${p.description}\n\nTags: ${p.tags.join(', ')}\n\n${demoteHeadings(entry.body)}`, p.publishDate)
}
