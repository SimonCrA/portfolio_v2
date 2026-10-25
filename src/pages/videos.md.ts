import { getVideos } from '../session/videos'
import { CHANNEL_URL } from '../session/videos'
import { markdownResponse } from '../session/markdown'

export async function GET() {
  const videos = await getVideos()
  const list = videos.length
    ? videos.map((v) => `- [${v.title}](${v.url}) (${v.short ? 'short' : 'video'}, ${v.date.toISOString().slice(0, 10)})`).join('\n')
    : `No se pudieron leer los videos al construir el sitio. Están en el canal: ${CHANNEL_URL}`
  return markdownResponse('/videos/', 'Videos de Simón Clemente', `Los últimos videos del canal de YouTube, al momento de construir el sitio (la página HTML los actualiza en cada visita).\n\n${list}\n\nCanal: ${CHANNEL_URL}`)
}
