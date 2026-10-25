// Map of every public page and its Markdown version (llms.txt profile). The XML sitemap remains the
// sitemap for search engines.
import { getSortedPosts } from '../session/posts'
import { getSortedProjects } from '../session/projects'
import { abs, markdownResponse } from '../session/markdown'

export async function GET() {
  const posts = await getSortedPosts()
  const projects = await getSortedProjects()
  const row = (title: string, html: string, md: string) => `- ${title}: [página](${abs(html)}) · [Markdown](${abs(md)})`
  return markdownResponse(
    '/',
    'Mapa del sitio de Simón Clemente',
    `Cada página del sitio y su versión en Markdown.

## Páginas

${row('Inicio', '/', '/index.md')}
${row('Sobre mí', '/sobre-mi/', '/sobre-mi.md')}
${row('Blog', '/blog/', '/blog.md')}
${row('Proyectos', '/projects/', '/projects.md')}
${row('Videos', '/videos/', '/videos.md')}

## Posts

${posts.map((p) => row(p.data.title, `/blog/${p.slug}/`, `/blog/${p.slug}.md`)).join('\n')}

## Proyectos

${projects.map((p) => row(p.data.title, `/projects/${p.slug}/`, `/projects/${p.slug}.md`)).join('\n')}`,
  )
}
