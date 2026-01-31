# Eventually Consistent - Theme Modernization Design

**Date**: 2026-01-30
**Status**: Approved
**Base Theme**: Dawn (Ghost)

---

## Overview

Modernize the Dawn Ghost theme for "Eventually Consistent" blog with a terminal-inspired aesthetic, professional footer matching rommelporras.com, and complete removal of Ghost branding.

## Brand Identity

- **Blog Name**: Eventually Consistent
- **Tagline**: Converging toward competence, one outage at a time
- **Tone**: Playful, clever, humble, technical

## Design Decisions

### Color Scheme

Terminal-inspired monochrome with accents:

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Green | #3fb950 | Links, accents, terminal vibes |
| Secondary Orange | #f0883e | Hover states, highlights |
| Background (Dark) | #0d1117 | Default dark mode |
| Background (Light) | #ffffff | Light mode |
| Text (Dark) | #c9d1d9 | Body text dark mode |
| Text (Light) | #24292f | Body text light mode |

### Typography

| Element | Font | Fallback |
|---------|------|----------|
| Headings | JetBrains Mono | monospace |
| Body | Charter | Georgia, serif |
| Code | JetBrains Mono | monospace |

### Layout

- **Homepage**: 3 featured posts (cards) + chronological list (like Dawn)
- **Post**: Full-width content with sticky TOC sidebar (desktop)
- **Mobile**: Collapsible TOC at top of post

### Dark Mode

- **Default**: Dark mode
- **Toggle**: Persistent preference with system detection fallback

### Table of Contents

- **Desktop**: Sticky sidebar, highlights current section
- **Mobile**: Collapsible accordion at top of post
- **Auto-generated**: From H2/H3 headings

### Code Blocks

- **Syntax highlighting**: Prism.js or highlight.js
- **Copy button**: One-click copy functionality
- **Language label**: Display language name

## Footer Design

Four-column layout matching rommelporras.com:

```
┌─────────────────────────────────────────────────────────────────┐
│  Eventually       Quick Links      Tags           Built With    │
│  Consistent                                                     │
│                   Home             DevOps         Kubernetes    │
│  Converging       About            Docker         Cloudflare    │
│  toward           Archive          Security       Proxmox VE    │
│  competence...    RSS              Homelab        OPNsense      │
│                                    Platform Eng                 │
│  [Social Icons]                    Kubernetes                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  [Status Bar: Uptime • Last Deploy • Environment]              │
├─────────────────────────────────────────────────────────────────┤
│  © 2026 Rommel Porras          View Architecture →             │
│                                (links to rommelporras.com/homelab)│
└─────────────────────────────────────────────────────────────────┘
```

### Footer Requirements

- **No "Ghost" or "Powered by Ghost" branding**
- **Architecture link**: https://rommelporras.com/homelab/
- **Social links**: GitHub, LinkedIn, etc.
- **Tags**: Dynamic from Ghost, clickable filters
- **Built With**: Kubernetes (kubeadm baremetal), Cloudflare Tunnel, Proxmox VE, OPNsense

## Files to Modify

### Priority 1: Branding & Footer

| File | Changes |
|------|---------|
| `default.hbs` | Remove Ghost branding, implement new footer |
| `partials/footer.hbs` | Create new 4-column footer partial |
| `assets/css/site/footer.css` | New footer styles |

### Priority 2: Typography & Colors

| File | Changes |
|------|---------|
| `assets/css/general/fonts.css` | Add JetBrains Mono, Charter |
| `assets/css/general/basics.css` | Update CSS variables for colors |
| `assets/css/misc/dark.css` | Dark mode as default |

### Priority 3: Post Features

| File | Changes |
|------|---------|
| `post.hbs` | Add TOC container |
| `partials/toc.hbs` | Create TOC partial |
| `assets/css/blog/single.css` | TOC styles, code block styles |
| `assets/js/toc.js` | TOC generation and scroll tracking |
| `assets/js/code-copy.js` | Copy button for code blocks |

### Priority 4: Homepage

| File | Changes |
|------|---------|
| `index.hbs` | Verify featured + list layout |
| `assets/css/blog/feed.css` | Minor styling adjustments |

## Package.json Updates

```json
{
  "name": "eventually-consistent",
  "description": "Custom Ghost theme for Eventually Consistent blog",
  "author": {
    "name": "Rommel Porras",
    "url": "https://rommelporras.com"
  },
  "config": {
    "custom": {
      "color_scheme": {
        "default": "Dark"
      }
    }
  }
}
```

## Development Workflow

```bash
# Install dependencies
cd Dawn-latest
yarn

# Start development server
yarn dev

# Build for production
yarn zip
```

## Testing Checklist

- [ ] Dark mode displays by default
- [ ] Light mode toggle works and persists
- [ ] Footer renders correctly (4 columns)
- [ ] No "Ghost" branding visible anywhere
- [ ] TOC generates from headings
- [ ] TOC highlights current section on scroll
- [ ] Mobile TOC collapses/expands
- [ ] Code blocks have copy button
- [ ] Copy button works correctly
- [ ] Tags in footer are clickable
- [ ] Architecture link works
- [ ] All social links work
- [ ] Responsive on mobile/tablet/desktop

## Success Criteria

1. Professional appearance matching rommelporras.com aesthetic
2. Zero Ghost branding visible to users
3. Functional dark/light mode with dark as default
4. Working TOC for long-form posts
5. Code blocks with copy functionality
6. All tests pass (`yarn test`)
