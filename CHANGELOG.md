# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.1.5](https://github.com/rommelporras/eventually-consistent/releases/tag/v1.1.5) - 2026-02-11

Accessibility improvements and visual polish across all page templates.

### Added

- Skip-to-content link with `.sr-only` focus styles for keyboard navigation
- `id="site-main"` landmark on all page templates (index, post, page, tag, author, custom)
- Visible `<h1>` on homepage (sr-only) for screen readers
- `aria-label` on all social links in author template
- Tag post count on tag archive pages using pagination data

### Changed

- Tag feature image: replace forced 2:1 aspect ratio with natural display, add border-radius and max-height cap
- Restore post content width to 860px for better use of wide monitors
- Remove max-width cap on TOC grid container

### Fixed

- Tag post count was empty — switched from unavailable `{{count.posts}}` to `{{plural ../pagination.total}}`
- Mobile table cells inheriting `white-space: nowrap` from Ghost shared-theme-assets
- Mobile code blocks too large — reduced font size
- Feed titles not wrapping on mobile — added line clamping

## [v1.1.4](https://github.com/rommelporras/eventually-consistent/releases/tag/v1.1.4) - 2026-02-11

Fix mobile table scroll behavior — border and scroll-hint gradient now stay fixed at the container edge instead of scrolling with table content. Uses a two-div wrapper pattern (outer for border/gradient, inner for scroll).

### Fixed

- Table border and scroll-hint gradient no longer scroll with content on mobile — moved to outer wrapper that stays fixed
- CSS specificity conflict with Ghost shared-theme-assets that caused tables to not fill full width on desktop

### Changed

- Update dev Ghost URL from `blog-dev.k8s.home.rommelporras.com` to `blog.dev.k8s.rommelporras.com` across CI/CD config and docs

## [v1.1.3](https://github.com/rommelporras/eventually-consistent/releases/tag/v1.1.3) - 2026-02-07

Fix Gulp 5 binary file corruption in theme zip. Gulp 5 changed `src()` default encoding from binary to UTF-8, corrupting font files during `gulp zip`. Adding `encoding: false` preserves binary files correctly.

### Fixed

- Add `encoding: false` to gulpfile zipper function — prevents Gulp 5 from corrupting binary files (fonts, images) during theme zip build

## [v1.1.2](https://github.com/rommelporras/eventually-consistent/releases/tag/v1.1.2) - 2026-02-07

Replace all Mulish font files with fresh downloads from Google Web Fonts Helper. The v1.1.0 font fix shipped corrupted files (woff2 files were identical copies, woff headers had incorrect sizes).

### Fixed

- Replace all 10 Mulish font files (5 woff + 5 woff2) with valid downloads — fixes OTS parsing errors and "incorrect file size in WOFF header" warnings on both dev and prod

### Changed

- Add remote tag collision check and user confirmation gate to `/release` command

## [v1.1.1](https://github.com/rommelporras/eventually-consistent/releases/tag/v1.1.1) - 2026-02-05

Added CHANGELOG and improved release workflow.

### Added

- CHANGELOG.md following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format
- GitLab release creation via `glab` CLI in `/release` command
- Auto-update CHANGELOG.md step in `/release` workflow

## [v1.1.0](https://github.com/rommelporras/eventually-consistent/releases/tag/v1.1.0) - 2026-02-05

UI polish release with sticky navigation and font fixes.

### Added

- Sticky header with backdrop blur and green accent border
- Dark mode support for sticky header background
- Git workflow and branching model documentation

### Fixed

- Sticky TOC sidebar on desktop — grid `align-items: start` prevented sidebar from stretching, breaking `position: sticky`
- Corrupted Mulish WOFF2 font files replaced (partially — see v1.1.2 for complete fix)

### Changed

- Docker containers and volumes renamed to `ec-*` prefix for project specificity

## [v1.0.0](https://github.com/rommelporras/eventually-consistent/releases/tag/v1.0.0) - 2026-02-01

Initial release. Custom Ghost theme for blog.rommelporras.com, forked from Dawn.

### Added

- Dark mode by default with light mode support
- Terminal-style tagline with blinking cursor on homepage cover
- Featured articles carousel on homepage
- Custom 4-column footer with tech stack icons (Kubernetes, Cloudflare, Proxmox, OPNsense)
- Table of Contents sidebar for long-form posts (desktop) with collapsible mobile version
- Terminal-style code block headers with language labels and copy button
- Custom table styling with accent-colored headers and hover states
- Author page with cover banner, avatar, bio, and social links
- Monospace headings using JetBrains Mono
- Custom post templates (full, narrow, no feature image)
- SVG icon partials from Simple Icons (MIT licensed)
- GitLab CI/CD pipeline for automated theme deployment
- Docker Compose local development environment
- Dual-remote setup (GitLab + GitHub)
