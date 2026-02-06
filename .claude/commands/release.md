# Create Release

GitFlow release: merge develop→main, tag, push to both remotes, create GitHub + GitLab releases.

## Usage

```
/release                      → Auto-determine version from commits
/release v1.0.1               → Explicit version, auto-generate title
/release v1.0.1 "Title Here"  → Explicit version AND title
```

## Instructions

1. **Check Current State**
   ```bash
   git branch --show-current   # Must be on develop (or main for hotfix)
   git status                  # Must be clean working tree
   git log --oneline -10       # Recent commits
   git describe --tags --abbrev=0 2>/dev/null || echo "No tags yet"
   ```

   - **Must be on `develop`** branch (normal release) or `main` (hotfix)
   - Working tree **must** be clean — abort if dirty
   - If on any other branch, abort with instructions to switch to `develop`

2. **Remote Tag Collision Check**

   Fetch latest tags from both remotes and verify the target version doesn't already exist:
   ```bash
   git fetch origin --tags
   git fetch github --tags
   git tag -l "v<VERSION>"
   ```

   If the tag already exists:
   - **ABORT** immediately
   - Show: `"Error: Tag v<VERSION> already exists."`
   - Suggest the next available version

3. **Determine Version and Title**

   **If user provided version and title** (e.g., `/release v1.0.1 "Title Here"`):
   - Use the provided version
   - Use the provided title in tag and release

   **If user provided version only** (e.g., `/release v1.0.1`):
   - Use the provided version
   - Auto-generate title from commit analysis

   **If no version provided** (`/release`):
   - Find last tag
   - Analyze commits since last tag
   - Auto-bump based on commit types:
     - `feat:` → **minor** bump (v0.1.0 → v0.2.0)
     - `fix:` only → **patch** bump (v0.1.0 → v0.1.1)
     - `BREAKING CHANGE` → **major** bump (v0.1.0 → v1.0.0)
     - `docs:`, `chore:` only → **patch** bump
   - Auto-generate title from commit analysis

   **First release** (no previous tags):
   - Default to `v0.1.0` unless user specifies

4. **Analyze Changes for Release Notes**

   Get commits since last tag (or all commits for first release):
   ```bash
   git log <last-tag>..HEAD --oneline   # or git log --oneline for first release
   ```

   Group commits by category:
   - Features
   - Bug fixes
   - Documentation changes
   - CI/CD changes
   - Theme changes
   - Chores

   Understand the PURPOSE, not just list commits.

5. **Write Release Notes**

   **Tag annotation format:**
   ```
   v<VERSION> - <Short Title>

   <One sentence summary of this release>

   <Category 1>:
   - Specific item
   - Specific item

   <Category 2>:
   - Specific item
   ```

   **GitHub release format (markdown):**
   ```markdown
   ## Summary
   <One paragraph describing what this release contains>

   ## What's Included

   ### <Category 1>
   - Item 1
   - Item 2

   ### <Category 2>
   - Item 1
   - Item 2

   ## Commits
   - `abc1234` commit message 1
   - `def5678` commit message 2
   ```

6. **Show Release Plan**

   Present the plan and **wait for user confirmation**:
   ```
   Release Plan:
   - Version: v1.0.1
   - Title: "Title Here"
   - Branch: develop → main (fast-forward merge)
   - Commits: 5

   Pre-release checks:
   - Remote tag collision: ✓ No conflict

   Will do:
   - Update CHANGELOG.md on develop (auto-committed)
   - Fast-forward merge develop → main
   - Create annotated tag v1.0.1
   - Push main + tag to origin (GitLab) + github (GitHub)
   - Create GitHub release with formatted notes
   - Create GitLab release with formatted notes

   Proceed with release? (waiting for confirmation)
   ```

   **Do NOT proceed until user confirms.**

7. **Update CHANGELOG.md on develop**

   Before merging, prepend a new entry to `CHANGELOG.md` on develop.

   Read the existing CHANGELOG.md, then prepend the new version entry **after the header
   lines** (title, blank line, format description, semver description, and blank line)
   but **before the first `## [v` entry**.

   **CHANGELOG entry format** (Keep a Changelog):
   ```markdown
   ## [v<VERSION>](https://github.com/rommelporras/eventually-consistent/releases/tag/v<VERSION>) - <YYYY-MM-DD>

   <One sentence summary of this release>

   ### Added
   - New features from `feat:` commits

   ### Fixed
   - Bug fixes from `fix:` commits

   ### Changed
   - Changes from `refactor:`, `chore:`, `infra:` commits

   ### Removed
   - Anything removed (if applicable)
   ```

   Rules:
   - Only include sections (Added/Fixed/Changed/Removed) that have items
   - Date is today's date in YYYY-MM-DD format
   - Descriptions should be human-readable, not raw commit messages
   - Link the version heading to the GitHub release

   **Commit and push the changelog update:**
   ```bash
   git add CHANGELOG.md
   git commit -m "docs: update CHANGELOG for v<VERSION>"
   ```

   This commit becomes part of the release merge.

8. **Execute Release**

   **Merge develop → main:**
   ```bash
   git checkout main
   git merge develop --ff-only
   ```

   If fast-forward merge fails (main has diverged), abort and report the issue.
   Do NOT force merge or create merge commits.

   **Create tag on main:**
   ```bash
   git tag -a v<VERSION> -m "<tag annotation>"
   ```

   **Push main + tag to both remotes:**
   ```bash
   # GitLab (primary)
   git push origin main
   git push origin v<VERSION>

   # GitHub (mirror)
   git push github main
   git push github v<VERSION>
   ```

   **Push develop to both remotes (keep in sync):**
   ```bash
   git checkout develop
   git push origin develop
   git push github develop
   ```

   **Create GitHub release:**
   ```bash
   gh release create v<VERSION> \
     --repo rommelporras/eventually-consistent \
     --title "v<VERSION> - <Title>" \
     --notes "<release notes markdown>"
   ```

   **Create GitLab release:**
   ```bash
   glab release create v<VERSION> \
     --name "v<VERSION> - <Title>" \
     --notes "<release notes markdown>"
   ```

   Use the same release notes for both platforms.

   **Switch back to develop:**
   ```bash
   git checkout develop
   ```

9. **Report Results**

   Show a summary:
   ```
   Release Complete:
   - Version: v1.0.1
   - Tag: v1.0.1 on main
   - CHANGELOG.md: ✓ updated on develop
   - origin (GitLab): ✓ main + tag + release created
   - github (GitHub): ✓ main + tag + release created
   - Current branch: develop
   - GitLab release: <URL>
   - GitHub release: <URL>
   ```

## Examples

### First Release (v0.1.0)

**Tag annotation:**
```
v0.1.0 - Eventually Consistent Ghost Theme

Custom Ghost theme with terminal-inspired dark mode design.

Theme:
- Dark mode by default with light mode support
- Terminal-style tagline with blinking cursor
- Featured articles carousel on homepage
- Custom 4-column footer with tech stack icons

CI/CD:
- GitLab pipeline: validate, build, deploy to Ghost
- Environment-scoped variables (dev + prod)
```

### Feature Release (v0.2.0)

**Tag annotation:**
```
v0.2.0 - Author Page Redesign

Redesigned author page layout and improved pagination.

Features:
- New author page with bio and social links
- Improved pagination across all archive pages

Fixes:
- Normalized footer spacing across all pages
- Reduced header height on mobile
```

### Patch Release (v0.1.1)

**Tag annotation:**
```
v0.1.1 - Footer Spacing Fix

Minor corrections to layout and spacing.

Fixes:
- Normalized footer spacing across all pages
- Fixed header overlap on mobile viewports
```

## Quality Checklist

Before releasing, verify:
- [ ] On `develop` branch (or `main` for hotfix)
- [ ] Working tree is clean (no uncommitted changes)
- [ ] Remote tags fetched and no version collision
- [ ] All commits are meaningful and well-formatted
- [ ] Version number follows SemVer
- [ ] Release notes are categorized and specific
- [ ] Tag annotation has context sentence
- [ ] CHANGELOG.md updated and committed on develop
- [ ] Fast-forward merge from develop to main succeeds
- [ ] Both remotes pushed (origin + github)
- [ ] GitHub release created with formatted notes
- [ ] GitLab release created with formatted notes
- [ ] Back on `develop` branch after release

## Important Notes

- NEVER release with uncommitted changes
- NEVER release without meaningful release notes
- NEVER release without user confirmation of the release plan
- NEVER force merge — fast-forward only from develop to main
- Always fetch remote tags before creating a new tag
- Always use annotated tags (`git tag -a`)
- Follow semantic versioning (MAJOR.MINOR.PATCH)
- First release defaults to v0.1.0
- Release notes should explain "what's in this release" not just list commits
- NO AI attribution in release notes or tag annotations
- Always switch back to `develop` after release completes
- Push to both `origin` (GitLab) and `github` (GitHub) remotes
- If any push fails, continue with remaining steps and report the failure
