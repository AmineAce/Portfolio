---
title: "AI Primitives UI"
description: "A dependency-free library of monochrome UI primitives for AI-native interfaces — 18 Canvas 2D orbs, zero runtime deps, monochrome by design."
tags: ["TypeScript", "React", "Canvas 2D", "Next.js", "Tailwind CSS"]
year: 2026
featured: true
liveUrl: "https://ai-primitives-ui.vercel.app"
githubUrl: "https://github.com/AmineAce/ai-primitives-ui"
order: 1
image: "/projects/ai-primitives-ui.webp"
---

## The Problem

AI interfaces need distinct loading, thinking, and streaming states — cloning, syncing, fetching, rebasing — but most UI kits repurpose generic spinners. They rely on WebGL, SVG filters, or heavy runtime dependencies, break in monochrome contexts, and ignore accessibility. Teams building AI-native products need a cohesive, lightweight primitive set that feels intentional, not bolted on.

## What I Built

AI Primitives UI is a dependency-free library of monochrome UI primitives drawn in plain HTML5 Canvas 2D. It ships 18 ready primitives across Loading State (CloningOrb, SyncOrb, FetchingOrb, PullingOrb, PushingOrb, MergingOrb, RebasingOrb, StashingOrb), Thinking (CubeOrb, ScanOrb), and Streaming & Cards (StreamingText, ApprovalCard, ToolChips, TaskRows, Chat, RecommendationCard, ContextCards, DiffTable) — zero WebGL, no SVG filters, no `ctx.filter`, no blur.

The package is `@ai-primitives-ui/ui` with zero runtime dependencies — peer deps are React 18/19 only — fully typed, gated by `publint` and `attw`. Every orb accepts `size` (`orbSizes`: xs 16, sm 24, md 32, lg 48, xl 64, 2xl 96), `speed`, `paused`, `color`, and `aria-label`. The design is monochrome by design using GitHub Primer grayscale, themeable via system `matchMedia` (inline script before hydration, no FOUC), global `--orb-fg` CSS variable, or per-instance `color` prop. Accessibility is first-class: `aria-label` support and `prefers-reduced-motion` renders a static frame.

The docs site (Next.js 14, Tailwind CSS 3) groups primitives, playground, theming, and API tables at `ai-primitives-ui.vercel.app/docs`, with a live playground at `/#playground` to test every orb's `size/speed/paused` interactively.

## What I Learned

Canvas 2D is more than enough for rich motion when you avoid filters and lean on geometry — layer-by-layer spirals, supernova flashes, and junction merges can be expressed with simple arcs and lines. Designing in strict monochrome forces clarity: without color to hide behind, timing, easing, and spatial composition carry the meaning. Zero-dependency publishing is a discipline — `publint`/`attw` gates and peer-only React keep the barrier to adoption near zero, and the `size/speed/paused/color` prop surface stays predictable across 18 primitives. The theming stack (system → global CSS variable → per-instance) proved that three layers cover every use case without context providers or JS theming runtimes.
