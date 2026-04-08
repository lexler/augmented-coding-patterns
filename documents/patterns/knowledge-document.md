---
authors: [lada_kesseler]
video: https://www.youtube.com/watch?v=_LSK2bVf0Lc&t=545s
---

# Knowledge Document

## Problem
To keep AI from degrading, you need to hit 'reset' often. But important knowledge vanishes when you reset.

## Pattern
Save important information to markdown files. Load them into context when needed.

This makes resetting easier: instead of losing everything, you extract the valuable parts to files first, then load them back into a clean context.

## Example
- `~/.claude/CLAUDE.md` - global Claude Code behavior rules
- `project.md` - project-specific context
- `tdd-process.md` - how you want to work
- `approval_tests.md` - specific techniques to follow