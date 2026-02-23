# The Idea Drug — Website v2

Book launch and personal website for **Mark Bjornsgaard**, author of *The Idea Drug: Why Ideas Are Killing Innovation and How to Stop Using Them*.

Published by Lowell & Pearce. Launching June 8th, 2026.

## Tech Stack

- **[Astro 5](https://astro.build)** — static site generator
- **[Style Dictionary 5](https://amzn.github.io/style-dictionary)** — design token pipeline (DTCG format)
- **[Vercel](https://vercel.com)** — hosting and deployment
- **Domain:** markbjornsgaard.com

## Quick Start

```bash
pnpm install
pnpm tokens:build
pnpm dev
```

Site runs at **http://localhost:4322**.

## Scripts

| Script | What it does |
|--------|-------------|
| `pnpm dev` | Start the Astro dev server (port 4322) |
| `pnpm build` | Build tokens + static site to `dist/` |
| `pnpm preview` | Preview the production build locally |
| `pnpm tokens:build` | Regenerate CSS/TS from `project.tokens.json` |

## Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/pages/index.astro` | Home — hero with layered book images, About Mark, Book me to speak (video), System Two |
| `/the-idea-drug` | `src/pages/the-idea-drug.astro` | Book detail — hero, sneak peek video, "Everything you know is wrong" bullets |
| `/system-two` | `src/pages/system-two.astro` | Corporate innovation — press logos, pitch copy |
| `/thinking` | `src/pages/thinking.astro` | Blog listing page |
| `/thinking/[slug]` | `src/pages/thinking/[...slug].astro` | Individual blog post |
| `/contact` | `src/pages/contact.astro` | Contact form with LinkedIn link |

## Project Structure

```
├── project.tokens.json          # Design tokens (DTCG format) — single source of truth
├── sd.config.js                 # Style Dictionary config with WE3 3-tier naming
├── src/
│   ├── components/              # Astro components (Nav, Footer, EmailCapture, etc.)
│   ├── content/
│   │   ├── config.ts            # Content collection schemas
│   │   ├── pages/               # Page content as markdown frontmatter
│   │   └── posts/               # Blog posts (markdown with frontmatter)
│   ├── layouts/Layout.astro     # Base HTML layout (SEO, fonts, Nav, Footer)
│   ├── lib/site.ts              # Site-wide constants (nav, book info, social links)
│   ├── pages/                   # Astro page routes
│   └── styles/
│       ├── global.css           # Token-backed reset, typography, layout utilities
│       └── tokens.generated.css # Auto-generated — do not edit
├── public/images/               # Static images (cover, mark.svg, system-two.svg, etc.)
└── setup.md                     # Setup guide for Mark (non-technical onboarding)
```

## Design Tokens

The design system uses a **3-tier token architecture** (WE3 convention):

1. **Reference** (`--ref-*`) — raw palette values, font stacks, base sizes
2. **System** (`--sys-*`) — semantic decisions (primary colour, body font, spacing scale)
3. **Component** (`--comp-*`) — component-specific overrides (button padding, form borders)

Tokens are defined in `project.tokens.json` and compiled via `pnpm tokens:build` into:
- `src/styles/tokens.generated.css` — CSS custom properties
- `src/tokens/tokens.generated.ts` — TypeScript constants

**Never hardcode colours, spacing, or font values.** Always use token variables with fallbacks: `var(--sys-color-primary, #D42020)`.

## Content Editing

Most site text lives in markdown files at `src/content/pages/`. Edit the frontmatter (between `---` markers) to update page content. Blog posts live in `src/content/posts/`.

Site-wide settings (book title, launch date, nav links, social URLs) are in `src/lib/site.ts`.

## Deployment

Vercel auto-deploys on every push to `main`. Build command:

```
pnpm tokens:build && pnpm build
```

## History

- **v1** — Original site designed by Chad Cribbins ([repo](https://github.com/chadgcribbins/the-idea-drug))
- **v2** (this repo) — Redesigned based on Mark's feedback sketches. Fewer pages, editorial/minimal aesthetic, serif body type (Georgia), centred layouts, filled red CTAs.
