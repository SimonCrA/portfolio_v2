/** Run `fn` at most once per animation frame, however often the event fires (scroll, resize). */
export function perFrame(fn: () => void): () => void {
  let queued = false
  return () => {
    if (queued) return
    queued = true
    requestAnimationFrame(() => {
      queued = false
      fn()
    })
  }
}
