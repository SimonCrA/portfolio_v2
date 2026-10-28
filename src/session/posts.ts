import { getCollection, type CollectionEntry } from 'astro:content'
import { withFixtures } from './fixtures'

// Every list of Posts uses this order: newest first, same-day Posts in a stable order.
export async function getSortedPosts() {
  const posts = await withFixtures(await getCollection('blog'), () => getCollection('blogFixtures'))
  return posts.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf() || b.id.localeCompare(a.id))
}

/** Minutes to read a Post, at about 200 words per minute. */
export const readingMinutes = (post: CollectionEntry<'blog'>) =>
  Math.max(1, Math.ceil((post.body ?? '').split(/\s+/).filter(Boolean).length / 200))

/** The parts of the series a Post belongs to, in order. Empty when the Post is not in one. */
export function seriesOf(post: CollectionEntry<'blog'>, posts: CollectionEntry<'blog'>[]) {
  const name = post.data.series?.name
  if (!name) return []
  return posts.filter((p) => p.data.series?.name === name).sort((a, b) => a.data.series!.part - b.data.series!.part)
}

/** Every Tag with how many Posts carry it, the most used first. */
export function topics(posts: CollectionEntry<'blog'>[]) {
  const count = new Map<string, number>()
  for (const t of posts.flatMap((p) => p.data.tags)) count.set(t, (count.get(t) ?? 0) + 1)
  return [...count].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([tag, n]) => ({ tag, n }))
}
