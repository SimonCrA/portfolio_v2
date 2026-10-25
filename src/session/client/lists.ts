// List navigation: the one "current list" convention, the selection cursor, `:abrir` and the scroll
// indicators (tmux copy-mode style).
//
// Convention: a list container carries `data-list`; its rows are the `<a>` directly inside each `<li>`.
// A row inside a `hidden` `<li>` does not count (search toggles that attribute). The selected row has
// `aria-current="true"`. A list whose pane scrolls internally sits inside an element marked `data-scroll`;
// otherwise the page itself scrolls and the position label is computed against the viewport.
import { bind } from './keys'
import { registerCommand, closePrompt, message } from './prompt'
import { perFrame } from './frame'

const LIST = '[data-list]'
const ROW = 'li:not([hidden]) > a'

const currentList = () => document.querySelector<HTMLElement>(LIST)
export const hasList = () => !!currentList()

export function rows(list: ParentNode | null = currentList()): HTMLAnchorElement[] {
  return list ? [...list.querySelectorAll<HTMLAnchorElement>(ROW)] : []
}

/* ---------- selection ---------- */

function select(list: HTMLElement, i: number, scroll = false) {
  const all = rows(list)
  if (!all.length) return
  const n = Math.max(0, Math.min(all.length - 1, i))
  list.querySelectorAll('[aria-current]').forEach((r) => r.removeAttribute('aria-current'))
  all[n].setAttribute('aria-current', 'true')
  if (scroll) all[n].scrollIntoView({ block: 'nearest' })
}

const selectedIndex = (list: HTMLElement) => rows(list).findIndex((r) => r.getAttribute('aria-current') === 'true')

/** Keep exactly one visible row selected: a row that was hidden loses the cursor, which returns to the first. */
function ensureSelection(list: HTMLElement) {
  if (selectedIndex(list) === -1) select(list, 0)
}

function move(delta: number) {
  const list = currentList()
  if (!list) return
  select(list, Math.max(selectedIndex(list), 0) + delta, true)
}

/* ---------- scroll indicators ---------- */

/** The pane label and the "más abajo" cue are created here, so pages only mark `data-list` / `data-scroll`. */
function indicators(list: HTMLElement) {
  const pane = list.closest<HTMLElement>('.pane')
  const box = list.closest<HTMLElement>('[data-scroll]')
  let pos = pane?.querySelector<HTMLElement>(':scope > [data-list-pos]') ?? null
  if (pane && !pos) {
    pos = document.createElement('span')
    pos.className = 'pane-pos'
    pos.dataset.listPos = ''
    pos.setAttribute('aria-hidden', 'true')
    pane.append(pos)
  }
  let more = box?.querySelector<HTMLElement>(':scope > [data-list-more]') ?? null
  if (box && !more) {
    more = document.createElement('div')
    more.className = 'list-more'
    more.dataset.listMore = ''
    more.setAttribute('aria-hidden', 'true')
    more.innerHTML = '<span></span>'
    more.hidden = true
    box.append(more)
  }
  return { box, pos, more }
}

function refreshIndicators(list: HTMLElement) {
  const { box, pos, more } = indicators(list)
  const items = rows(list)
  if (!items.length || !list.offsetParent) {
    if (pos) pos.hidden = true
    if (more) more.hidden = true
    return
  }
  // Visible window: the scroll box, or the viewport when the page scrolls (`/blog`).
  const view = box ? box.getBoundingClientRect() : { top: 0, bottom: innerHeight }
  let first = items.findIndex((r) => r.getBoundingClientRect().bottom > view.top + 4)
  if (first === -1) first = items.length - 1
  let last = items.length - 1
  while (last > first && items[last].getBoundingClientRect().top > view.bottom - 4) last--
  if (pos) {
    pos.hidden = false
    pos.textContent = `[${first + 1}-${last + 1}/${items.length}]`
  }
  if (more) {
    // Rows below the visible area; the cue is hidden once the box is scrolled to its end.
    const left = items.length - 1 - last
    const atEnd = box!.scrollTop + box!.clientHeight >= box!.scrollHeight - 2
    // A partly visible last row still needs the cue, without a count.
    more.hidden = atEnd
    more.firstElementChild!.textContent = left ? `↓ ${left} más abajo` : '↓ más abajo'
  }
}

/** Recompute selection and indicators for every list on the page. Call it after toggling rows. */
export function refreshLists() {
  document.querySelectorAll<HTMLElement>(LIST).forEach((list) => {
    ensureSelection(list)
    refreshIndicators(list)
  })
}

/* ---------- wiring ---------- */

let observers: MutationObserver[] = []
function watchLists() {
  observers.forEach((o) => o.disconnect())
  observers = [...document.querySelectorAll<HTMLElement>(LIST)].map((list) => {
    const o = new MutationObserver(refreshLists)
    o.observe(list, { attributes: true, attributeFilter: ['hidden'], subtree: true, childList: true })
    return o
  })
}

document.addEventListener('astro:page-load', () => {
  // Each page starts with the cursor on its first row.
  document.querySelectorAll<HTMLElement>(LIST).forEach((list) => select(list, 0))
  watchLists()
  refreshLists()
})
// `scroll` does not bubble: the capture phase catches the window and every scroll box with one listener.
const refreshSoon = perFrame(refreshLists)
document.addEventListener('scroll', refreshSoon, { capture: true, passive: true })
addEventListener('resize', refreshSoon)

// `pointermove`, not `pointerover`: a row scrolling under a still mouse must not steal the cursor.
document.addEventListener('pointermove', (e) => {
  const row = (e.target as Element).closest?.<HTMLAnchorElement>(`${LIST} li > a`)
  const list = row?.closest<HTMLElement>(LIST)
  if (!row || !list) return
  const i = rows(list).indexOf(row)
  if (i >= 0 && i !== selectedIndex(list)) select(list, i)
})

const onControl = (e: KeyboardEvent) => !!(e.target as Element | null)?.closest?.('a, button')
bind({ keys: ['j'], when: hasList, run: () => move(1) })
bind({ keys: ['k'], when: hasList, run: () => move(-1) })
// On a focused link or button Enter is left alone (the binding does not match, so no preventDefault).
bind({ keys: ['Enter'], when: (e) => hasList() && !onControl(e), run: () => rows()[selectedIndex(currentList()!)]?.click() })

registerCommand(['abrir', 'open'], (arg) => {
  if (!hasList()) return message('Esta ventana no tiene una lista que abrir.', 'error')
  const all = rows()
  const n = Number(arg)
  if (!Number.isInteger(n) || n < 1 || n > all.length)
    return message(`Escribe un número del 1 al ${all.length}: por ejemplo :abrir 1`, 'error')
  closePrompt()
  all[n - 1].click()
})
