// Loads the single Sobre mí entry. Every page showing its name, intro or Now reads it from here.
import { getEntry } from 'astro:content'

export async function getAbout() {
  const entry = await getEntry('about', 'sobre-mi')
  if (!entry) throw new Error('Missing content entry src/content/about/sobre-mi.md')
  return entry
}
