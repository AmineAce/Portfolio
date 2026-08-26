---
title: "Time Awareness"
description: "Agent skill for accurate time awareness — prevents temporal hallucination across LLM agents by grounding every time-dependent answer in real UTC math."
tags: ["Agent Skills", "TypeScript", "LLM"]
year: 2026
featured: false
liveUrl: "https://agentskills.io"
githubUrl: "https://github.com/AmineAce/time-awareness"
order: 3
---

## The Problem

LLMs have no internal clock. They hallucinate dates, guess timezones, and botch duration math — every "today", "3 hours ago", or "next Tuesday" drifts. Agents that schedule, report, or reason about time need a ground truth, not a guess, and the fix has to work across Claude Code, Codex, Kimi, Cursor, and any Agent Skills-compatible platform.

## What I Built

Time Awareness is an Agent Skill that gives any LLM agent accurate, explicit time context. It instructs the agent to fetch the current moment via injected context, platform tool, or shell fallback, perform all duration math in UTC, name timezones with IANA identifiers (never abbreviations), and never guess dates — reporting machine local time first, UTC as reference.

The skill ships as a single `SKILL.md` following the Agent Skills open standard, installable via `npx skills add AmineAce/time-awareness` or manual copy to `~/.claude/skills`, `~/.codex/skills`, etc. It is compatible with 10+ platforms (Claude Code, Kimi, Grok, OpenAI Codex, Copilot, Cursor, Gemini CLI, Windsurf, Roo Code, Empryo). The schema expects `utc_timestamp`, `iso_8601`, `timezone`, `utc_offset`, `day_of_week`, `unix_seconds`, `is_dst`, and the skill is honest when session metadata isn't available.

## What I Learned

Time handling is deceptively hard: abbreviations collide, DST shifts, and locale assumptions break silently. Forcing UTC as the canonical math layer and IANA names as the display layer eliminates a whole class of bugs. The Agent Skills standard proves that a single markdown file can portably patch LLM behavior across vendors — no code, just precise instruction. Building for 10 platforms taught me to keep installation dead simple (`npx skills add`) and to degrade gracefully when platform integration (session start, shell access) is missing.
