import { getCollection } from 'astro:content'
import { withFixtures } from './fixtures'

// Every list of Projects uses this order: Featured first, then newest, same-day Projects in a stable order.
export async function getSortedProjects() {
  const projects = await withFixtures(await getCollection('projects'), () => getCollection('projectsFixtures'))
  return projects.sort(
    (a, b) =>
      Number(b.data.featured) - Number(a.data.featured) || b.data.date.valueOf() - a.data.date.valueOf() || b.id.localeCompare(a.id),
  )
}
