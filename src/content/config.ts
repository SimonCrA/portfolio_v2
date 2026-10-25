import { z, defineCollection } from 'astro:content'
import { ICONS, type IconName } from '../session/icons'

const blogSchema = z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
    publishDate: z.coerce.date(),
})

export type BlogSchema = z.infer<typeof blogSchema>

const blogCollection = defineCollection({ type: 'content', schema: blogSchema })

// Sobre mí: a single Markdown entry (src/content/about/sobre-mi.md) feeding /sobre-mi, the home
// page's whoami and Now, and the navigator preview. The body is Simón's story.
const aboutSchema = z.object({
    name: z.string(),
    intro: z.string(),
    now: z.string(),
    nowUpdated: z.date(),
    uses: z
        .array(
            z.object({
                group: z.string(),
                icon: z.enum(Object.keys(ICONS) as [IconName, ...IconName[]]),
                items: z.array(z.object({ what: z.string(), value: z.string() })).nonempty(),
            }),
        )
        .nonempty(),
    links: z.array(z.object({ label: z.string(), href: z.string().url() })),
})

const aboutCollection = defineCollection({ type: 'content', schema: aboutSchema })

// Projects (spec #20): one Markdown entry per Project; the body is the write-up. Files starting with
// `_` (the template) are not part of the collection.
const projectSchema = z.object({
    title: z.string(),
    summary: z.string().refine((s) => !s.includes('\n'), 'summary must be a single line'),
    kind: z.enum(['software', 'hardware']),
    status: z.enum(['activo', 'terminado', 'archivado']),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()),
    stack: z.array(z.string()).nonempty(),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    image: z.string().optional(),
    featured: z.boolean().default(false),
})

export type ProjectSchema = z.infer<typeof projectSchema>

export const collections = {
    blog: blogCollection,
    // Fixture Posts for the E2E build only (see src/session/fixtures.ts).
    blogFixtures: defineCollection({ type: 'content', schema: blogSchema }),
    projects: defineCollection({ type: 'content', schema: projectSchema }),
    projectsFixtures: defineCollection({ type: 'content', schema: projectSchema }),
    // Placeholder content that only the guard's own test loads (E2E_PLACEHOLDER).
    placeholderFixtures: defineCollection({ type: 'content', schema: projectSchema }),
    aboutFixtures: defineCollection({ type: 'content', schema: aboutSchema }),
    about: aboutCollection,
}
