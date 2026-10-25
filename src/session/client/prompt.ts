// Command prompt, status-line messages and the help popup (tmux `:`, `display-message`, `display-popup`).
// The status line is persisted across client navigations, so everything here binds exactly once.
import { WINDOWS, CV_URL } from '../windows'
import { bind } from './keys'
import { go } from './navigation'

export type MessageKind = 'info' | 'error'

const MESSAGE_MS = 3500

const status = document.querySelector<HTMLElement>('footer.status')!
const line = status.querySelector<HTMLElement>('[data-status-line]')!
const form = status.querySelector<HTMLFormElement>('[data-prompt]')!
const input = form.querySelector('input')!
const output = status.querySelector<HTMLOutputElement>('[data-message]')!
const help = status.querySelector<HTMLDialogElement>('[data-help]')!

/** Lowercase and strip accents, so `Sobre-Mí` matches `sobre-mi`. */
export const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/* ---------- messages ---------- */

let timer: number | undefined

/** Replace the status line with a message for ~3.5s, like tmux `display-message`. */
/** Show a message in the status line. An optional link (e.g. to the other search results) follows the text. */
export function message(text: string, kind: MessageKind = 'info', link?: { label: string; href: string }) {
  closePrompt()
  clearTimeout(timer)
  output.textContent = text
  if (link) {
    const a = document.createElement('a')
    a.href = link.href
    a.textContent = link.label
    a.className = 'status-msg-link'
    output.append(' ', a)
  }
  output.dataset.kind = kind
  line.hidden = true
  output.hidden = false
  // A message with a link stays longer, so there is time to follow it.
  timer = window.setTimeout(() => {
    output.hidden = true
    line.hidden = false
  }, link ? MESSAGE_MS * 2 : MESSAGE_MS)
}

/* ---------- prompt ---------- */

export function openPrompt(prefill = '') {
  closeHelp()
  clearTimeout(timer)
  output.hidden = true
  line.hidden = true
  form.hidden = false
  input.value = prefill
  input.focus()
}

export function closePrompt() {
  if (form.hidden) return
  form.hidden = true
  line.hidden = false
  input.blur()
}

/* ---------- help ---------- */

export const helpOpen = () => help.open
export function openHelp() {
  closePrompt()
  if (!help.open) help.showModal()
}
export function closeHelp() {
  if (help.open) help.close()
}

/* ---------- commands ---------- */

export type CommandHandler = (arg: string) => void

/** Command table. Other tickets add their entries with `registerCommand`. Names are folded. */
const commands = new Map<string, CommandHandler>()

export function registerCommand(names: string | string[], handler: CommandHandler) {
  for (const name of [names].flat()) commands.set(fold(name), handler)
}

/** Resolve `0`-`4`, a window key, `~` or `sobremi` to a window route. */
function windowRoute(name: string): string | undefined {
  const k = fold(name).replace(/\/$/, '')
  if (k === '~') return WINDOWS[0].route
  if (/^[0-4]$/.test(k)) return WINDOWS[Number(k)].route
  return WINDOWS.find((w) => w.key === k || w.key.replace('-', '') === k)?.route
}

function toWindow(name: string) {
  const route = windowRoute(name)
  if (!route) return false
  closePrompt()
  go(route)
  return true
}

registerCommand('cd', (arg) => {
  if (!toWindow(arg)) message(`cd: no existe la ventana: ${arg || '(vacío)'}. Pulsa ? para ver las ventanas.`, 'error')
})
registerCommand(['ayuda', 'help', '?'], () => openHelp())
registerCommand('cv', () => {
  window.open(CV_URL, '_blank', 'noopener')
  message('Abriendo el CV en otra pestaña.')
})
registerCommand(['q', 'salir', 'exit'], () => message('Aquí no hay nada que cerrar. Pulsa 0 para volver al inicio.'))

export function run(raw: string) {
  const text = raw.trim()
  if (!text) return closePrompt()
  // `/texto` is a search, with no space needed after the slash.
  if (text.startsWith('/')) return commands.get('/')?.(text.slice(1))
  const [first, ...rest] = text.split(/\s+/)
  const handler = commands.get(fold(first))
  if (handler) return handler(rest.join(' '))
  if (toWindow(first)) return
  message(`Comando desconocido: ${first}. Pulsa ? para ver los comandos.`, 'error')
}

/* ---------- wiring (once) ---------- */

form.addEventListener('submit', (e) => {
  e.preventDefault()
  run(input.value)
})
input.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePrompt()
})
// Deferred so a click on a button inside the line is not swallowed; skip if focus came back meanwhile.
input.addEventListener('blur', () =>
  setTimeout(() => {
    if (document.activeElement !== input) closePrompt()
  }, 100),
)

// Click outside the box closes the popup: the dialog element itself is the backdrop.
help.addEventListener('click', (e) => {
  if (e.target === help) closeHelp()
})

// Mouse entry points are delegated, so they also work for the home live prompt after navigations.
document.addEventListener('click', (e) => {
  const target = e.target as Element
  if (target.closest('[data-open-prompt]')) openPrompt()
  else if (target.closest('[data-open-help]')) helpOpen() ? closeHelp() : openHelp()
})

// Registered first (this module is imported before the rest), so while the popup is open these win.
bind({ keys: ['q', '?', 'Escape'], when: helpOpen, run: closeHelp })
bind({ keys: ['0', '1', '2', '3', '4', 'j', 'k', ':', '/', 'Enter'], when: helpOpen, run: () => {} })
bind({ keys: [':'], run: () => openPrompt() })
bind({ keys: ['?'], run: () => openHelp() })
