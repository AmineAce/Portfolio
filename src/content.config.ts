import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    year: z.number().optional(),
    featured: z.boolean().default(false),
    liveUrl: z.string().optional(),
    githubUrl: z.string().optional(),
    order: z.number().optional(),
    coverColor: z.string().optional(),
  }),
});

export const collections = { projects };