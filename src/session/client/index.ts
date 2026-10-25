// Session client module: loaded once from SessionLayout and survives client-router navigations.
// Document-level listeners bind here exactly once; per-page setup belongs in `astro:page-load`.
import { WINDOWS } from '../windows'
import { bind, listen } from './keys'
// The prompt module registers its bindings first so the help popup can shadow the page keys.
import { message } from './prompt'
import { go } from './navigation'
import { refreshLists } from './lists'

export { go, message, refreshLists }

/** Pages that are a Post mark their `<main>` with `data-post`. */
export const onPost = () => !!document.querySelector('[data-post]')

// Number keys: 0-4 open the matching window.
WINDOWS.forEach((w, i) => bind({ keys: [String(i)], run: () => go(w.route) }))

// Post pager keys.
bind({ keys: ['j'], when: onPost, run: () => scrollBy({ top: 80, behavior: 'smooth' }) })
bind({ keys: ['k'], when: onPost, run: () => scrollBy({ top: -80, behavior: 'smooth' }) })
bind({ keys: ['q'], when: onPost, run: () => go('/') })

// The status line is persisted, so its DOM is from the first page: re-mark the current window from
// the new document (`body[data-window]`) after every swap.
function syncStatus() {
  const current = document.body.dataset.window
  document.querySelectorAll<HTMLAnchorElement>('.status nav a').forEach((a, i) => {
    if (WINDOWS[i].key === current) a.setAttribute('aria-current', 'page')
    else a.removeAttribute('aria-current')
  })
}
document.addEventListener('astro:after-swap', syncStatus)
document.addEventListener('astro:page-load', syncStatus)

listen()
