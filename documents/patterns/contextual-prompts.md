---
authors: [ivett_ordog]
---

# Contextual Prompts

## Problem

Projects inevitably have small gotchas that both people and agents run into frequently. It's tempting to front-load these as instructions in CLAUDE.md, but that creates bloat. The more you add, the less reliable any single instruction becomes.

## Pattern

Instead of documenting gotchas upfront, embed the guidance directly in script outputs - error messages, success messages, CLI responses. Put reminders where they'll naturally be seen at the moment they're relevant.

This is what we've always done for humans: good error messages guide you to the solution. It works equally well for AI agents.

This needs no agent integration — the guidance lives in the output of scripts you own. When the trigger comes from a tool you can't modify (a linter, a test runner), see Habit Hooks, which delivers the same just-in-time guidance through agent lifecycle Hooks.

## Example

**Database migration gotcha**: Instead of adding "Always run migrations in production before deploying" to CLAUDE.md, make the deploy script check for pending migrations and output: "Pending migrations detected. Run `./migrate.sh production` before deploying."

**Environment-specific script**: A user permissions script only works in production. Both human and agent kept hitting obscure errors when running locally. The fix: check the environment variable and respond with "This script should only be run on the production server" - saving debugging time for everyone.
