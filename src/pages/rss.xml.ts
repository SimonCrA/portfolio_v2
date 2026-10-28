// /rss.xml: the feed of Posts, for feed readers. Built with the site, newest first.
import { AUTHOR } from '../config'
import { getSortedPosts } from '../session/posts'
import { abs } from '../session/markdown'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export async function GET() {
  const posts = await getSortedPosts()
  const items = posts
    .map((post) => {
      const url = abs(`/blog/${post.slug}/`)
      return `    <item>
      <title>${esc(post.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${post.data.publishDate.toUTCString()}</pubDate>
      <description>${esc(post.data.description)}</description>
${post.data.tags.map((t) => `      <category>${esc(t)}</category>`).join('\n')}
    </item>`
    })
    .join('\n')
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog de ${esc(AUTHOR)}</title>
    <link>${abs('/blog/')}</link>
    <atom:link href="${abs('/rss.xml')}" rel="self" type="application/rss+xml" />
    <description>Posts de ${esc(AUTHOR)} sobre programación y las herramientas que usa.</description>
    <language>es</language>
${posts[0] ? `    <lastBuildDate>${posts[0].data.publishDate.toUTCString()}</lastBuildDate>\n` : ''}${items}
  </channel>
</rss>
`
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
