// Search follows the window: on /blog it filters Posts, on /projects it filters Projects, and
// anywhere else it goes to /blog?q=. `/`, `:buscar`, `:grep` and `/<texto>` all run it. The state
// lives in `?q=` (shareable, reload-stable). After filtering, the status line also counts matches
// in the other collection (from the static /search.json) and links there.
// User text only ever reaches the DOM via `textContent`.
import { bind } from './keys'
import { go } from './navigation'
import { closePrompt, fold, message, openPrompt, registerCommand } from './prompt'

type Collection = 'blog' | 'projects'

const COLLECTIONS: Record<Collection, { route: string; one: string; many: string }> = {
  blog: { route: '/blog', one: 'post', many: 'posts' },
  projects: { route: '/projects', one: 'proyecto', many: 'proyectos' },
}
const otherOf = (c: Collection): Collection => (c === 'blog' ? 'projects' : 'blog')
const count = (n: number, c: Collection) => `${n} ${n === 1 ? COLLECTIONS[c].one : COLLECTIONS[c].many}`
const searchUrl = (c: Collection, q: string) => (q ? `${COLLECTIONS[c].route}?q=${encodeURIComponent(q)}` : COLLECTIONS[c].route)

const list = () => document.querySelector<HTMLElement>('[data-list][data-searchable]')
const collectionOf = (ol: HTMLElement) => (ol.dataset.searchable === 'projects' ? 'projects' : 'blog') as Collection

let index: Promise<Record<Collection, string[]>> | undefined
/** Matches for `q` in a collection, from the static index. 0 when the index cannot load. */
async function matchesIn(c: Collection, q: string) {
  index ??= fetch('/search.json').then((r) => r.json())
  try {
    const needle = fold(q)
    return (await index)[c].filter((text) => fold(text).includes(needle)).length
  } catch {
    index = undefined
    return 0
  }
}

/** Filter the rows in place. Only the `hidden` attribute of each `<li>` is toggled. */
function filter(ol: HTMLElement, q: string) {
  const needle = fold(q)
  let hits = 0
  for (const row of ol.querySelectorAll<HTMLElement>(':scope > li')) {
    const match = !needle || fold(row.dataset.search ?? '').includes(needle)
    row.hidden = !match
    if (match) hits++
  }

  const cmd = document.querySelector<HTMLElement>('[data-cmd]')
  if (cmd) {
    cmd.dataset.base ??= cmd.textContent ?? ''
    cmd.textContent = q ? `${cmd.dataset.base} | grep -i "${q}"` : cmd.dataset.base
  }

  const empty = document.querySelector<HTMLElement>('[data-empty]')
  if (empty) {
    empty.hidden = hits > 0
    const slot = empty.querySelector<HTMLElement>('[data-empty-q]')
    if (slot) slot.textContent = q
  }
  return hits
}

/** In the empty state, point to the matches in the other collection. */
async function pointToOther(here: Collection, q: string, hits: number) {
  const other = document.querySelector<HTMLElement>('[data-other]')
  if (!other) return
  other.hidden = true
  if (hits || !q) return
  const n = await matchesIn(otherOf(here), q)
  const link = other.querySelector<HTMLAnchorElement>('[data-other-link]')
  if (!n || !link) return
  link.textContent = `Ver ${count(n, otherOf(here))} con «${q}»`
  link.href = searchUrl(otherOf(here), q)
  other.hidden = false
}

function setUrl(q: string) {
  const url = new URL(location.href)
  if (q) url.searchParams.set('q', q)
  else url.searchParams.delete('q')
  // Keep the client router's own history state.
  history.replaceState(history.state, '', url)
}

/** Run a search from the prompt. */
async function search(raw: string) {
  const q = raw.trim()
  closePrompt()
  const ol = list()
  if (!ol) return go(searchUrl('blog', q))

  const here = collectionOf(ol)
  const other = otherOf(here)
  const hits = filter(ol, q)
  setUrl(q)
  void pointToOther(here, q, hits)
  if (!q) return message(`Mostrando todos los ${COLLECTIONS[here].many}.`)

  const elsewhere = await matchesIn(other, q)
  const link = elsewhere ? { label: `ver ${count(elsewhere, other)}`, href: searchUrl(other, q) } : undefined
  const also = elsewhere ? ` y ${count(elsewhere, other)}` : ''
  if (!hits)
    return message(`Ningún ${COLLECTIONS[here].one} con «${q}»${also}. Escribe :buscar sin texto para ver todos.`, 'error', link)
  message(`${count(hits, here)} con «${q}»${also}. Escribe :buscar sin texto para ver todos.`, 'info', link)
}

registerCommand(['buscar', 'grep', '/'], (arg) => void search(arg))
bind({ keys: ['/'], run: () => openPrompt('buscar ') })

// Apply `?q=` on a fresh load and after every client navigation.
document.addEventListener('astro:page-load', () => {
  const ol = list()
  const q = new URLSearchParams(location.search).get('q')?.trim()
  if (ol && q) void pointToOther(collectionOf(ol), q, filter(ol, q))
})
