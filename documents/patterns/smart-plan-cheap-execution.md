---
authors: [ivett_ordog]
---

# Smart Plan, Cheap Execution

## Problem
The strongest models produce the best plans, but they are expensive and slow. Most implementation work doesn't need them — it needs a good specification. Use the strong model for everything and you pay frontier prices for routine edits. Use the cheap model for everything and it makes architectural mistakes that no amount of cheap iteration can fix.

## Pattern
Split the work by how much intelligence it actually needs:

1. The strongest model plans: architecture, task breakdown, tricky decisions, acceptance criteria
2. Save the plan to a document (see Knowledge Checkpoint) — self-contained, so the executor needs no other context
3. A cheaper, faster model implements the plan step by step
4. Return to the strong model when the plan itself needs to change, or for review

This works because good planning turns an open-ended problem into a well-specified one — and well-specified tasks are exactly what smaller models are good at.

The complementary pattern is Escalate When Stuck: there the cheap model works by default and asks for help; here the smart model leads and delegates.

## Example
Claude Code's "opusplan" mode does exactly this: Opus runs plan mode, Sonnet executes the approved plan.

The same idea works manually: plan a feature with the strongest model, checkpoint the plan to a file, then switch to a cheaper model for implementation. In multi-agent setups, run the orchestrator on the strong model and the worker subagents on cheaper ones.
