---
authors: [ivett_ordog]
---

# Slice for Review

## Problem
Agents like to deliver more at once than a human can review. Big deliveries either stall in review or get rubber-stamped (see Flying Blind). But forcing the agent to work in tiny increments from the start sacrifices its throughput.

## Pattern
Let the agent deliver the large chunk — then add a splitting pass before human review:

1. The agent finishes the large piece of work on a branch
2. **Splitting pass**: the agent reorganizes the result into a stack of small, coherent, independently reviewable PRs — preparatory refactorings first, then behavior changes, then cleanups
3. The same pass doubles as a pruning pass: while reorganizing, the agent refactors and deletes cruft that turned out unnecessary
4. Humans review the stack in order, each PR small enough to actually read

You get agent-speed delivery and human-speed review without forcing either side to work at the other's pace.

## Example
An agent delivers a 3,000-line feature branch. The splitting pass produces five stacked PRs: two preparatory refactorings, the core feature, the API wiring, and test/documentation updates. Two abandoned experiments get deleted during the split. Each PR reviews in minutes.
