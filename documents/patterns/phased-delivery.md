---
authors: [ivett_ordog]
---

# Phased Delivery

## Problem
A background agent given a big task in one undifferentiated run produces a monolithic result. Quality issues slip through because the same context that implemented the change also "reviews" it, and the resulting history is impossible for a human to review commit by commit.

## Pattern
A special case of Background Agent: structure the run into phases, each with its own focus and its own gate:

1. **Plan** — produce the plan and acceptance criteria; checkpoint it
2. **Implement** — one phase of the plan at a time
3. **Review** — a separate reviewer pass judges the result against your principles and the phase's acceptance gate. Fail → back to Implement with the feedback. Repeat until it passes
4. **Rebase** — rewrite the working history into clean, atomic commits before handing over

Separate phases work because of focus (see Focused Agent and Feedback Flip): an implementer and a reviewer see different things, even on the same model. The final rebase converts "how the agent got there" into "what a human should review", one atomic commit at a time.

## Example
A multi-phase work cycle: an implementer sub-agent makes the changes for the current phase only; lint and tests run until clean; a reviewer sub-agent assesses against coding principles plus the phase's acceptance gate; flagged issues loop back to the implementer. Only after the reviewer is happy: commit, then the next phase. The delivery ends with a rebase pass that turns the exploration into a sequence of atomic, reviewable commits.
