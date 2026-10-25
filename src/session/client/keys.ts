// Key-binding registry for the session. One keydown listener dispatches to bindings whose `when`
// predicate holds for the current page. Later tickets (command prompt, list navigation, search)
// register their own bindings with `bind`.

export interface Binding {
  /** `event.key` values this binding answers to. */
  keys: readonly string[]
  /** Optional page predicate, evaluated on every press so it follows client navigations. */
  when?: () => boolean
  run: (event: KeyboardEvent) => void
}

const bindings: Binding[] = []

export function bind(binding: Binding) {
  bindings.push(binding)
}

/** True when focus is in a field where typing must not trigger shortcuts. */
export function isTyping(target: EventTarget | null): boolean {
  return target instanceof Element && !!target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')
}

function onKeydown(event: KeyboardEvent) {
  if (event.ctrlKey || event.metaKey || event.altKey || event.defaultPrevented) return
  if (isTyping(event.target)) return
  const hit = bindings.find((b) => b.keys.includes(event.key) && (!b.when || b.when()))
  if (!hit) return
  event.preventDefault()
  hit.run(event)
}

let listening = false
/** Attach the single document listener; calling it again is a no-op. */
export function listen() {
  if (listening) return
  listening = true
  document.addEventListener('keydown', onKeydown)
}
