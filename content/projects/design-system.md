---
title: "Design System for FinTech"
description: "A comprehensive, accessible component library and token system for a banking platform, used by 20+ engineers across 4 teams."
tags: ["TypeScript", "React", "Storybook", "Tailwind CSS", "Accessibility"]
year: 2024
featured: true
liveUrl: "https://design-system.example.com"
githubUrl: "https://github.com/example/design-system"
order: 1
coverColor: "accent"
---

## The Problem

Our product team was shipping UI inconsistencies across multiple client portals. Engineers duplicated component logic, design tokens were scattered, and accessibility audits revealed repeated failures. We needed a single source of truth that could scale with our growing organization.

## What I Built

I architected a monorepo-style design system using React, TypeScript, and Tailwind CSS. The system includes 40+ primitives (buttons, modals, data tables) with full keyboard navigation and ARIA compliance. I set up Storybook with automated visual regression testing and integrated it into our CI pipeline. The token architecture defines colors, spacing, and typography as CSS custom properties, enabling runtime theming for white-label clients.

## What I Learned

Leading adoption required more than code — I wrote extensive documentation, hosted office hours, and created a contribution guide that lowered the barrier for cross-team contributions. The biggest win was establishing a shared language between design and engineering; our handoff process shrank from days to hours. I also learned that accessibility isn't a checklist but a mindset; every component now undergoes screen reader testing before merge.