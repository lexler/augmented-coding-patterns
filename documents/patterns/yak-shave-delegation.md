---
authors: [ivett_ordog]
---

# 🐃 Yak Shave Delegation

## Problem

Yak shaving breaks flow and context for both you and your primary agent. Environment issues derail focus even though they're often trivial to fix.

## Pattern

When a tangential issue blocks your main work, spawn a separate agent to handle it instead of switching context yourself.

1. Hit an environment/tooling issue (compiler error, missing dependency, config problem)
2. Recognize it's yak shaving - not your core task
3. Spawn a separate agent to handle it (error messages usually contain the fix instructions)
4. Continue your main work with your primary agent
5. Check back when the yak-shave agent signals it's done

This keeps both you and your main agent focused on the core problem while the yak shave gets resolved in parallel.

## Example

Returning to a project after some time, the codebase has moved on. Running the app fails - needs a new Ruby runtime, recompiled libraries, and config changes.

Instead of context-switching to fix these, spawn an agent with the error output. The agent installs Ruby, recompiles dependencies, and updates config while you and your primary agent continue exploring the codebase and planning the next feature.
