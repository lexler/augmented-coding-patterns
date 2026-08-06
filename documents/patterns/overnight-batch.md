---
authors: [ivett_ordog]
alternative_titles: ["Unsupervised Delivery"]
---

# Overnight Batch

## Problem
Supervised agent sessions are limited by your attention. Small, well-understood tasks queue up and either steal focus from the work that actually needs you, or never get done. Delivering trivial fixes interactively spends the scarcest resource — human hours — on work that doesn't need them.

## Pattern
Turn the backlog into unattended batch work:

1. **Capture** every idea and bug as a GitHub issue the moment it comes up
2. **Batch-plan**: periodically plan many issues in one round. Absorb shared work into common groundwork, order by dependency, and give every issue a deterministic acceptance gate (tests, grep, a script)
3. **Label** the ready ones — e.g. "ready for unsupervised"
4. **Deliver unattended**: a cloud or background agent works through the labeled batch while you're away — one branch or PR per issue, gate verified
5. **Review in bulk** the next morning

The deterministic gate is what makes unsupervised delivery safe: acceptance doesn't depend on judgment the agent might fudge. Batch planning is what makes it efficient: planning ten issues at once surfaces shared groundwork that per-issue planning would duplicate ten times.

## Example
A planning pass turns a feature request into the fewest well-scoped issues, each dependency-ordered and gated, labeled "ready for unsupervised". A scheduled cloud agent picks up everything with the label overnight and delivers each issue as a PR with its gate green. Morning review is scanning a handful of PRs — not supervising a handful of sessions.

Tools that enable this: scheduled cloud agents (cron-style routines), the GitHub-app variants of coding agents, and scripted multi-agent workflows for the delivery run itself.
