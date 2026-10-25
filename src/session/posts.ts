import { getCollection } from 'astro:content'

// Every list of Posts uses this order: newest first, same-day Posts in a stable order.
export async function getSortedPosts() {
  const posts = await getCollection('blog')
  return posts.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf() || b.id.localeCompare(a.id))
}
