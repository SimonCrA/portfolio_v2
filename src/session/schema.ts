// Schema.org graphs (JSON-LD) built only from facts the page shows. One Person entity, defined on
// Sobre mí, is referenced by @id from the site, Posts and Projects.
import type { CollectionEntry } from 'astro:content'
import { AUTHOR, SITE_NAME, SITE_URL } from '../config'

const url = (path: string) => new URL(path, SITE_URL).href
export const PERSON_ID = url('/sobre-mi/#person')
export const WEBSITE_ID = url('/#website')
const personRef = { '@id': PERSON_ID, name: AUTHOR }

export function person(about: CollectionEntry<'about'>['data']) {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: about.name,
    url: url('/sobre-mi/'),
    image: url('/profile_pic.webp'),
    description: about.intro,
    jobTitle: 'Ingeniero de software fullstack',
    worksFor: { '@type': 'Organization', name: 'Nueve Once' },
    sameAs: about.links.map((l) => l.href),
  }
}

export const website = () => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: url('/'),
  name: SITE_NAME,
  inLanguage: 'es',
  author: { '@id': PERSON_ID },
})

export const graph = (...nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': nodes })

export function blogPosting(post: CollectionEntry<'blog'>) {
  const page = url(`/blog/${post.slug}/`)
  return {
    '@type': 'BlogPosting',
    '@id': `${page}#post`,
    headline: post.data.title,
    description: post.data.description,
    datePublished: post.data.publishDate.toISOString(),
    ...(post.data.image && { image: url(post.data.image) }),
    keywords: post.data.tags,
    inLanguage: 'es',
    url: page,
    mainEntityOfPage: page,
    author: personRef,
    publisher: personRef,
    isPartOf: { '@id': WEBSITE_ID },
  }
}

export function project(entry: CollectionEntry<'projects'>) {
  const p = entry.data
  const page = url(`/projects/${entry.slug}/`)
  return {
    '@type': 'CreativeWork',
    '@id': `${page}#project`,
    name: p.title,
    description: p.summary,
    dateCreated: p.date.toISOString().slice(0, 10),
    ...(p.updated && { dateModified: p.updated.toISOString().slice(0, 10) }),
    keywords: [...p.tags, ...p.stack],
    inLanguage: 'es',
    url: page,
    mainEntityOfPage: page,
    ...(p.image && { image: url(p.image) }),
    ...((p.repo || p.demo) && { sameAs: [p.repo, p.demo].filter(Boolean) }),
    author: personRef,
    isPartOf: { '@id': WEBSITE_ID },
  }
}
