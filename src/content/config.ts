import { z, defineCollection } from 'astro:content'

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
                items: z.array(z.object({ what: z.string(), value: z.string() })).nonempty(),
            }),
        )
        .nonempty(),
    links: z.array(z.object({ label: z.string(), href: z.string().url() })),
})

const aboutCollection = defineCollection({ type: 'content', schema: aboutSchema })

export const collections = {
    blog: blogCollection,
    about: aboutCollection,
}
