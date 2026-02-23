# Architecture — The Idea Drug v2

Deep technical reference for the website's architecture, design decisions, and token system. Use this to get up to speed quickly when returning to the project.

## Why v2 Exists

v1 was built by Chad Cribbins based on initial requirements. Mark Bjornsgaard (the author) provided feedback via 5 PDF sketches showing a significantly different direction:

- Fewer pages (5 routes vs v1's larger set)
- Editorial/minimal aesthetic — no shadows, no gradients, no decorative elements
- Serif body type (Georgia) instead of sans-serif
- Centred single-column layouts (not two-column grids)
- Filled red CTAs instead of bordered buttons
- New "Thinking" blog section
- No Investments or About pages

v2 was scaffolded from scratch in `Website-v2/` alongside v1 (`Website/`), reusing the same Style Dictionary pipeline and WE3 token architecture but with entirely new design tokens, layouts, and content structure.

## Design Token System

### Token File: `project.tokens.json`

Single source of truth. Uses the [DTCG (Design Token Community Group)](https://design-tokens.github.io/community-group/format/) format with `$value` and `$type` properties.

### 3-Tier Architecture

```
Reference (--ref-)     Raw values. Never used directly in CSS.
    ↓ referenced by
System (--sys-)        Semantic decisions. Used in global.css and layouts.
    ↓ referenced by
Component (--comp-)    Component-specific. Used in component scoped styles.
```

**Reference tier** — Palette colours, font family stacks, raw size scale:
```
--ref-brand-primary: #D42020
--ref-brand-primary-hover: #B01A1A
--ref-neutral-ink: #000000
--ref-font-display: 'Quattrocento Sans', sans-serif
--ref-font-body: Georgia, 'Times New Roman', serif
```

**System tier** — Semantic mappings, spacing scale, typography decisions:
```
--sys-color-primary: var(--ref-brand-primary)
--sys-color-primary-hover: var(--ref-brand-primary-hover)
--sys-font-family-display: var(--ref-font-display)
--sys-font-family-body: var(--ref-font-body)
--sys-medium: 1.5rem
--sys-large: 2.25rem
--sys-surface-page: #FFFFFF
--sys-surface-card: #F2F2F2
```

**Component tier** — Button, form, action overrides:
```
--comp-button-padding: 10px 24px
--comp-button-font-size: 14px
--comp-form-border: #D8D8D8
--comp-form-focus-ring-color: #D42020
```

### Style Dictionary Pipeline

```
project.tokens.json
       ↓ (sd.config.js — name/we3 transform)
src/styles/tokens.generated.css    (CSS custom properties)
src/tokens/tokens.generated.ts     (TypeScript constants)
```

The `sd.config.js` registers a custom `name/we3` transform that:
1. Maps tier names to short prefixes: `reference` → `ref`, `system` → `sys`, `component` → `comp`
2. Drops/renames reference sub-groups (`palette` dropped, `spacing` → `space`, `family` → `font`)
3. Flattens system sub-groups via mapping tables (`SYS_TYPO`, `SYS_SPACING`, `SYS_SURFACE`)
4. Shortens component property names via `COMP` map (`background` → `bg`, `fontSize` → `font-size`)

**Critical implementation detail:** The SYS_* mappings preserve child segments. For example:
```
system.typography.fontFamily.display
→ SYS_TYPO["fontFamily"] = "font-family"
→ segs = [...("font-family").split('-'), ...["display"]]
→ --sys-font-family-display
```

Without the `...segs.slice(2)` spread, child keys get lost and tokens collide (e.g., three different fonts all mapping to `--sys-font-family`).

### Adding a New Token

1. Add the value to `project.tokens.json` under the appropriate tier
2. If it's a system token in typography/spacing/surface, check if it needs a new entry in the `SYS_*` mapping tables in `sd.config.js`
3. Run `pnpm tokens:build`
4. Use the generated variable in CSS with a fallback: `var(--sys-new-token, fallback-value)`

## Astro Architecture

### Content Collections

Defined in `src/content/config.ts` (legacy Astro location — still works in Astro 5):

**pages** — Flexible schema with `z.object({...}).passthrough()`. Each page's `.astro` file pulls specific frontmatter fields via `page.data as Record<string, any>`. This lets each page have unique content fields without schema changes.

**posts** — Strict schema for blog content:
- `title: string` (required)
- `description: string` (required)
- `date: date` (required — used for sorting and display)
- `readTime: string` (optional, e.g. "3 min read")
- `image: string` (optional — thumbnail path)
- `published: boolean` (default true — set false to hide)

### Page Architecture

Each `.astro` page follows the same pattern:

```astro
---
import Layout from "../layouts/Layout.astro";
import { getEntry } from "astro:content";

const page = await getEntry("pages", "page-name");
const d = page.data as Record<string, any>;
---

<Layout title={d.title} description={d.description}>
  <section class="section section--lg">
    <div class="container">
      <!-- Page content using {d.fieldName} for dynamic text -->
    </div>
  </section>
</Layout>
```

### Layout

`src/layouts/Layout.astro` provides:
- HTML boilerplate with `<meta>` tags (OG, Twitter Cards, canonical URL)
- Google Fonts (Quattrocento Sans 400/700)
- JSON-LD structured data support (optional `jsonLd` prop)
- Skip-to-content link
- Nav + Footer components
- Sticky footer via flexbox (`body { min-height: 100vh; display: flex; flex-direction: column }`)
- Black html background trick to prevent white flash below footer

### Site Constants

`src/lib/site.ts` exports a single `SITE` object with:
- `name`, `title`, `description`, `url` — SEO defaults
- `book` — title, subtitle, publisher, tagline, launch date
- `social` — LinkedIn, Spotify URLs
- `footer` — copyright text
- `nav` / `navRight` — navigation link arrays

## CSS Architecture

### Global Styles (`src/styles/global.css`)

Imports `tokens.generated.css`, then defines:

1. **Reset** — box-sizing, margin/padding, font smoothing
2. **Typography** — heading hierarchy (Quattrocento Sans), body (Georgia), responsive clamp sizes
3. **Container** — `.container` (1200px), `--narrow` (720px), `--wide` (1400px)
4. **Sections** — `.section` with `--sm`, `--lg`, `--grey` modifiers
5. **Buttons** — `.btn` (filled red), `.btn--bordered`, `.btn--ghost`
6. **Cards** — `.card` with token-backed padding and colours
7. **Grid** — `.grid--2` through `.grid--5` with responsive collapse
8. **Dividers** — `.divider-accent` (red, 3px) and `.divider` (grey, 1px)
9. **Utilities** — text helpers, margin utilities, screen-reader only

### Scoped Styles

Each `.astro` component/page has `<style>` blocks that are automatically scoped by Astro. These use the same token variables as global.css.

### Responsive Strategy

- Mobile-first with `@media (max-width: 768px)` breakpoints
- Grids collapse to single column on mobile
- Book image stack scales down (320px → 240px height)
- About section stacks vertically with centred text
- Container padding via `--sys-medium` (1.5rem) — comfortable on all screen sizes

## Component Reference

| Component | File | Purpose |
|-----------|------|---------|
| Nav | `src/components/Nav.astro` | Sticky header — logo left, links centre, Contact right. Mobile hamburger. Active page indicator (red underline). |
| Footer | `src/components/Footer.astro` | Black footer — "MARK BJORNSGAARD" centred, meta links (Privacy, copyright, Spotify). |
| EmailCapture | `src/components/EmailCapture.astro` | Inline email form (input + submit). Props: `heading`, `buttonText`, `variant` (inline/block). |
| ContactForm | `src/components/ContactForm.astro` | Horizontal label form (name, email, message). Accepts `prefill` prop for query-param-based message. |
| PressLogoGrid | `src/components/PressLogoGrid.astro` | 5-column grid of publication logos. Accepts `logos` array. |
| PostCard | `src/components/PostCard.astro` | Blog post card — thumbnail, title, read time, date. Links to `/thinking/[slug]`. |

## Image Assets

| File | Used on | Description |
|------|---------|-------------|
| `cover.png` (3.6MB) | Home, The Idea Drug | Book cover — centred in layered stack |
| `routine.png` (16KB) | Home, The Idea Drug | Sample page — left of cover in stack |
| `why.png` (19KB) | Home, The Idea Drug | Sample page — right of cover in stack |
| `mark.svg` (234KB) | Home | Mark's headshot illustration |
| `system-two.svg` (71KB) | Home | System Two logo |
| `favicon.svg` | All pages | Browser tab icon |
| Blog thumbnails (.svg) | Thinking | Illustrative thumbnails per post |

## Known Issues and Quirks

1. **Astro 5 duplicate content warnings** — `[WARN] [glob-loader] Duplicate id` appears during build. Harmless — caused by legacy `src/content/config.ts` location. Files aren't actually duplicated.

2. **Post ID includes `.md`** — Astro 5 `post.id` returns `"slug.md"` not `"slug"`. Always use `post.id.replace(/\.md$/, "")` when generating URLs.

3. **`--sys-page-padding` is 100px** — This token is for page-level layout margins, NOT container gutters. Container padding uses `--sys-medium` (1.5rem).

4. **Cover image is 3.6MB** — Should be optimised before production launch. Consider Astro's `<Image>` component or manual compression.

5. **Spotify URL is placeholder** — `social.spotify` in `site.ts` points to a placeholder. Needs Mark's real podcast/Spotify URL.

6. **Press logos are placeholder** — `public/images/press/` contains only `.gitkeep`. Mark needs to supply actual publication logos for the System Two page.

7. **Contact form has no backend** — The form component renders HTML but doesn't submit anywhere. Needs a form handler (Vercel serverless function, Formspree, etc.).

8. **OG image is placeholder** — `og-default.png` doesn't exist yet. Needs a proper Open Graph image for social sharing.

## Relationship to v1

| Aspect | v1 | v2 |
|--------|----|----|
| Repo | `chadgcribbins/the-idea-drug` | `chadgcribbins/the-idea-drug-v2` |
| Dev port | 4321 | 4322 |
| Body font | Sans-serif (Jost) | Serif (Georgia) |
| Headings | Jost | Quattrocento Sans |
| Buttons | Filled red | Filled red (was bordered, changed back per PDF match) |
| Layout | Two-column grids | Centred single-column |
| Pages | More pages (About, Investments) | 5 pages (Home, Book, System Two, Thinking, Contact) |
| Blog | None | "Thinking" section with posts |
| Token file | `project.tokens.json` (v1 values) | `project.tokens.json` (v2 values — different palette, typography) |

Both projects share the same Style Dictionary pipeline architecture (`sd.config.js` pattern) and WE3 3-tier naming convention.
