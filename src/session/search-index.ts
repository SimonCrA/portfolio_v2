import type { CollectionEntry } from 'astro:content'

// The text search matches against, one function per collection. The list pages put it in each row's
// `data-search`, and /search.json serves it so a window can count matches in the other collection.
export const postSearchText = ({ data: p }: CollectionEntry<'blog'>) => [p.title, p.description, ...p.tags].join(' ')

export const projectSearchText = ({ data: p }: CollectionEntry<'projects'>) =>
  [p.title, p.summary, p.kind, p.status, ...p.tags, ...p.stack].join(' ')
