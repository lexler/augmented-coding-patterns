---
authors: [ivett_ordog]
---

# Smart Plan, Cheap Execution

## Problem
The strongest models produce the best plans, and they are expensive and slow. Most implementation work doesn't need that much intelligence; it needs a good specification. Run everything on the strong model and you pay frontier prices for routine edits. Run everything on the cheap one and you get architectural mistakes that no amount of cheap iteration will fix.

## Pattern
Split the work by how much intelligence it actually needs:

1. The strongest model plans: architecture, task breakdown, tricky decisions, acceptance criteria
2. Save the plan to a document (see Knowledge Checkpoint), self-contained so the executor needs no other context
3. A cheaper, faster model implements the plan step by step
4. Return to the strong model when the plan itself needs to change, or for review

Good planning turns an open-ended problem into a well-specified one, and well-specified tasks are what smaller models handle best.

Advisory Strategy is the mirror image: the cheap model leads and asks for help instead of following a plan made for it. Anthropic's published numbers are for that version — Sonnet 4.6 with an Opus advisor gained 2.7 points on SWE-bench Multilingual and cost 11.9% less per task — and [the write-up](https://claude.com/blog/the-advisor-strategy) presents it as an inversion of the arrangement here, where the larger model decomposes the work and delegates it to smaller ones.

## Example
Claude Code's "opusplan" mode does exactly this: Opus runs plan mode, Sonnet executes the approved plan.

The same idea works manually: plan a feature with the strongest model, checkpoint the plan to a file, then switch to a cheaper model for implementation. In multi-agent setups, run the orchestrator on the strong model and the worker subagents on cheaper ones.
