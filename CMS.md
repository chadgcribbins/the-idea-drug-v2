# Plan: Add Keystatic CMS to Website-v2 (Production GitHub Mode)

## Context

Mark Bjornsgaard is a non-technical user who needs to edit website content (page text, blog posts). He can't run things locally — he needs a live, browser-based admin UI on the published site. Keystatic in GitHub mode provides this: Mark visits `markbjornsgaard.com/keystatic`, logs in with GitHub, edits content through forms, and changes auto-commit to the repo and trigger a Vercel redeploy.

## Approach: Hybrid Mode + Keystatic GitHub Storage

- **Public pages**: Pre-rendered (static) for speed — same as now
- **Admin routes** (`/keystatic`, `/api/keystatic/*`): Server-rendered via Vercel serverless functions
- **Local dev**: Keystatic uses local filesystem (no GitHub API needed)
- **Production**: Keystatic uses GitHub API (commits edits directly to repo → Vercel auto-deploys)

### How Mark's editing flow works

1. Mark goes to `markbjornsgaard.com/keystatic`
2. Logs in with his GitHub account (one-time OAuth)
3. Sees a dashboard with "Pages" (Home, The Idea Drug, etc.) and "Posts" (blog)
4. Clicks a page → edits fields in a clean form → clicks Save
5. Keystatic commits the change to GitHub via API
6. Vercel detects the commit, rebuilds the site (~60 seconds)
7. Live site is updated

## Content Architecture

### Pages → Keystatic Singletons

Each page has unique frontmatter fields. Keystatic **singletons** give each page its own editing form.

| Singleton | File | Key fields |
|-----------|------|------------|
| Home | `src/content/pages/home.md` | heroHeadline, heroDescription, markBio, speakingDescription, systemTwoDescription |
| The Idea Drug | `src/content/pages/the-idea-drug.md` | bookDescription, videoId, videoTitle, videoDescription, wrongIntro, bullets[] |
| System Two | `src/content/pages/system-two.md` | headline, body, body2, cta, ctaHighlight, pressLogos[] |
| Thinking | `src/content/pages/thinking.md` | intro |
| Contact | `src/content/pages/contact.md` | linkedInText, linkedInUrl, formIntro |

### Posts → Keystatic Collection

Blog posts share a strict schema with markdown body content. Standard Keystatic collection.

Fields: title, description, date, readTime, image, published + body content (rich text editor).

## Steps

### 1. Install dependencies

```bash
npx astro add react markdoc vercel
pnpm add @keystatic/core @keystatic/astro
```

- **@astrojs/react**: Powers Keystatic admin UI
- **@astrojs/markdoc**: Handles Keystatic content format
- **@astrojs/vercel**: Adapter for hybrid mode (serverless functions for admin routes)
- **@keystatic/core + @keystatic/astro**: The CMS

### 2. Update `astro.config.mjs`

- Switch from `output: 'static'` to `output: 'server'` (Astro 5 removed `hybrid`)
- Add Vercel adapter
- Add `react()`, `markdoc()`, `keystatic()` integrations
- Mark all existing page routes with `export const prerender = true` so they stay static
- Only the Keystatic admin/API routes run as serverless functions

### 3. Add `export const prerender = true` to all existing pages

Files to update:
- `src/pages/index.astro`
- `src/pages/the-idea-drug.astro`
- `src/pages/system-two.astro`
- `src/pages/thinking.astro`
- `src/pages/thinking/[...slug].astro`
- `src/pages/contact.astro`

This ensures public pages are still pre-rendered (static HTML) for performance.

### 4. Create `keystatic.config.ts` (project root)

Conditional storage:
- `NODE_ENV === 'production'` → `storage: { kind: 'github', repo: { owner, name } }`
- Otherwise → `storage: { kind: 'local' }`

Define:
- **5 singletons** (one per page) with each page's specific field schema
- **1 collection** (posts) with shared schema

Field type mappings:
- Short strings → `fields.text()`
- Long text (bios, descriptions) → `fields.text({ multiline: true })`
- URLs → `fields.url()` or `fields.text()` with URL validation
- Dates → `fields.date()`
- Booleans → `fields.checkbox()`
- String arrays (bullets) → `fields.array(fields.text(...))`
- Object arrays (pressLogos) → `fields.array(fields.object({ name: fields.text() }))`
- Post body content → `fields.markdoc({ label: 'Content' })`

### 5. Create GitHub OAuth App

Mark (or Chad) creates a GitHub OAuth App:
1. Go to `github.com/settings/developers` → OAuth Apps → New OAuth App
2. **Application name**: "The Idea Drug CMS"
3. **Homepage URL**: `https://markbjornsgaard.com`
4. **Callback URL**: `https://markbjornsgaard.com/api/keystatic/github/oauth/callback`
5. Save the **Client ID** and **Client Secret**

### 6. Set Vercel environment variables

In Vercel project Settings → Environment Variables:

```
KEYSTATIC_GITHUB_CLIENT_ID=<from step 5>
KEYSTATIC_GITHUB_CLIENT_SECRET=<from step 5>
KEYSTATIC_SECRET=<random 64-char hex string>
```

Generate the secret via: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 7. Handle file format compatibility

The `@keystatic/astro` integration auto-creates the API and admin routes — no manual route files needed.

For content files:
- Singletons (pages): frontmatter-only `.md` files — Keystatic reads/writes YAML frontmatter directly
- Collection (posts): `.mdoc` files for new posts created via Keystatic (Markdoc format)
- Existing `.md` posts continue to work — update Astro content config to accept both extensions if needed

### 8. Update build command

The Vercel build command needs to change since we're now in server mode:
```
pnpm tokens:build && pnpm build
```
(Same command, but Astro now outputs serverless functions for admin routes alongside static pages)

### 9. Update documentation

- **SETUP.md**: Add section explaining the CMS — Mark goes to `markbjornsgaard.com/keystatic` to edit content
- **CLAUDE.md**: Document CMS integration, GitHub mode, environment variables
- **ARCHITECTURE.md**: Add CMS architecture section

## Files to create/modify

```
Created:
├── keystatic.config.ts                    # CMS schema (singletons + collection)

Modified:
├── package.json                           # New deps (react, markdoc, vercel, keystatic)
├── astro.config.mjs                       # Server mode + adapter + integrations
├── src/pages/index.astro                  # Add prerender = true
├── src/pages/the-idea-drug.astro          # Add prerender = true
├── src/pages/system-two.astro             # Add prerender = true
├── src/pages/thinking.astro               # Add prerender = true
├── src/pages/thinking/[...slug].astro     # Add prerender = true
├── src/pages/contact.astro                # Add prerender = true
├── SETUP.md                               # Add CMS section
├── CLAUDE.md                              # Document CMS
├── ARCHITECTURE.md                        # Document CMS
```

## One-Time Setup (Post-Deploy)

These are manual steps Chad or Mark does once after the first deploy:

1. Create GitHub OAuth App (Step 5 above)
2. Add environment variables to Vercel (Step 6 above)
3. Redeploy on Vercel
4. Visit `markbjornsgaard.com/keystatic` and authenticate with GitHub
5. Verify editing works end-to-end

## Verification

1. `pnpm tokens:build && pnpm dev` — dev server starts, Keystatic in local mode
2. Visit `http://localhost:4322/keystatic` — admin UI loads with 5 singletons + 1 collection
3. Edit Home singleton → save → verify `src/content/pages/home.md` updates on disk
4. Create a new blog post → verify it appears in `src/content/posts/`
5. All existing pages still render at their routes (no regressions)
6. `pnpm build` — builds with server output + static prerendered pages
7. After Vercel deploy + OAuth setup: visit `/keystatic` on live site, authenticate, edit content, verify commit appears on GitHub
