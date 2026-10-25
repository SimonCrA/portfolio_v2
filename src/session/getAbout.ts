// Loads the single Sobre mí entry. Every page showing its name, intro or Now reads it from here.
import { getEntry } from 'astro:content'
import { assertNoPlaceholder } from './placeholder'
// Loaded for its guard against test switches in a Vercel build.
import './fixtures'

export async function getAbout() {
  // The placeholder guard's own test swaps in a Sobre mí whose body repeats the intro.
  const entry = process.env.E2E_PLACEHOLDER === 'about' ? await getEntry('aboutFixtures', 'sobre-mi') : await getEntry('about', 'sobre-mi')
  if (!entry) throw new Error('Missing content entry src/content/about/sobre-mi.md')
  const file = `src/content/${entry.collection}/${entry.id}`
  assertNoPlaceholder(file, entry.data, entry.body)
  if (entry.body.trim() === entry.data.intro.trim())
    throw new Error(`${file}: el cuerpo repite la intro. Escribe tu historia en el cuerpo; la intro es la versión corta.`)
  return entry
}
