import { getAbout } from '../session/getAbout'
import { getSortedPosts } from '../session/posts'
import { getSortedProjects } from '../session/projects'
import { abs, markdownResponse, postLine, projectLine } from '../session/markdown'

export async function GET() {
  const about = (await getAbout()).data
  const posts = await getSortedPosts()
  const projects = await getSortedProjects()
  return markdownResponse(
    '/',
    `${about.name}: ingeniero de software fullstack`,
    `${about.intro}

## Ahora

${about.now}

## Proyectos

${projects.map(projectLine).join('\n')}

## Posts recientes

${posts.slice(0, 5).map(postLine).join('\n')}

## Más

- [Sobre mí](${abs('/sobre-mi.md')}): historia, en qué estoy y con qué trabajo.
- [Videos](${abs('/videos.md')}): los últimos videos del canal de YouTube.
- [Mapa del sitio](${abs('/sitemap.md')}): todas las páginas y su versión en Markdown.`,
    about.nowUpdated,
  )
}
