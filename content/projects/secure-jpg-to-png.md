---
title: "Secure JPG to PNG"
description: "A 100% client-side privacy-first file converter supporting JPG, PNG, WebP, SVG, HEIC, and PDF — all processed entirely in the browser."
tags: ["React", "TypeScript", "Vite", "Tailwind CSS", "Web Workers", "Zustand"]
year: 2024
featured: false
liveUrl: "https://secure-converter-s.vercel.app"
githubUrl: "https://github.com/AmineAce/privacy-converter"
order: 6
image: "/projects/secure-jpg-to-png.webp"
---

## The Problem

Online file converters routinely upload user files to remote servers, inject ads and tracking scripts into pages, and restrict essential features behind expensive subscriptions. Users who need private file conversion — sensitive documents, personal photos, confidential media — have no viable option that works entirely on-device without compromising features or performance.

## What I Built

Secure JPG to PNG is a 100% client-side file conversion tool that processes files entirely in the browser. Files never leave the user's device. I built it with React 19 and Vite 6, using Web Workers to keep the UI responsive during CPU-intensive operations. The tool supports six formats — JPG, PNG, WebP, SVG, HEIC (iPhone photos), and PDF — with a generous 50MB file limit and unlimited batch processing. A real-time progress bar gives users clear visibility into conversion status. The architecture uses a configurable worker pool processing up to 5 files simultaneously, with transferable objects to prevent memory bloat during batch operations. Heavy dependencies like HEIC decoding and PDF generation are lazy-loaded to maintain fast initial page loads. State management uses Zustand with atomic selectors for optimal re-render performance. The application achieves a perfect Lighthouse score across all five categories.

## What I Learned

A perfect Lighthouse score is achievable alongside heavy client-side file processing if you design for performance from the start. The key patterns I validated: lazy-loading every non-critical library, using transferable objects instead of structured cloning for Web Worker communication, and running aggressive memory cleanup after each batch operation. True privacy doesn't require sacrificing UX — Web Workers keep the main thread responsive while processing gigabytes of image data entirely in the browser without any server upload.