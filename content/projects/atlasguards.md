---
title: "AtlasGuards"
description: "A secure digital release management platform for media professionals — built with Next.js 16, Supabase, Paddle, and Redis."
tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Paddle", "Redis"]
year: 2025
featured: true
liveUrl: "https://atlasguards.com"
githubUrl: "https://github.com/AmineAce/atlasguards"
order: 1
image: "/projects/atlasguards.webp"
---

## The Problem

Media professionals need a way to collect legally-binding guest release agreements that is both efficient and secure. Traditional methods — paper forms, generic digital signature tools, email chains — are slow, error-prone, and offer no way to verify authenticity after the fact. No existing solution is tailored specifically for the media industry, leaving showrunners, podcast hosts, and production crews to cobble together workflows from disconnected tools.

## What I Built

AtlasGuards is a secure digital release management platform for media professionals. I architected and shipped the full stack solo — using Next.js 16, Supabase, Paddle, and Redis — in weeks. The platform lets hosts create media properties (shows and podcasts), invite guests via magic link, capture legally-binding biometric signatures, generate PDFs on demand, and verify releases through a public authenticity API. The subscription system supports three tiers (Free, Professional, Agency) with pro-rated upgrades and webhook-driven payment processing. Security is enforced at every layer: Row Level Security policies on every database table, rate limiting via Upstash Redis, CSRF protection, and HTTP-only cookies. The codebase includes 534 automated tests across Jest unit tests and Playwright end-to-end tests covering all critical user flows.

## What I Learned

Implementing subscription billing with tiered pricing, pro-rated upgrades, and real-time webhook handling taught me that payment state management is one of the hardest problems in full-stack development. Security must be architected from day one, not bolted on later: every database query needs RLS enforcement, every mutation needs rate limiting, every cookie needs secure flags. The testing strategy proved that 534 tests aren't overhead — they're the difference between shipping confidently and shipping nervously.