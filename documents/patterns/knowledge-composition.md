---
authors: [lada_kesseler]
video: https://www.youtube.com/watch?v=_LSK2bVf0Lc&t=1247s
---

# Knowledge Composition

## Problem
When you keep everything in one big file, you lose the ability to load just what you need. It's all or nothing - either load the whole thing and bloat your context, or skip it entirely.

## Pattern
Split knowledge into focused, composable files. Like avoiding giant functions in code - each file should have a single responsibility.

This lets you load only what's relevant for the current task instead of polluting context with everything.

## Example

**Development Practices:**
Bad: One `best-practices.md` with git workflow + code review checklist + refactoring process
Good: Separate files - `git-workflow.md`, `code-review.md`, `refactoring-process.md`
Enables: Pull just refactoring process when cleaning code, or just git-workflow when resolving conflicts

**Project Knowledge:**
Bad: One `project-info.md` with architecture + tech stack + deployment + API docs
Good: Separate files - `architecture.md`, `tech-stack.md`, `deployment.md`, `api-docs.md`
Enables: Pull just architecture when discussing design, or just tech-stack when evaluating libraries