---
authors: [ivett_ordog]
---

# Slice for Review

## Problem
Agents like to deliver more at once than a human can review. Big deliveries either stall in review or get rubber-stamped (see Flying Blind). But forcing the agent to work in tiny increments from the start sacrifices its throughput.

And sometimes the huge PR is fair enough. If it came from a well defined set of instructions — we wanted to migrate from one framework to another, say — then that PR is going to be huge. But since it's a clear and relatively straightforward task, it's not worth starting over. It's much better to find a way to review it.

## Pattern
Let the agent deliver the large chunk — then add a splitting pass before human review:

1. The agent finishes the large piece of work on a branch
2. **Splitting pass**: the agent reorganizes the result into a stack of small, coherent, independently reviewable PRs — preparatory refactorings first, then behavior changes, then cleanups
3. The same pass doubles as a pruning pass: while reorganizing, the agent refactors and deletes cruft that turned out unnecessary
4. Humans review the stack in order, each PR small enough to actually read

Every commit is one of two types: a **structural** change, or a **behaviour** change. And each one has to:

- have one clear purpose that the agent can explain in a single sentence
- not touch more than a couple of hundred lines — 200 or so
- or, if it does touch more, be very repetitive: basically the same change over and over again, as part of a refactor that avoids having to make a sweeping change like that again

You get agent-speed delivery and human-speed review without forcing either side to work at the other's pace.

## Example
An agent delivers a 3,000-line feature branch. If you ask the agent to split it up, it will by default split it by structural elements. Instead give specific instructions on how to create vertical slices.

When done right, the splitting pass produces five stacked PRs: two preparatory refactorings, the core feature, the API wiring, and test/documentation updates. Two abandoned experiments get deleted during the split. Each PR reviews in minutes.
