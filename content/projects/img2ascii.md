---
title: "img2ascii"
description: "A Rust CLI tool that converts images into ASCII art in the terminal — with URL fetching, true-color output, and parallel processing."
tags: ["Rust", "CLI", "Image Processing", "Parallel Processing"]
year: 2026
featured: false
githubUrl: "https://github.com/AmineAce/img2ascii"
order: 3
---

## The Problem

Terminal interfaces are inherently text-based, making it impossible to preview images without leaving the command line or opening a GUI application. Developers working remotely over SSH, writing documentation, or building terminal-based tools often want a lightweight way to incorporate visual content into their workflows. Existing ASCII art generators either require complex dependencies or produce output that doesn't respect terminal dimensions.

## What I Built

img2ascii is a Rust CLI tool that converts images into ASCII art rendered directly in the terminal. It maps pixel brightness to a configurable set of ASCII characters, preserving the original image's proportions and aspect ratio based on terminal width.

The tool supports JPEG, PNG, WebP, GIF, BMP, and TIFF inputs — either from a local file or fetched from a URL with Content-Type validation to reject non-image responses. Output can be grayscale or true-color ANSI, written to stdout or saved to a file. The character ramp is fully customizable, and the output width is configurable up to 5000 characters.

The project is structured as a Cargo workspace with two members: `img2ascii` (the CLI binary) and `img2ascii-core` (a reusable library crate). The core conversion is a single documented function — `img2ascii_core::convert()` — so other Rust projects can use it as a dependency. Row processing is parallelized with `rayon` for performance. The CLI uses `clap` for argument parsing, `ureq` for fetching images from URLs with Content-Type validation, and the `image` crate for decoding JPEG, PNG, WebP, GIF, BMP, and TIFF formats.

## What I Learned

This project reinforced that Rust is an excellent choice for systems-level tooling where performance and portability matter. Separating the conversion logic into a reusable library crate (`img2ascii-core`) proved valuable — it keeps the CLI thin and lets other projects depend on the core conversion function without pulling in CLI dependencies. Parallelizing row processing with `rayon` was straightforward and gave meaningful speedups on larger images. The terminal-aware aspect ratio calculation was trickier than expected — most ASCII converters simply stretch the output, but preserving proportions required accounting for the fact that terminal characters are roughly twice as tall as they are wide. URL fetching with Content-Type validation was a good exercise in defensive I/O: rejecting non-image responses early prevents confusing error messages downstream.
