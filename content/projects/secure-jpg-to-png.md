---
title: "Secure JPG to PNG"
description: "A privacy-first, client-side file conversion tool your files never leave your device."
tags: ["React", "TypeScript", "Vite", "Tailwind CSS", "Web Workers", "Zustand"]
year: 2024
featured: false
liveUrl: "https://secure-jpg-to-png.pages.dev"
githubUrl: "https://github.com/AmineAce/privacy-converter"
order: 2
image: "/projects/secure-jpg-to-png.webp"
---

## The Problem

Most online file converters are privacy nightmares they upload your files to remote servers, stuff pages with ads and trackers, and offer limited functionality behind paywalls. Users who care about privacy had no viable alternative that worked entirely in their browser without sacrificing features or performance.

## What I Built

I built a 100% client-side file converter using React, Vite, and Web Workers. The tool converts between JPG, PNG, WebP, SVG, and HEIC (iPhone photos) entirely in the browser files never leave the user's device. It also handles PDF creation: converting images to PDF and merging multiple images into a single document.

The architecture uses a worker pool that processes up to 5 files simultaneously, with explicit memory management to prevent RAM bloat during batch operations. Heavy modules like HEIC and PDF support are lazy-loaded to maintain fast initial load times. Zustand manages state with atomic selectors for optimal re-render performance.

## What I Learned

Achieving a perfect Lighthouse score while processing large files client-side required careful optimization lazy loading heavy libraries, using transferable objects in Web Workers, and implementing aggressive memory cleanup. I learned that true privacy is achievable without sacrificing UX, and that Web Workers are essential for keeping the UI responsive during CPU-intensive operations. The key insight was that progress tracking and concurrent processing can coexist without compromising performance.