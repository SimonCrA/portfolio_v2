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

export const collections = {
    blog: blogCollection,
}
