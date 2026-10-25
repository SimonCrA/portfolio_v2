// /llms.txt: a guide for language models to the site's Markdown pages. It is built from the same
// content as the site, so it stays current with every deploy. It is not a crawler rule.
import { getAbout } from '../session/getAbout'
import { getSortedPosts } from '../session/posts'
import { getSortedProjects } from '../session/projects'
import { abs } from '../session/markdown'

export async function GET() {
  const about = (await getAbout()).data
  const posts = await getSortedPosts()
  const projects = await getSortedProjects()
  const body = `# Simonctech

> Sitio personal de ${about.name}, ingeniero de software fullstack en Venezuela: sus proyectos, posts sobre programación y videos.

El sitio está en español. Cada página tiene una versión en Markdown con el mismo contenido.

If you are an LLM looking for site information, use the content map to locate the relevant topic and its linked Markdown answer.
Use that document's cited sources and canonical page; if the requested information is absent, report that gap.

## Primary resources

- [Mapa del sitio](${abs('/sitemap.md')}): todas las páginas con su versión en Markdown.
- [Sobre mí](${abs('/sobre-mi.md')}): quién es ${about.name}, su historia, en qué está ahora y con qué trabaja.
- [Proyectos](${abs('/projects.md')}): ${projects.map((p) => p.data.title).join(', ')}.
- [Blog](${abs('/blog.md')}): ${posts.length} posts sobre programación.

## Optional

- [Videos](${abs('/videos.md')}): los últimos videos del canal de YouTube, en el momento del último build.
- [Inicio](${abs('/index.md')}): resumen del sitio con lo más reciente.
`
  return new Response(body)
}
