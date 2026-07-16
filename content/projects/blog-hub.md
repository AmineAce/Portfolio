---
title: "CompareClash"
description: "A performance-optimized blog with Incremental Static Regeneration (ISR), built with Next.js 15, Contentful CMS, and enterprise-grade optimizations."
tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Contentful", "Netlify", "ISR"]
year: 2025
featured: false
image: "/projects/blog-hub.webp"
liveUrl: "https://compareclash.netlify.app/"
githubUrl: "https://github.com/AmineAce/blog-hub"
order: 4
---

## The Problem

Static sites with traditional CMS workflows require a full rebuild for every content change. Publishing a single blog post means waiting through a complete build cycle, even if nothing else changed. Content teams need a way to push updates instantly without redeploying the entire site, while keeping the performance benefits of static generation.

## What I Built

CompareClash is a Next.js 15 blog using the App Router with Incremental Static Regeneration (ISR), Contentful as a headless CMS, and shadcn/ui for the component layer. Content updates flow through Contentful webhooks that trigger ISR revalidation — new posts go live in 2-3 minutes without a full rebuild. The search index is statically generated at build time and refreshed on each revalidation. The page uses a secondary ISR endpoint for preview mode, allowing draft content to be reviewed before publishing. The site scores 95+ Performance, 98+ Accessibility, and 100 SEO on Lighthouse with a 102KB shared JS bundle. It's deployed on Netlify with webhook-driven automatic rebuilds for content model changes.

## What I Learned

ISR is a powerful middle ground between SSG and SSR — you get static performance with dynamic freshness. The webhook-to-revalidation pipeline requires careful secret management and error handling to prevent infinite revalidation loops. Contentful's rich text renderer with custom component mappings is flexible but demands strict type contracts between the CMS content model and React components. I also learned that shadcn/ui's Radix-based primitives compose well with a CMS-driven design system when the component variants are modeled upfront rather than ad-hoc.
