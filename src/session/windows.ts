// The site is one tmux session; each section is a window with its own route (ADR 0002).
// Single source for the status line, the number keys, the command prompt and the navigator.
export const WINDOWS = [
  { key: 'inicio', label: 'Inicio', route: '/' },
  { key: 'proyectos', label: 'Proyectos', route: '/projects' },
  { key: 'blog', label: 'Blog', route: '/blog' },
  { key: 'videos', label: 'Videos', route: '/videos' },
  { key: 'sobre-mi', label: 'Sobre mí', route: '/sobre-mi' },
] as const

export type WindowKey = (typeof WINDOWS)[number]['key']

export const CV_URL = 'https://github.com/SimonCrA/cv_dynamic/raw/main/resume_es.pdf'
