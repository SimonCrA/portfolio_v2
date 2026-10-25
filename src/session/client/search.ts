// Blog search: `/`, `:buscar`, `:grep` and `/<texto>` filter the list on /blog; elsewhere they go to /blog?q=.
// State lives in `?q=` (shareable, reload-stable). User text only ever reaches the DOM via `textContent`.
import { bind } from './keys'
import { go } from './navigation'
import { closePrompt, fold, message, openPrompt, registerCommand } from './prompt'

const BLOG = '/blog'

const list = () => document.querySelector<HTMLElement>('[data-list][data-searchable]')

/** Filter the rows in place. Only the `hidden` attribute of each `<li>` is toggled. */
function filter(ol: HTMLElement, q: string) {
  const needle = fold(q)
  const rows = [...ol.querySelectorAll<HTMLElement>(':scope > li')]
  let hits = 0
  for (const row of rows) {
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

function setUrl(q: string) {
  const url = new URL(location.href)
  if (q) url.searchParams.set('q', q)
  else url.searchParams.delete('q')
  // Keep the client router's own history state.
  history.replaceState(history.state, '', url)
}

/** Run a search from the prompt. */
function search(raw: string) {
  const q = raw.trim()
  closePrompt()
  const ol = list()
  if (!ol) return go(q ? `${BLOG}?q=${encodeURIComponent(q)}` : BLOG)

  const hits = filter(ol, q)
  setUrl(q)
  if (!q) return message('Mostrando todos los posts.')
  if (!hits) return message(`Ningún post con «${q}». Escribe :buscar sin texto para verlos todos.`, 'error')
  message(`${hits} ${hits === 1 ? 'post' : 'posts'} con «${q}». Escribe :buscar sin texto para verlos todos.`)
}

registerCommand(['buscar', 'grep', '/'], search)
bind({ keys: ['/'], run: () => openPrompt('buscar ') })

// Apply `?q=` on a fresh load and after every client navigation.
document.addEventListener('astro:page-load', () => {
  const ol = list()
  const q = new URLSearchParams(location.search).get('q')?.trim()
  if (ol && q) filter(ol, q)
})
