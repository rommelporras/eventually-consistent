# CLAUDE.md

This file provides guidance to Claude Code when working with this Ghost theme repository.

## Project Overview

Custom Ghost theme ("Eventually Consistent") for blog.rommelporras.com, forked from the Dawn theme. This theme is deployed to a self-hosted Ghost instance running on Kubernetes.

## Repository Structure

```
eventually-consistent/
├── CLAUDE.md              # This file (Claude Code context)
├── README.md              # Theme documentation (public-facing)
├── package.json           # Root package metadata
├── docker-compose.dev.yml # Local development environment
├── .gitlab-ci.yml         # CI/CD pipeline for theme deployment
├── .gitignore
│
├── .claude/               # Claude Code configuration (gitignored)
│   ├── commands/
│   │   ├── commit.md      # /commit — conventional commit
│   │   ├── push.md        # /push — push to both remotes
│   │   └── release.md     # /release — GitFlow release workflow
│   ├── hooks/
│   │   └── protect-sensitive.sh  # Security hook
│   └── settings.json      # Plugins and hook config
│
└── eventually-consistent/ # Ghost theme (active)
    ├── package.json       # Theme metadata and Ghost config
    ├── gulpfile.js        # Build pipeline (CSS/JS compilation)
    ├── default.hbs        # Base layout (header, footer, scripts)
    ├── index.hbs          # Homepage / post listing
    ├── post.hbs           # Single post view
    ├── page.hbs           # Static page view
    ├── tag.hbs            # Tag archive
    ├── author.hbs         # Author archive
    ├── about-content.html # About page HTML (paste into Ghost Admin)
    │
    ├── partials/          # Reusable template components
    │   ├── footer.hbs     # Custom footer with tech stack
    │   ├── cover.hbs      # Homepage cover section
    │   ├── featured-posts.hbs  # Featured articles carousel
    │   ├── loop.hbs       # Post listing loop
    │   ├── content.hbs    # Post content with prev/next nav
    │   ├── related-posts.hbs   # "You might also like" / latest posts
    │   ├── srcset.hbs     # Responsive image srcset helper
    │   ├── comments.hbs   # Member discussion section
    │   ├── content-cta.hbs    # Call-to-action for membership
    │   ├── pagination.hbs # Page navigation
    │   ├── pswp.hbs       # PhotoSwipe lightbox
    │   └── icons/         # SVG icon partials (Simple Icons)
    │       ├── github.hbs, linkedin.hbs, facebook.hbs, twitter.hbs
    │       ├── kubernetes.hbs, cloudflare.hbs, proxmox.hbs, opnsense.hbs
    │       ├── rss.hbs, search.hbs, arrow-left.hbs, arrow-right.hbs
    │       ├── threads.hbs, bluesky.hbs, instagram.hbs, mastodon.hbs
    │       └── youtube.hbs, tiktok.hbs, website.hbs, star.hbs, chevron-right.hbs
    │
    ├── assets/
    │   ├── css/
    │   │   ├── screen.css          # Main CSS entry point (imports all)
    │   │   ├── site/               # Site-wide styles
    │   │   │   ├── header.css      # Sticky header with accent border
    │   │   │   ├── footer.css      # Custom 4-column footer
    │   │   │   ├── cover.css       # Terminal-style tagline
    │   │   │   └── layout.css      # Page layout
    │   │   ├── blog/               # Blog-specific styles
    │   │   ├── general/            # Base styles, fonts, buttons
    │   │   ├── misc/               # Dark mode, animations, utilities
    │   │   └── custom/
    │   │       └── eventually-consistent.css  # Theme customizations
    │   ├── js/
    │   │   └── main.js             # Main JavaScript
    │   ├── built/                  # Compiled output (screen.css, main.min.js)
    │   ├── fonts/                  # Mulish font files
    │   └── images/                 # Theme images
    │
    └── docs/              # Theme design docs
```

## Git Workflow

### Branching Model (GitFlow)

| Branch | Purpose |
|--------|---------|
| `main` | Production — only updated via release merges |
| `develop` | Active development — default branch, all work targets here |

- **Never commit directly to `main`** — it only receives fast-forward merges from `develop` during releases
- Feature work happens on `develop` (or feature branches merged into `develop`)
- CI/CD deploys `develop` → dev Ghost, `main` → prod Ghost

### Dual Remotes

| Remote | Platform | Purpose |
|--------|----------|---------|
| `origin` | GitLab (self-hosted) | Primary — has CI/CD pipeline |
| `github` | GitHub (public) | Mirror/showcase |

Always push to both remotes to keep them in sync.

### Slash Commands

| Command | What it does |
|---------|-------------|
| `/commit` | Analyze changes, generate conventional commit message, commit locally |
| `/push` | Push current branch to both `origin` and `github` |
| `/release` | Full GitFlow release: merge develop→main, tag, push, create GitHub release |

Typical workflow:
```
# 1. Make changes on develop
# 2. /commit          → commit locally
# 3. /push            → push develop to both remotes (triggers dev deployment)
# 4. /release         → when ready for production release
```

## Build Process

```bash
# Compile source CSS/JS → assets/built/
cd eventually-consistent && npx gulp build

# Restart Ghost to pick up CSS changes (cached with version hash)
cd .. && docker compose -f docker-compose.dev.yml restart ghost
```

Ghost caches CSS with `?v=hash` — changes require `gulp build` + container restart.

## Local Development

### Quick Start

```bash
# Start local Ghost + MySQL
docker compose -f docker-compose.dev.yml up -d

# Access Ghost
open http://localhost:2368

# Ghost Admin (first run: create account)
open http://localhost:2368/ghost/
```

### Theme Development Workflow

1. Edit `.hbs` templates, `assets/css/` files, or `partials/`
2. Run `cd eventually-consistent && npx gulp build`
3. Run `docker compose -f docker-compose.dev.yml restart ghost`
4. Wait ~10s for Ghost to start, then refresh browser

### Validate Theme

```bash
cd eventually-consistent && npx gscan .
```

Must pass Ghost 6.x compatibility.

### Stop Development Environment

```bash
docker compose -f docker-compose.dev.yml down

# To also remove data volumes (fresh start):
docker compose -f docker-compose.dev.yml down -v
```

## Deployment

### Environments

| Environment | Internal URL | Public URL | Branch |
|-------------|-------------|------------|--------|
| Dev | blog.dev.k8s.rommelporras.com | — | `develop` |
| Prod | blog.k8s.home.rommelporras.com | blog.rommelporras.com | `main` |

### CI/CD Pipeline

Push to branch triggers automatic deployment:
- `develop` branch → deploys to dev Ghost
- `main` branch → deploys to prod Ghost

The pipeline:
1. Validates theme with gscan
2. Builds theme zip
3. Generates JWT token from Admin API key
4. Uploads to Ghost via Admin API
5. Theme activates automatically

**Required GitLab CI/CD Variables (same key, scoped per environment):**
```
GHOST_URL           [development] = https://blog.dev.k8s.rommelporras.com
GHOST_URL           [production]  = https://blog.k8s.home.rommelporras.com
GHOST_ADMIN_API_KEY [development] = <id:secret from Ghost Admin Integration>
GHOST_ADMIN_API_KEY [production]  = <id:secret from Ghost Admin Integration>
```

Note: Use internal K8s URLs for `GHOST_URL`. Public `/ghost/` path is blocked at Cloudflare WAF.

### Manual Theme Upload

If CI/CD fails, upload manually:
1. Run `npm run zip` inside `eventually-consistent/`
2. Go to Ghost Admin → Settings → Design → Change theme → Upload
3. Select the generated zip

## Ghost Theme Development

### Key Patterns

- **Icon partials:** SVG icons in `partials/icons/` — include with `{{> "icons/github"}}`
- **All icons use `fill="currentColor"`** for theme color adaptation
- **Icon sources:** Official SVGs from Simple Icons (simpleicons.org), MIT licensed
- **About page content:** HTML in `about-content.html` — paste into Ghost Admin HTML card
- **Ghost Admin pages** (About, Architecture) are managed in Ghost Admin, not in theme files
- **Navigation:** Configured in Ghost Admin → Settings → Navigation (not auto-populated from pages)

### Template Hierarchy

Ghost uses this order to find templates:
1. `post-{slug}.hbs` - Specific post
2. `post.hbs` - All posts
3. `page-{slug}.hbs` - Specific page
4. `page.hbs` - All pages
5. `index.hbs` - Homepage
6. `default.hbs` - Base layout (always used)

### Custom Settings (package.json)

Theme settings in `eventually-consistent/package.json` under `config.custom`:
- Colors, fonts, layout options
- Appear in Ghost Admin → Settings → Design

## Version Pinning

**Important:** Keep versions in sync with K8s deployments.

| Component | Version | Update Location |
|-----------|---------|-----------------|
| Ghost | 6.14.0 | docker-compose.dev.yml |
| MySQL | 8.4.8 | docker-compose.dev.yml |

Do NOT update versions here without also updating:
- `manifests/ghost-dev/` in homelab repo
- `manifests/ghost-prod/` in homelab repo

## Technical Details

### Database Configuration

MySQL is configured with `utf8mb4` character set for full Unicode/emoji support:
- Character set: `utf8mb4`
- Collation: `utf8mb4_0900_ai_ci`
- Ghost env: `database__connection__charset: utf8mb4`

### Ghost Admin API Authentication

The Admin API requires JWT authentication (not raw API keys):

1. API key format: `id:secret` (from Ghost Admin → Settings → Integrations)
2. Split into ID and SECRET
3. Generate JWT with:
   - Header: `{"alg":"HS256","typ":"JWT","kid":"<id>"}`
   - Payload: `{"iat":<now>,"exp":<now+300>,"aud":"/admin/"}`
4. Sign with HMAC-SHA256 using hex-decoded secret
5. Use: `Authorization: Ghost <jwt_token>`

The CI/CD pipeline handles this automatically.

## Related Repositories

| Repo | Purpose |
|------|---------|
| `blog-workshop` | Blog content drafts, research, and editorial planning |
| `homelab` | K8s manifests for Ghost deployment (manifests/ghost-dev/, manifests/ghost-prod/) |

## Rules

- **NO AI attribution** in commits - Do not include "Generated with Claude Code", "Co-Authored-By: Claude", or any AI-related attribution in commit messages, PR descriptions, or code comments.
- **NO automatic git commits or pushes** - Do not run `git commit` or `git push` unless explicitly requested by the user or invoked via `/commit`, `/push`, or `/release` commands.
- **GitFlow discipline** - Never commit directly to `main`. All work goes through `develop`. Releases merge develop→main via fast-forward only.
- **Push to both remotes** - Always push to `origin` (GitLab) AND `github` (GitHub). Use `/push` to handle this automatically.
- **Test locally first** - Always verify changes work locally before pushing
- **Push to develop first** - Never push directly to main without testing in dev
- **Build before testing** - Run `gulp build` + restart Ghost after CSS/JS changes
- **Validate before commit** - Run `npx gscan .` to ensure Ghost 6.x compatibility
- **Keep it simple** - Avoid unnecessary JavaScript or complex CSS
- **Mobile first** - Test responsive design on mobile viewports
- **Accessibility** - Use semantic HTML, proper headings, alt text
- **Performance** - Optimize images, minimize CSS/JS

## References

- [Ghost Theme Documentation](https://ghost.org/docs/themes/)
- [Ghost Handlebars Themes](https://ghost.org/docs/themes/handlebars/)
- [Ghost Helpers](https://ghost.org/docs/themes/helpers/)
- [Simple Icons](https://simpleicons.org/) - SVG brand icons (MIT)
- [Dawn Theme (original fork)](https://github.com/TryGhost/Dawn)
