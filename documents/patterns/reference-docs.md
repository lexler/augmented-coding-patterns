---
authors: [lada_kesseler]
video: https://www.youtube.com/watch?v=_LSK2bVf0Lc&t=1136s
---

# Reference Docs

## Problem
You have knowledge you need sometimes, but not always. Loading it into ground rules would bloat context and dilute focus.

## Pattern
On-demand knowledge documents. Load them only when you need them for the current task.

Unlike ground rules (always loaded), you explicitly pull in references when relevant. This keeps context focused and gives you granular control over what's loaded.

## Example
- `bash-standards.md` - load only when writing bash scripts
- `tdd.process.md` - load only when doing TDD
- `architecture.md` - load when you need to quickly explain architecture of your project
 
Build a library of these. Pull them in as needed.
