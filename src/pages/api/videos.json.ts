// The Videos, fresh from YouTube on each request (ADR 0003). The browser cannot read YouTube's feed
// itself (no CORS), so /videos asks here after it loads. Vercel's CDN keeps each answer for five
// minutes, so visits do not hit YouTube one by one.
import { fetchVideos } from '../../session/videos'

export const prerender = false

export async function GET() {
  try {
    return new Response(JSON.stringify(await fetchVideos()), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600',
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), { status: 502, headers: { 'Content-Type': 'application/json' } })
  }
}
