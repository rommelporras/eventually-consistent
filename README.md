# Eventually Consistent

Custom [Ghost](https://ghost.org/) theme for [blog.rommelporras.com](https://blog.rommelporras.com), forked from [Dawn](https://github.com/TryGhost/Dawn).

A terminal-inspired, dark-mode-first theme built for writing about DevOps, homelabs, and infrastructure.

<!-- TODO: Add screenshot
![Eventually Consistent Screenshot](docs/screenshot.png)
-->

## Features

- Dark mode by default with light mode toggle
- Terminal-style tagline with blinking cursor
- Sticky header with backdrop blur and accent border
- Featured articles carousel on homepage
- AJAX "Load more" pagination (no full page reload)
- Table of Contents sidebar (desktop) with collapsible mobile version
- Terminal-style code block headers with language labels and copy button
- Custom table styling with accent-colored headers and horizontal scroll on mobile
- Related posts section ("You might also like")
- Author page with cover banner, avatar, bio, and social links
- Custom 4-column footer with tech stack icons
- Official brand SVGs via [Simple Icons](https://simpleicons.org/)
- Custom post templates (full-width, narrow, no feature image)
- Skip-to-content link and accessible image alt text
- Responsive mobile-first design
- Ghost 5.x / 6.x compatible

## Quick Start

**Prerequisites:** [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)

```bash
# Clone the repository
git clone https://github.com/rommelporras/eventually-consistent.git
cd eventually-consistent

# Start local Ghost + MySQL
docker compose -f docker-compose.dev.yml up -d

# Ghost:       http://localhost:2368
# Ghost Admin: http://localhost:2368/ghost/  (create account on first run)
```

## Development

**Prerequisites:** [Node.js](https://nodejs.org/) (for building theme assets)

```bash
# Install theme dependencies
cd eventually-consistent && npm install

# Build CSS and JS
npx gulp build

# Restart Ghost to pick up changes
cd .. && docker compose -f docker-compose.dev.yml restart ghost

# Validate theme against Ghost compatibility
cd eventually-consistent && npx gscan .
```

Ghost caches CSS with `?v=hash` — changes require `gulp build` + container restart.

### Stop Development Environment

```bash
docker compose -f docker-compose.dev.yml down

# Remove data volumes for a fresh start
docker compose -f docker-compose.dev.yml down -v
```

## Deployment

This theme is deployed to a self-hosted Ghost instance on Kubernetes via a GitLab CI/CD pipeline. The pipeline validates the theme with `gscan`, builds a zip, and uploads it to Ghost via the [Admin API](https://ghost.org/docs/admin-api/).

See [`.gitlab-ci.yml`](.gitlab-ci.yml) for the full pipeline configuration — it can serve as a reference for automating Ghost theme deployments in your own setup.

### Manual Upload

```bash
cd eventually-consistent && npm run zip
```

Then upload `dist/eventually-consistent.zip` in Ghost Admin under Settings > Design > Change theme > Upload.

## Theme Structure

```
eventually-consistent/
├── default.hbs              # Base layout
├── index.hbs                # Homepage
├── post.hbs                 # Single post
├── page.hbs                 # Static page
├── tag.hbs                  # Tag archive
├── author.hbs               # Author archive
├── custom-*.hbs             # Custom post templates
├── partials/
│   ├── cover.hbs            # Homepage tagline
│   ├── featured-posts.hbs   # Featured carousel
│   ├── footer.hbs           # Custom footer
│   ├── loop.hbs             # Post listing
│   ├── content.hbs          # Post content + navigation
│   └── icons/               # SVG icon partials
└── assets/
    ├── css/                 # Source stylesheets (PostCSS)
    ├── js/                  # Source JavaScript
    ├── built/               # Compiled output
    ├── fonts/               # Mulish font files
    └── images/              # Theme images
```

## Branching Model

This project uses **GitFlow** with dual remotes:

| Branch | Purpose |
|--------|---------|
| `develop` | Default branch — active development, deploys to dev |
| `main` | Production — only updated via release merges, deploys to prod |

| Remote | Platform |
|--------|----------|
| `origin` | GitLab (primary, CI/CD) |
| `github` | GitHub (public mirror) |

Releases merge `develop` → `main` (fast-forward), create an annotated tag, and push to both remotes.

## Acknowledgments

- [Dawn](https://github.com/TryGhost/Dawn) by [Ghost Foundation](https://ghost.org/) — the base theme this fork builds on
- [Simple Icons](https://simpleicons.org/) — brand SVGs used in the footer and icon partials

## License

[MIT](LICENSE) — Copyright (c) 2013-2026 Ghost Foundation, 2026 Rommel Porras
