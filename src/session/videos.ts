// Videos come from the channel's public RSS feed. Nobody picks them. The build renders them so
// /videos works without JavaScript, and /api/videos.json serves them fresh on every visit (ADR 0003).
// The E2E build uses fixed fixture Videos so tests never need the network, and a build that cannot
// reach YouTube shows the empty state instead of failing.
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
  thumbnail: string
}

const FIXTURE_VIDEOS: Video[] = [
  { id: 'fixture-video', title: 'Video de prueba (e2e-fixture)', url: 'https://www.youtube.com/watch?v=fixture-video', date: new Date('2001-05-01'), views: 120, short: false, thumbnail: '/posts/post1.webp' },
  { id: 'fixture-short', title: 'Short de prueba (e2e-fixture)', url: 'https://www.youtube.com/shorts/fixture-short', date: new Date('2001-04-01'), views: 7, short: true, thumbnail: '/posts/post2.webp' },
]

const NAMED: Record<string, string> = { lt: '<', gt: '>', quot: '"', apos: "'", amp: '&' }
/** XML entities to text in one pass, so `&amp;lt;` stays `&lt;` instead of becoming `<`. */
export const decode = (s: string) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, name: string) =>
    name[0] === '#'
      ? String.fromCodePoint(name[1].toLowerCase() === 'x' ? parseInt(name.slice(2), 16) : Number(name.slice(1)))
      : (NAMED[name.toLowerCase()] ?? match),
  )
const tag = (xml: string, name: string) => xml.match(new RegExp(`<${name}>([^<]*)</${name}>`))?.[1] ?? ''

/** The feed's entries, newest first. Hashtags are dropped from titles: on the site they are noise. */
export function parseFeed(xml: string): Video[] {
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
    .map(([, entry]) => {
      const url = entry.match(/<link rel="alternate" href="([^"]+)"/)?.[1] ?? ''
      const id = tag(entry, 'yt:videoId')
      return {
        id,
        title: decode(tag(entry, 'title')).replace(/(\s+#[\p{L}\p{N}_]+)+\s*$/u, '').trim(),
        url,
        date: new Date(tag(entry, 'published')),
        views: Number(entry.match(/<media:statistics views="(\d+)"/)?.[1] ?? 0),
        short: url.includes('/shorts/'),
        // 16:9 without the letterbox bars of the feed's hqdefault.
        thumbnail: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
      }
    })
    .filter((v) => v.id && v.url)
    .sort((a, b) => b.date.valueOf() - a.date.valueOf())
}

/** Read the feed now. YouTube's feed fails now and then (404s, stalls), so try three times, each
 * with an 8-second limit, before throwing. */
export async function fetchVideos(attempts = 3): Promise<Video[]> {
  for (let i = 1; ; i++) {
    try {
      const r = await fetch(FEED_URL, { signal: AbortSignal.timeout(8000) })
      if (!r.ok) throw new Error(`YouTube feed: HTTP ${r.status}`)
      return parseFeed(await r.text())
    } catch (error) {
      if (i >= attempts) throw error
      await new Promise((resolve) => setTimeout(resolve, 500 * i))
    }
  }
}

let cache: Promise<Video[]> | undefined
/** The Videos for the build, read once per build. */
export function getVideos(): Promise<Video[]> {
  if (FIXTURES) return Promise.resolve(FIXTURE_VIDEOS)
  cache ??= fetchVideos()
    .catch((error) => {
      console.warn(`[videos] No se pudo leer el feed de YouTube, la ventana queda vacía: ${error}`)
      return []
    })
  return cache
}
