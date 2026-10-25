import { navigate } from 'astro:transitions/client'

/** Go to a route through the client router, unless already there. */
export function go(route: string) {
  if (location.pathname === route) return
  navigate(route)
}
