// Static search index (built with the site, ADR 0001): the searchable text of every Post and Project.
import { getSortedPosts } from '../session/posts'
import { getSortedProjects } from '../session/projects'
import { postSearchText, projectSearchText } from '../session/search-index'

export async function GET() {
  const blog = (await getSortedPosts()).map(postSearchText)
  const projects = (await getSortedProjects()).map(projectSearchText)
  return new Response(JSON.stringify({ blog, projects }), { headers: { 'Content-Type': 'application/json' } })
}
