import { defineCollection, reference, z } from 'astro:content';

const categoriesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string(),
  }),
});

const toolsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    title: z.string().optional(),
    description: z.string(),
    shortDescription: z.string().optional(),
    category: reference('categories'),
    featured: z.boolean().optional().default(false),
    badge: z.string().optional(),
    howItWorks: z.string().optional(),
    benefits: z.array(z.string()).optional(),
    useCases: z.array(z.string()).optional(),
    faq: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    ).optional(),
    relatedTools: z.array(reference('tools')).optional(),
    keywords: z.array(z.string()).optional(),
    relatedArticles: z.array(reference('blog')).optional(),
  }),
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string().or(z.date()),
    author: z.string(),
    tags: z.array(z.string()).optional().default([]),
    relatedTools: z.array(reference('tools')).optional().default([]),
  }),
});

export const collections = {
  categories: categoriesCollection,
  tools: toolsCollection,
  blog: blogCollection,
};
