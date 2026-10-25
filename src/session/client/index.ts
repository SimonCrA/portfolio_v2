// Session client module: loaded once from SessionLayout and survives client-router navigations.
// Document-level listeners bind here exactly once; per-page setup belongs in `astro:page-load`.
import { WINDOWS } from '../windows'
import { bind, listen } from './keys'
// The prompt module registers its bindings first so the help popup can shadow the page keys.
import { message } from './prompt'
import { go } from './navigation'
import './search'
import { refreshLists } from './lists'
import { readerScroller } from './scroll'

export { go, message, refreshLists }

/** Posts and Projects mark their `<main>` with `data-post`; q leaves them. */
export const onPost = () => !!document.querySelector('[data-post]')
/** Every page with a `glow` reader (Posts, Projects, Sobre mí) scrolls it with j/k. */
const onReader = () => !!document.querySelector('[data-scroll-box]')

// Number keys: 0-4 open the matching window.
WINDOWS.forEach((w, i) => bind({ keys: [String(i)], run: () => go(w.route) }))

// Reader keys.
bind({ keys: ['j'], when: onReader, run: () => readerScroller().scrollBy({ top: 80, behavior: 'smooth' }) })
bind({ keys: ['k'], when: onReader, run: () => readerScroller().scrollBy({ top: -80, behavior: 'smooth' }) })
bind({ keys: ['q'], when: onPost, run: () => go('/') })

// The status line is persisted, so its DOM is from the first page: re-mark the current window from
// the new document (`body[data-window]`) after every swap.
function syncStatus() {
  // Today's date, from the visitor's clock: the pages are built ahead of time.
  const today = document.querySelector<HTMLElement>('[data-today]')
  if (today) today.textContent = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
  const current = document.body.dataset.window
  document.querySelectorAll<HTMLAnchorElement>('footer.status nav a').forEach((a, i) => {
    if (WINDOWS[i].key === current) a.setAttribute('aria-current', 'page')
    else a.removeAttribute('aria-current')
  })
}
document.addEventListener('astro:after-swap', syncStatus)
document.addEventListener('astro:page-load', syncStatus)

listen()
