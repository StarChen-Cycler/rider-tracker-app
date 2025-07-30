# Claude Code Restoration Guide

This guide provides instructions for safely restoring your code to a previous state when modifications don't work as expected. Using Git's version control system, you can easily revert changes and maintain a stable codebase during development.

## Prerequisites

Before using this guide, ensure you have:
1. Git installed on your system
2. A Git repository initialized in your project
3. Basic understanding of Git commands

## Setting Up Git (If Not Already Done)

If your project is not yet a Git repository, initialize it:

```bash
cd /path/to/your/project
git init
git add .
git commit -m "Initial commit - baseline for restoration"
```

## Creating Restore Points

Before making significant changes, create a restore point:

```bash
# Create a restore point before making changes
git add .
git commit -m "Restore point: Before implementing [feature name]"
```

## Restoration Process

### 1. View Commit History

To see available restore points:

```bash
git log --oneline
```

This will show output like:
```
a1b2c3d Restore point: Before implementing real-time tracking
e4f5g6h Restore point: Before refactoring composables
i7j8k9l Initial commit - baseline for restoration
```

### 2. Restore to a Specific Commit

To restore to a specific commit:

```bash
# Restore to a specific commit (replace with actual commit hash)
git reset --hard a1b2c3d

# Or use relative references
git reset --hard HEAD~1  # Restore to one commit before current
```

### 3. Safe Restoration (Keeping Current Changes)

If you want to keep your current changes but restore specific files:

```bash
# Restore a specific file to its state in the last commit
git checkout HEAD -- path/to/file.ts

# Restore a specific file to its state in a specific commit
git checkout a1b2c3d -- path/to/file.ts
```

## Best Practices for Safe Modifications

### 1. Create Restore Points Regularly

```bash
# Before major changes
git commit -am "Restore point: Before major refactoring"

# After successful implementation
git commit -am "Feature complete: Real-time tracking"
```

### 2. Use Feature Branches

```bash
# Create and switch to a new branch for feature development
git checkout -b feature/new-feature

# After testing, merge back to main
git checkout main
git merge feature/new-feature

# Delete the feature branch
git branch -d feature/new-feature
```

### 3. Tagging Important Versions

```bash
# Tag stable versions
git tag -a v1.0 -m "Stable release with core features"

# List all tags
git tag

# Restore to a tagged version
git reset --hard v1.0
```

## Claude Code Specific Workflow

### Before Claude Code Makes Changes

1. Create a restore point:
   ```bash
   git add .
   git commit -m "Restore point: Before Claude Code modifications"
   ```

2. Note the commit hash:
   ```bash
   git rev-parse HEAD
   ```

### If Claude Code Changes Need to Be Reverted

1. Revert to the restore point:
   ```bash
   git reset --hard [commit-hash]
   ```

2. Or revert just the files that were changed:
   ```bash
   git checkout [commit-hash] -- [file-path]
   ```

## Emergency Recovery

If you need to completely restore your project to a clean state:

```bash
# WARNING: This will delete all uncommitted changes
git reset --hard HEAD

# If you need to go back multiple commits
git reset --hard HEAD~3  # Go back 3 commits
```

## Useful Git Commands for Restoration

| Command | Purpose |
|---------|---------|
| `git status` | Check current repository status |
| `git log --oneline` | View commit history |
| `git diff` | See current uncommitted changes |
| `git stash` | Temporarily save changes |
| `git stash pop` | Restore stashed changes |
| `git reflog` | View all Git operations (useful for recovery) |

## Example Workflow

```bash
# 1. Before Claude Code session
git add .
git commit -m "Restore point: Before route optimization feature"

# 2. After Claude Code session (if changes work)
git add .
git commit -m "Feature implemented: Route optimization with Memfire"

# 3. If changes don't work, restore to previous state
git reset --hard HEAD~1
```

## Additional Safety Tips

1. **Always commit working code**: Only create restore points when your code is in a working state
2. **Descriptive commit messages**: Make it clear what each restore point represents
3. **Regular backups**: In addition to Git, maintain regular backups of your project
4. **Test restore points**: Periodically test that you can successfully restore to previous states
5. **Document major changes**: Keep notes about what each major modification entails

## Troubleshooting

### "fatal: not a git repository"

If you see this error, initialize Git first:
```bash
git init
git add .
git commit -m "Initial commit"
```

### "Your local changes would be overwritten"

If you have uncommitted changes that conflict:
```bash
# Option 1: Stash changes temporarily
git stash
git reset --hard [commit-hash]
git stash pop

# Option 2: Discard local changes (WARNING: This deletes changes)
git reset --hard [commit-hash]
```

By following this guide, you can safely experiment with code modifications while maintaining the ability to quickly restore to a working state when needed.