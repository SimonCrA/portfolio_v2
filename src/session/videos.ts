// Videos come from the channel's public RSS feed at build time (ADR 0001: the daily rebuild keeps
// them fresh). Nobody picks them. The E2E build uses fixed fixture Videos so tests never need the
// network, and a build that cannot reach YouTube shows the empty state instead of failing.
import { FIXTURES } from './fixtures'

export const CHANNEL_URL = 'https://www.youtube.com/channel/UCtTPHC06STvf4fDktedxxMA'
const FEED_URL = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCtTPHC06STvf4fDktedxxMA'

export interface Video {
  id: string
  title: string
  url: string
  date: Date
  views: number
  short: boolean
}

const FIXTURE_VIDEOS: Video[] = [
  { id: 'fixture-video', title: 'Video de prueba (e2e-fixture)', url: 'https://www.youtube.com/watch?v=fixture-video', date: new Date('2001-05-01'), views: 120, short: false },
  { id: 'fixture-short', title: 'Short de prueba (e2e-fixture)', url: 'https://www.youtube.com/shorts/fixture-short', date: new Date('2001-04-01'), views: 7, short: true },
]

const decode = (s: string) =>
  s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
const tag = (xml: string, name: string) => xml.match(new RegExp(`<${name}>([^<]*)</${name}>`))?.[1] ?? ''

/** The feed's entries, newest first. Hashtags are dropped from titles: on the site they are noise. */
export function parseFeed(xml: string): Video[] {
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
    .map(([, entry]) => {
      const url = entry.match(/<link rel="alternate" href="([^"]+)"/)?.[1] ?? ''
      return {
        id: tag(entry, 'yt:videoId'),
        title: decode(tag(entry, 'title')).replace(/(\s+#[\p{L}\p{N}_]+)+\s*$/u, '').trim(),
        url,
        date: new Date(tag(entry, 'published')),
        views: Number(entry.match(/<media:statistics views="(\d+)"/)?.[1] ?? 0),
        short: url.includes('/shorts/'),
      }
    })
    .filter((v) => v.id && v.url)
    .sort((a, b) => b.date.valueOf() - a.date.valueOf())
}

let cache: Promise<Video[]> | undefined
export function getVideos(): Promise<Video[]> {
  if (FIXTURES) return Promise.resolve(FIXTURE_VIDEOS)
  cache ??= fetch(FEED_URL)
    .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`YouTube feed: HTTP ${r.status}`))))
    .then(parseFeed)
    .catch((error) => {
      console.warn(`[videos] No se pudo leer el feed de YouTube, la ventana queda vacía: ${error}`)
      return []
    })
  return cache
}
