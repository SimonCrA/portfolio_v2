// Latest feed (spec #7, #10): a pure aggregation over sources. Adding Videos or Projects later
// means writing a source and adding it to the list passed in; the home page does not change.

import type { IconName } from './icons'

export type FeedKind = 'post' | 'video' | 'project'

export interface FeedItem {
  kind: FeedKind
  title: string
  summary: string
  date: Date
  href: string
  /** Overrides the kind's icon, e.g. a software Project. */
  icon?: IconName
}

export type FeedSource = () => FeedItem[] | Promise<FeedItem[]>

export const KIND_LABEL: Record<FeedKind, string> = { post: 'post', video: 'video', project: 'proyecto' }

/** Merge every source, newest first. Ties keep source order (stable sort). */
export async function buildFeed(sources: FeedSource[]): Promise<FeedItem[]> {
  const lists = await Promise.all(sources.map((s) => s()))
  return lists.flat().sort((a, b) => b.date.valueOf() - a.date.valueOf())
}
