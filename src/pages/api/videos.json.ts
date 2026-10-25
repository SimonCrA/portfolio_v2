// The Videos, fresh from YouTube on each request (ADR 0003). The browser cannot read YouTube's feed
// itself (no CORS), so /videos asks here after it loads. Vercel's CDN keeps each answer for five
// minutes, so visits do not hit YouTube one by one.
import { fetchVideos } from '../../session/videos'

export const prerender = false

export async function GET({ url }: { url: URL }) {
  // The CDN caches per URL; any query string would be a fresh call to YouTube, so send it to the one URL.
  if (url.search) return Response.redirect(new URL(url.pathname, url), 308)
  try {
    return new Response(JSON.stringify(await fetchVideos()), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600',
      },
    })
  } catch (error) {
    console.error('[api/videos] YouTube feed failed:', error)
    return new Response(JSON.stringify({ error: 'No se pudo leer el feed de YouTube.' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    })
  }
}
