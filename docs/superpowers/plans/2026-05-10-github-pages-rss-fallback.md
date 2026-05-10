# GitHub Pages RSS Fallback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the Astro blog build output to GitHub Pages so `https://js-banana.github.io/myblog/rss.xml` is available as a GitHub-hosted RSS fallback.

**Architecture:** Keep `myblog` as the display/deployment repository and keep `posts` as the content source. Add a GitHub Actions workflow in `myblog` that builds the existing Astro app with the canonical production `SITE_URL` and uploads `dist` to GitHub Pages. Do not change `astro.config.mjs`, Vercel config, content sync scripts, or site routing/base behavior.

**Tech Stack:** GitHub Actions, GitHub Pages, Astro, npm, `gh` CLI.

---

### Task 1: Add GitHub Pages Workflow

**Files:**
- Create: `.github/workflows/deploy-pages.yml`

- [ ] **Step 1: Create workflow directory**

Run:
```bash
mkdir -p .github/workflows
```

Expected: `.github/workflows` exists.

- [ ] **Step 2: Add deploy workflow**

Create `.github/workflows/deploy-pages.yml` with:
```yaml
name: Deploy GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: github-pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: npm

      - name: Setup Pages
        uses: actions/configure-pages@v5
        with:
          enablement: true

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build
        env:
          SITE_URL: https://blog.laifuyou.com

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Expected: Workflow enables GitHub Pages if needed and publishes `dist` to Pages without changing project config.

- [ ] **Step 3: Commit workflow**

Run:
```bash
git add .github/workflows/deploy-pages.yml
git commit -m "ci: deploy blog to github pages"
```

Expected: Commit succeeds.

### Task 2: Verify Build and Enable Pages

**Files:**
- No source file changes.

- [ ] **Step 1: Run local verification**

Run:
```bash
SITE_URL=https://blog.laifuyou.com npm run build
```

Expected: Build exits with code 0 and writes `dist/rss.xml`.

- [ ] **Step 2: Check RSS canonical host**

Run:
```bash
sed -n '1,20p' dist/rss.xml
```

Expected: Feed channel link uses `https://blog.laifuyou.com/`. If there are no current local posts, the feed may contain no items until the `posts` sync workflow pushes content again.

- [ ] **Step 3: Push branch to origin main**

Run:
```bash
git push origin main
```

Expected: Push succeeds and starts the Pages workflow.

- [ ] **Step 4: Enable Pages build source through GitHub Actions**

Run:
```bash
gh api --method POST repos/JS-banana/myblog/pages -f build_type=workflow
```

Expected: Either Pages is created, or GitHub reports it already exists.

- [ ] **Step 5: Trigger workflow if needed**

Run:
```bash
gh workflow run "Deploy GitHub Pages" --repo JS-banana/myblog --ref main
```

Expected: A new workflow run starts if the push did not already trigger one.

- [ ] **Step 6: Wait for deployment**

Run:
```bash
gh run list --repo JS-banana/myblog --workflow "Deploy GitHub Pages" --limit 1
gh run watch --repo JS-banana/myblog <run-id> --exit-status
```

Expected: Workflow completes successfully.

- [ ] **Step 7: Verify fallback URL**

Run:
```bash
curl -I https://js-banana.github.io/myblog/rss.xml
curl -L https://js-banana.github.io/myblog/rss.xml | sed -n '1,20p'
```

Expected: HTTP 200 and RSS XML output.

### Task 3: Update Profile README RSS Source

**Files:**
- Modify: `/Users/sunss/my-code/myAPP/JS-banana/build_readme.py`

- [ ] **Step 1: Update feed URL**

Change:
```python
blog_feed_url = "https://js-banana.github.io/blog/atom.xml"
```

To:
```python
blog_feed_url = "https://blog.laifuyou.com/rss.xml"
```

Expected: README generator uses the new blog RSS primary source. The GitHub Pages fallback URL remains available for manual failover.

- [ ] **Step 2: Verify script can parse feed**

Run:
```bash
python3 /Users/sunss/my-code/myAPP/JS-banana/build_readme.py
```

Expected: Script exits successfully and updates the blog section from the new RSS feed.

- [ ] **Step 3: Review profile README diff**

Run:
```bash
git -C /Users/sunss/my-code/myAPP/JS-banana diff -- build_readme.py README.md
```

Expected: `build_readme.py` points at the new RSS URL and README blog entries update accordingly.
