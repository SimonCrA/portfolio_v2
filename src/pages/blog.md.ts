import { getSortedPosts } from '../session/posts'
import { markdownResponse, postLine } from '../session/markdown'

export async function GET() {
  const posts = await getSortedPosts()
  return markdownResponse('/blog/', 'Blog de Simón Clemente', `Posts sobre programación, más nuevos primero.\n\n${posts.map(postLine).join('\n')}`, posts[0]?.data.publishDate)
}
