// Shared by the build and the browser, so a refreshed row reads exactly like a built one.
export const viewsLabel = (n: number) => `${n.toLocaleString('es-ES')} ${n === 1 ? 'vista' : 'vistas'}`
