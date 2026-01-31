# Push to Both Remotes

Push the current branch to both `origin` (GitLab) and `github` (GitHub).

## Usage

```
/push              → Push current branch to both remotes
```

No arguments needed. Detects the current branch and pushes to both remotes.

## Instructions

1. **Check Current State**
   ```bash
   git branch --show-current    # Detect current branch
   git status --short           # Check for uncommitted changes
   ```

   - If working tree is dirty, **warn** the user but do NOT block the push
   - Note which branch will be pushed

2. **Push to Both Remotes**
   ```bash
   # Push to GitLab (primary)
   git push origin <branch>

   # Push to GitHub (mirror)
   git push github <branch>
   ```

   Push sequentially — GitLab first (primary), then GitHub (mirror).

3. **Report Results**

   Show a summary:
   ```
   Push Results:
   - Branch: develop
   - origin (GitLab): ✓ pushed
   - github (GitHub): ✓ pushed
   ```

   If either remote fails, report the failure clearly and continue with the other remote.

## Important Notes

- Works for ANY branch — `develop`, `main`, feature branches, etc.
- Always pushes to both remotes in order: `origin` first, then `github`
- Dirty working tree triggers a warning, not a blocker
- NO AI attribution in any output
- If a remote fails, still attempt the other remote
