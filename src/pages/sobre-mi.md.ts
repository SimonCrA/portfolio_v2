import { getAbout } from '../session/getAbout'
import { markdownResponse } from '../session/markdown'

export async function GET() {
  const entry = await getAbout()
  const about = entry.data
  const uses = about.uses.map((g) => `### ${g.group}\n\n${g.items.map((u) => `- ${u.what}: ${u.value}`).join('\n')}`).join('\n\n')
  return markdownResponse(
    '/sobre-mi/',
    `Sobre mí: ${about.name}`,
    `${about.intro}

## Historia

${entry.body.trim()}

## Ahora

${about.now} (actualizado el ${about.nowUpdated.toISOString().slice(0, 10)})

## Con qué trabajo

${uses}

## Dónde encontrarme

${about.links.map((l) => `- [${l.label}](${l.href})`).join('\n')}`,
    about.nowUpdated,
  )
}
