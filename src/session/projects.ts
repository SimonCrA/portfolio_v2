import { getCollection } from 'astro:content'
import { withFixtures } from './fixtures'
import { assertNoPlaceholder } from './placeholder'

// Every list of Projects uses this order: Featured first, then newest, same-day Projects in a stable order.
export async function getSortedProjects() {
  const projects = await withFixtures(await getCollection('projects'), () => getCollection('projectsFixtures'))
  // The placeholder guard's own test adds a stub Project (see tests/e2e/placeholder.spec.ts).
  if (process.env.E2E_PLACEHOLDER === 'project') projects.push(...((await getCollection('placeholderFixtures')) as unknown as typeof projects))
  for (const p of projects) assertNoPlaceholder(`src/content/${p.collection}/${p.id}`, p.data, p.body)
  return projects.sort(
    (a, b) =>
      Number(b.data.featured) - Number(a.data.featured) || b.data.date.valueOf() - a.data.date.valueOf() || b.id.localeCompare(a.id),
  )
}
