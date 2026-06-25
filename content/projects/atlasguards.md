---
title: "AtlasGuards"
description: "Full stack SaaS built solo with Next.js, Supabase, and Paddle integration. Shipped in weeks."
tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Paddle", "Redis"]
year: 2025
featured: true
liveUrl: "https://atlasguards.com"
githubUrl: "https://github.com/AmineAce/atlasguards"
order: 1
image: "/projects/atlasguards.webp"
---

## The Problem

Media professionals face a critical challenge: collecting legally-binding guest release agreements efficiently while ensuring authenticity and security. Traditional methods like paper forms or generic digital signatures are cumbersome, error-prone, and offer no way to verify authenticity later. There was no solution tailored specifically for the media industry that combined legal compliance with modern workflow needs.

## What I Built

AtlasGuards is a secure digital release management platform built with Next.js 16, Supabase, and Paddle. The platform enables hosts to create media properties (shows/podcasts), invite guests via magic links, capture legally-binding biometric signatures, generate PDFs, and verify release authenticity through a public verification system.

I architected the complete stack including authentication with Supabase Auth, subscription billing via Paddle (with three tiers: Free, Professional, Agency), email notifications through Resend, and webhook handlers for payment processing. The database uses Row Level Security policies, rate limiting with Upstash Redis, and CSRF protection through Next.js. The signature capture uses a custom biometric signature pad that creates legally-binding digital signatures.

## What I Learned

Building this taught me the complexity of subscription billing systems handling webhooks, managing tiered pricing, and implementing pro-rated upgrades required careful state management. I also learned that security isn't optional: implementing RLS policies on every table, rate limiting signature submissions, and using secure HTTP-only cookies became non-negotiable best practices. The testing strategy (534 tests with Jest and Playwright) ensured the system could handle real-world user flows while maintaining reliability.