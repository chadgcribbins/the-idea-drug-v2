# Setup Guide — The Idea Drug Website

This guide walks you through getting the website running on your machine so you can make changes, preview them locally, and publish updates to the live site.

No technical experience needed — just follow each step in order.

---

## Step 1: Create a GitHub Account

GitHub is where your website code lives online. Think of it as a cloud backup that also powers your deployments.

1. Go to [github.com](https://github.com)
2. Click **Sign up**
3. Use your email — either `mark@system-two.com` or your `@markbjornsgaard.com` address
4. Choose a username (e.g. `markbjornsgaard`)
5. Set a password and complete the verification
6. Keep your username and password handy — you'll need them shortly

---

## Step 2: Install Google Antigravity

Antigravity is your code editor. It also has a built-in AI assistant (Gemini) that can run commands, install tools, and set everything else up for you.

1. Go to [antigravity.google/download](https://antigravity.google/download)
2. Download the version for your computer (Mac, Windows, or Linux)
3. Run the installer
4. When it opens for the first time:
   - Choose **Start fresh**
   - Pick a theme (dark or light — your preference)
   - For agent mode, choose **Review-driven** (recommended) — this means the AI will ask before making big changes
   - Sign in with your Google account
   - Accept the terms

That's the only thing you need to install by hand. Gemini will do the rest.

---

## Step 3: Let Gemini Set Up Everything Else

Once Antigravity is open, find the **Agent Manager** panel (the chat/agent interface). Select **Gemini 3 Flash** as your model.

### 3a: Set up the Chrome extension

Before pasting the main prompt, Gemini can control a Chrome browser to navigate websites and fill in forms for you. When you first ask it to do something in the browser, it will prompt you to install the **Antigravity Chrome extension**. Go ahead and install it — you'll use it in a moment.

You can test it by typing:

> *"Open google.com in the browser"*

If Gemini opens Chrome and navigates there, you're all set.

### 3b: Paste the setup prompt

Now paste the following prompt into the Gemini agent panel:

---

> I'm setting up a website project on my machine for the first time. I have zero dev experience. Please walk me through each step one at a time, checking that each one works before moving on. Ask me to approve before running any commands.
> 
> **Start by detecting my Operating System so you use the right commands.**
>
> Here's what I need:
>
> 1. **Install Node.js** — check if it's already installed, if not download and install the LTS version from nodejs.org
> 2. **Install pnpm** — run `npm install -g pnpm`
> 3. **Install Git** — check if it's already installed, if not help me install it (on Mac this may trigger an Xcode Command Line Tools install — that's normal, just click Install and wait)
> 4. **Set up GitHub authentication** — use the browser to navigate to https://github.com/settings/tokens and help me create a Personal Access Token (select the `repo` scope). Then run `git config --global credential.helper store` so I only have to enter it once. Alternatively, install the GitHub CLI (`brew install gh`, install Homebrew first if needed) and run `gh auth login` to authenticate via the browser. Either way, confirm that authentication works before moving on.
> 5. **Create a Work folder and clone the starter repo** — run `mkdir -p ~/Work` then `git clone https://github.com/chadgcribbins/the-idea-drug-v2.git ~/Work/the-idea-drug` then `cd ~/Work/the-idea-drug`
> 6. **Create my own GitHub repository** — use the browser to navigate to https://github.com/new and help me create a public repo called `the-idea-drug` with no README, no .gitignore, and no license. Then run these commands:
>    ```
>    git remote remove origin
>    git remote add origin https://github.com/MY_GITHUB_USERNAME/the-idea-drug.git
>    git push -u origin main
>    ```
>    (Ask me for my GitHub username before running this)
> 7. **Install project dependencies** — run `pnpm install`
> 8. **Build the design tokens** — run `pnpm tokens:build`
> 9. **Start the dev server** — run `pnpm dev` and tell me to open http://localhost:4322 in my browser to see the site
> 10. **Open the project folder in Antigravity** — use File > Open Folder and open `~/Work/the-idea-drug`
>
> After each step, confirm it worked before moving to the next one.

---

Gemini will walk you through each step interactively — running terminal commands and navigating the browser as needed. Just follow along and approve what it wants to do.

When it's done, you should have the website running in your browser at **http://localhost:4322** and the project open in Antigravity with all the files visible in the sidebar.

---

## Step 4: Where Things Live

Your project lives at `~/Work/the-idea-drug` — this is your home base. All paths below are relative to that folder.

| What | Where |
|------|-------|
| Page content (text you'll edit most) | `src/content/pages/` — each page has a `.md` file |
| Blog posts | `src/content/posts/` — one `.md` file per post |
| Page layouts and structure | `src/pages/` — `.astro` files |
| Components (nav, footer, forms) | `src/components/` |
| Images | `public/images/` |
| Design tokens (colours, fonts, spacing) | `project.tokens.json` |
| Site-wide settings (name, links, nav) | `src/lib/site.ts` |

### Editing content

Most of the text on the site lives in simple markdown files. For example, to update the home page text:

1. Open `src/content/pages/home.md`
2. Edit the text between the `---` markers (this is called "frontmatter")
3. Save the file
4. Check the browser — your changes should appear automatically
 
 ### Adding Photos
 
 If you want to add a new photo to a page:
 1. Drag the image file from your computer into the `public/images/` folder in the sidebar.
 2. Ask Gemini: *"Put the photo 'my-new-headshot.jpg' onto the about page below the first paragraph."*

---

## Step 5: Making Changes with AI

Use the Gemini agent panel in Antigravity. Just describe what you want in plain English:

- *"Change the hero headline on the home page to 'Ideas Are Killing Innovation'"*
- *"Add a new blog post about corporate innovation"*
- *"Update Mark's bio to mention the new podcast"*
- *"Change the launch date to July 15th 2026"*

Gemini will make the edits and show you what it changed. Review the changes and approve them.

---

## Step 6: Save Your Changes to GitHub

After making changes, you need to "commit" them (save a snapshot) and "push" them (upload to GitHub).

### Option A: Ask Gemini to do it

In the Gemini agent panel, just say:

> *"Commit my changes and push to GitHub"*

Gemini will handle the git commands for you.

### Option B: Do it manually in the terminal

1. See what you've changed:
   ```
   git status
   ```
2. Stage all your changes:
   ```
   git add -A
   ```
3. Commit with a short message describing what you changed:
   ```
   git commit -m "Updated hero headline and launch date"
   ```
4. Push to GitHub:
   ```
   git push
   ```

---

## Step 7: Deploy to Vercel

Vercel is the service that hosts your live website. Once connected, every time you push changes to GitHub, your site updates automatically.

### First-time setup

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up** and choose **Continue with GitHub**
3. Authorise Vercel to access your GitHub account
4. Click **Add New Project**
5. Find **the-idea-drug** (or whatever you named your repo) in the list and click **Import**
6. Under **Build & Output Settings**:
   - Set the **Install Command** to: `pnpm install`
   - Set the **Build Command** to: `pnpm tokens:build && pnpm build`
7. Click **Deploy**
8. Vercel will build and publish your site — it'll give you a `.vercel.app` URL to preview

### Connect your domain

Once the site is deployed:

1. In Vercel, go to your project's **Settings > Domains**
2. Type in `markbjornsgaard.com` and click **Add**
3. Vercel will show you DNS records to set up. You'll need to go to wherever you bought the domain (e.g. GoDaddy, Namecheap, Google Domains) and update the DNS settings:
   - Add a **CNAME** record pointing `www` to `cname.vercel-dns.com`
   - Add an **A** record pointing `@` to `76.76.21.21`
4. It can take a few minutes to a few hours for DNS to propagate
5. Once connected, `www.markbjornsgaard.com` will show your site

### After that

Every time you push changes to GitHub (Step 6), Vercel will automatically rebuild and publish the updated site within about a minute. No extra steps needed.

---

## Quick Reference

| Task | Command |
|------|---------|
| Start the local dev server | `pnpm dev` |
| Stop the dev server | `Ctrl + C` |
| Open Gemini agent panel | Click the Agent Manager icon in Antigravity |
| See what files changed | `git status` |
| Save and upload changes | `git add -A && git commit -m "your message" && git push` |
| Install dependencies (after a fresh clone) | `pnpm install` |
| Rebuild design tokens | `pnpm tokens:build` |

---

## Need Help?

- Ask Gemini — it can answer questions about the project, explain how things work, and make changes for you
- Reach out to Chad for anything that feels stuck
