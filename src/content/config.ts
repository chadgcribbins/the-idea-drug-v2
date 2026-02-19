import { defineCollection, z } from "astro:content";

const pages = defineCollection({
  type: "content",
  schema: z
    .object({
      title: z.string(),
      description: z.string().optional(),
      ogImage: z.string().optional(),
    })
    .passthrough(),
});

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    readTime: z.string().optional(),
    image: z.string().optional(),
    published: z.boolean().default(true),
  }),
});

export const collections = {
  pages,
  posts,
};
