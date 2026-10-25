// Short Spanish date used across lists and the Now stamp, e.g. "8 abr 2025".
export const fmtDate = (d: Date) => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
