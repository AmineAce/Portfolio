---
title: "img2ascii"
description: "A Rust CLI tool that converts images into ASCII art directly in the terminal — no external dependencies required."
tags: ["Rust", "CLI", "Image Processing"]
year: 2026
featured: false
githubUrl: "https://github.com/AmineAce/img2ascii"
order: 3
---

## The Problem

Terminal interfaces are inherently text-based, making it impossible to preview images without leaving the command line or opening a GUI application. Developers working remotely over SSH, writing documentation, or building terminal-based tools often want a lightweight way to incorporate visual content into their workflows. Existing ASCII art generators either require complex dependencies or produce output that doesn't respect terminal dimensions.

## What I Built

img2ascii is a Rust CLI tool that converts standard image formats into ASCII art rendered directly in the terminal. It maps pixel brightness to a configurable set of ASCII characters, preserving the original image's proportions and aspect ratio based on terminal width. The conversion happens in real time with no external image processing libraries — just Rust's standard capabilities. It supports common input formats and outputs either inline to the terminal or to a text file for embedding elsewhere.

## What I Learned

This project reinforced that Rust is an excellent choice for systems-level tooling where performance and portability matter. Handling image decoding without heavy dependencies taught me to think critically about dependency trees and binary size. The terminal-aware aspect ratio calculation was trickier than expected — most ASCII converters simply stretch the output, but preserving proportions required accounting for the fact that terminal characters are roughly twice as tall as they are wide.
