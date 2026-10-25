// Pane scrolling. On desktop the panes scroll, not the page (see `.pane-scroll` in session.css);
// on phones the page does. Every `.pane-scroll` box that holds no list gets the "↓ más abajo" cue
// the lists use (lists.ts counts rows instead, so it owns the cue in boxes with a `[data-list]`).
import { perFrame } from './frame'

/** What a reader's j/k and pager act on (Post, Project, Sobre mí): its pane when it scrolls, else the page. */
export function readerScroller(): HTMLElement | Window {
  const box = document.querySelector<HTMLElement>('[data-scroll-box]')
  return box && box.scrollHeight > box.clientHeight + 1 ? box : window
}

const boxes = () => [...document.querySelectorAll<HTMLElement>('.pane-scroll')].filter((b) => !b.querySelector('[data-list]'))

function cue(box: HTMLElement) {
  let more = box.querySelector<HTMLElement>(':scope > [data-scroll-more]')
  if (!more) {
    more = document.createElement('div')
    more.className = 'list-more'
    more.dataset.scrollMore = ''
    more.setAttribute('aria-hidden', 'true')
    more.innerHTML = '<span>↓ más abajo</span>'
    box.append(more)
  }
  return more
}

function refresh() {
  for (const box of boxes()) {
    const scrolls = getComputedStyle(box).overflowY === 'auto' && box.scrollHeight > box.clientHeight + 2
    cue(box).hidden = !scrolls || box.scrollTop + box.clientHeight >= box.scrollHeight - 2
  }
}

const refreshSoon = perFrame(refresh)
document.addEventListener('astro:page-load', refresh)
document.addEventListener('scroll', refreshSoon, { capture: true, passive: true })
addEventListener('resize', refreshSoon)
// The navigator preview changes height on hover and focus.
document.addEventListener('pointerover', refreshSoon, { passive: true })
document.addEventListener('focusin', refreshSoon)
