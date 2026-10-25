// Spanish dates, always in UTC: content dates are calendar days, so the build machine's timezone
// must not move them. Short for lists and stamps ("8 abr 2025"), long for a Post ("8 de abril de 2025").
export const fmtDate = (d: Date) => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
export const fmtLongDate = (d: Date) => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
