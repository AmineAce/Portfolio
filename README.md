# Portfolio 2026

Personal portfolio for Amine — frontend developer based in Casablanca, building precise, performant interfaces.

Built with [Astro](https://astro.build), [Tailwind CSS v4](https://tailwindcss.com), and deployed on [Vercel](https://vercel.com).

## Tech Stack

- **Framework**: Astro 7 + TypeScript 6
- **Styling**: Tailwind CSS v4 + @tailwindcss/typography
- **Fonts**: Geist Sans, Geist Mono, Instrument Serif (via Fontsource + Astro Font API)
- **Icons**: Tabler Icons (via astro-icon)
- **Content**: Markdown with Astro Content Collections
- **Contact**: Resend API (serverless function at `/api/contact`)
- **Analytics**: Vercel Analytics + Speed Insights
- **Deploy**: Vercel (static + serverless function)

## Project Structure

```
src/
├── components/     # UI components (Hero, About, Contact, Navbar, etc.)
├── layouts/        # Base layout (SEO, fonts, scroll bar, starfield)
├── pages/          # Routes (index, 404, work/[slug])
├── styles/         # Global CSS (Tailwind + custom animations)
├── utils/          # Client utilities (toast)
└── content.config.ts
content/projects/   # Markdown case studies
api/contact.js      # Contact form serverless function
public/             # Static assets
```

## Commands

| Command                   | Action                               |
| :------------------------ | :----------------------------------- |
| `npm install`             | Install dependencies                 |
| `npm run dev`             | Start dev server at `localhost:4321` |
| `npm run build`           | Build production site to `./dist/`   |
| `npm run preview`         | Preview production build locally     |
| `npm run check`           | Run TypeScript checks                |
| `npm run scan:islands`    | Generate island manifest for overlay |
| `npx astro --help`        | Astro CLI help                       |
