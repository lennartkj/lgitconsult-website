# CLAUDE.md — LGIT Consult Website

## Project Overview

Website for **LGIT Consult** — a Leipzig-based creative consulting agency operating at the intersection of technology and art.

### What LGIT Consult Does

**Two pillars:**

1. **IT Consulting & Web Development** — technical services (web dev, mobile dev, UI/UX design, IT consulting)
2. **Creative Consulting** — for artists, advertisers, and brands, specializing in photography and physical media

**Creative side:** LGIT works with artists and brands in joint ventures — designing campaigns, social media content, music, music videos — drawing from a pool of bonafide Leipzig creatives. The agency bridges the gap between creative vision and execution.

**Target clients:** Artists, brands, advertisers, and businesses who need both technical and creative expertise.

### Tone & Voice

The website should feel like a creative agency with technical chops, not a corporate IT firm. Think: bold, visual, culture-aware, Leipzig-rooted. The glitch effects and design language reflect this — digital but with analog/physical sensibility.

## Tech Stack

- **Framework**: Next.js 15 (App Router) with React 19, TypeScript 5
- **Styling**: Tailwind CSS v4 + custom CSS variables (globals.css)
- **Animations**: Framer Motion + custom Glitch Core canvas system
- **Content**: MDX files with YAML frontmatter, managed via Decap CMS
- **Build**: Turbopack (dev & production), standalone output
- **Fonts**: Geist Sans & Geist Mono

## Commands

```bash
npm run dev      # Dev server (Turbopack)
npm run build    # Production build (Turbopack)
npm run start    # Start production server
npm run lint     # ESLint
```

## Project Structure

```
src/
  app/              # Next.js App Router pages
    api/            # API routes (content, contact, search, preview)
    (marketing)/    # Route group
    [slug] routes   # Dynamic pages for journal/, work/
  components/       # React components (organized by feature)
    glitch/         # Glitch effect system (GlitchCoreProvider, GlitchCoreCanvas)
    navigation/     # Navbar, Footer
    ui/             # Reusable: Button, Card, Link, Placeholder
    motion/         # Animation wrappers
    home/, work/, journal/, services/, about/, forms/, search/, mdx/, preview/
  lib/
    content.ts      # MDX file reading & parsing
    data/           # Data access layer (projects, posts, services, pricing, process)
content/            # MDX content files
  projects/, posts/, services/, pricing/, process/
public/
  admin/            # Decap CMS (config.yml)
  images/uploads/   # CMS media
```

## Conventions

- **Components**: PascalCase filenames (`HomeContent.tsx`)
- **Directories**: kebab-case
- **Client components**: Explicit `"use client"` directive; server components are the default
- **Data fetching**: Server Components call async functions from `src/lib/data/`; no client-side fetching for content
- **Styling**: Tailwind utility classes only — no component CSS files. Custom tokens via CSS variables in `globals.css`
- **Animations**: Framer Motion `Variants` objects for reusable motion patterns
- **Content types**: `'projects' | 'posts' | 'services' | 'pricing' | 'process'`
- **ISR**: Pages use `export const revalidate = 60`

## Content Model (MDX Frontmatter)

All content lives in `content/` as `.mdx` files with YAML frontmatter. Types defined in `src/lib/data/types.ts`. Validated and parsed by functions in `src/lib/data/`.

## Theming

CSS variables define the design system (colors, spacing on a 4pt scale, border radii, motion tokens). Dark mode via `prefers-color-scheme` media query. Accent color: `--accent` (blue).

## Key Patterns

- Unified content API: `/api/content?type=<type>&slug=<slug>`
- Preview mode: `/api/preview?secret=<PREVIEW_SECRET>&redirect=<path>`
- Search: `/api/search` endpoint, SearchDialog component
- Glitch Core: Context provider + Canvas renderer, triggered by mouse/touch interaction
- Suspense boundaries wrap async server components

## Environment Variables

- `PREVIEW_SECRET` — Preview mode auth
- `NEXT_PUBLIC_SITE_URL` — Public site URL

## Branches

- `main` — production
- `preprod` — staging / active development
