import { getSortedProjects } from '../session/projects'
import { markdownResponse, projectLine } from '../session/markdown'

export async function GET() {
  const projects = await getSortedProjects()
  return markdownResponse('/projects/', 'Proyectos de Simón Clemente', `Destacados primero, luego los más nuevos.\n\n${projects.map(projectLine).join('\n')}`)
}
