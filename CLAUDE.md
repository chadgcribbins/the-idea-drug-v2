# CLAUDE.md

Instructions for Claude Code when working on this project.

## Build / Dev / Test

```bash
pnpm install              # Install dependencies
pnpm tokens:build         # Compile design tokens (must run before build/dev)
pnpm dev                  # Dev server on http://localhost:4322
pnpm build                # Full production build (tokens + Astro)
```

**Important:** Always run `pnpm tokens:build` after changing `project.tokens.json`. The build script does this automatically, but the dev server does not.

## Project Overview

Static Astro 5 site for Mark Bjornsgaard's book *The Idea Drug*. 5 page routes + 3 blog posts. Minimal, editorial design with token-driven styling.

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full details. Key points:

### Design Token Pipeline

- **Source of truth:** `project.tokens.json` (DTCG v2025.10 format)
- **Compiler:** Style Dictionary 5 via `sd.config.js`
- **Output:** `src/styles/tokens.generated.css` + `src/tokens/tokens.generated.ts`
- **DO NOT edit generated files** — they are in `.gitignore`

### WE3 3-Tier Naming

Tokens use a 3-tier architecture compiled into CSS custom properties:

| Tier | Prefix | Example | Purpose |
|------|--------|---------|---------|
| Reference | `--ref-` | `--ref-brand-primary` | Raw values (palette, font stacks) |
| System | `--sys-` | `--sys-color-primary` | Semantic decisions |
| Component | `--comp-` | `--comp-button-padding` | Component-specific overrides |

### SD Config Gotchas

The `sd.config.js` has custom `name/we3` transform with mapping tables for SYS_TYPO, SYS_SPACING, SYS_SURFACE. When adding new system tokens:

- Typography tokens under `system.typography.*` get flattened via `SYS_TYPO` map
- Spacing tokens under `system.spacing.*` get flattened via `SYS_SPACING` map
- Surface tokens under `system.surface.*` get remapped via `SYS_SURFACE` map
- Child segments are preserved: `system.typography.fontFamily.display` becomes `--sys-font-family-display`

If you add a new token category that doesn't have a mapping, it falls through with the category prefix stripped.

## Code Style

- **CSS:** Always use token variables with fallbacks: `var(--sys-color-primary, #D42020)`. Never hardcode hex colours, pixel sizes, or font stacks.
- **Spacing:** Use `--sys-xxs` through `--sys-xxl` for spacing. Use `--sys-medium` (1.5rem) for container padding, NOT `--sys-page-padding` (100px — that's for full-page margins).
- **Transitions:** Always use `var(--sys-motion-duration, 200ms)` for transition durations.
- **Borders:** Use `var(--sys-divider-thickness, 1px)` for thin borders, `var(--sys-divider-accent-thickness, 3px)` for accent dividers.
- **Fonts:** Headings use `var(--sys-font-family-display)` (Quattrocento Sans). Body uses `var(--sys-font-family-body)` (Georgia). Never import fonts directly — they're loaded in `Layout.astro`.

## Content Collections

Two collections defined in `src/content/config.ts`:

### pages (`src/content/pages/`)
- Flexible schema with `.passthrough()` — any frontmatter key is valid
- Each page's `.astro` file casts `page.data as Record<string, any>` to access custom fields
- Files: `home.md`, `the-idea-drug.md`, `system-two.md`, `thinking.md`, `contact.md`

### posts (`src/content/posts/`)
- Strict schema: `title`, `description`, `date`, `readTime?`, `image?`, `published`
- Astro 5 content IDs include `.md` extension — use `post.id.replace(/\.md$/, "")` for slugs
- Date format: US style via `toLocaleDateString("en-US", ...)`

## Site Constants

`src/lib/site.ts` contains all site-wide config: nav links, book info (title, publisher, launch date), social URLs, footer text. Update this file for site-wide changes.

## Layout Patterns

- **Sections:** Use `.section` (default), `.section--sm`, or `.section--lg` for vertical padding. Add `.section--grey` for alternating grey backgrounds.
- **Containers:** `.container` (1200px), `.container--narrow` (720px), `.container--wide` (1400px)
- **Buttons:** Default `.btn` is filled red. `.btn--bordered` for bordered style. `.btn--ghost` for text links.
- **Footer trick:** `html` has black background, `body` has white. This prevents a white flash below the black footer on short pages.

## Common Pitfalls

1. **Token collision:** If you see the same CSS variable generated multiple times, the SD config mapping tables are likely discarding child segments. Check that `segs.slice(2)` is being spread into the result array.
2. **Container too wide:** `--sys-page-padding` is 100px (page-level margin). Container gutters should use `--sys-medium`.
3. **Blog slug `.md` suffix:** Astro 5 includes `.md` in `post.id`. Always strip it for URL generation.
4. **Duplicate content warnings:** Astro 5 may warn about duplicate IDs in glob-loader — this is harmless with the legacy `src/content/config.ts` location.
5. **Dev server port:** This project uses port 4322 (v1 uses 4321). Set in `astro.config.mjs`.
