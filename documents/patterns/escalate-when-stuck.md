---
authors: [ivett_ordog]
---

# Escalate When Stuck

## Problem
Most of any task is routine work a cheap model handles fine. Occasionally it hits a wall: loops on a failing test, patches symptoms instead of causes, contradicts itself. Running the strongest model on the whole task to cover those rare moments is wasteful — but letting the cheap model thrash wastes even more (see Sunk Cost).

## Pattern
Default to the cheap model, and define escalation triggers:

- Two failed attempts at the same problem
- Reverting or contradicting its own changes
- The agent declaring uncertainty

On a trigger, consult the stronger model as an advisor: hand it the goal, the attempts so far, and the errors. The advisor diagnoses and plans; the cheap model resumes with the advice.

Escalation can be automatic (instruct the agent to ask for help when stuck) or manual (you notice the thrashing and bring in the stronger model yourself).

Same economics as a senior engineer on call: you don't have them type everything — you make them easy to ask.

The complementary pattern is Smart Plan, Cheap Execution: there the smart model leads from the start; here it's only consulted when needed.

## Example
Sonnet implements a database migration. After the second failed attempt on the same failing test, it spawns a subagent on the strongest model with the diff, the error, and "what am I missing?" The advisor spots the wrong assumption — an ORM lifecycle detail — and Sonnet applies the correction and finishes.

In Claude Code, subagents can run a different model than the main loop, so this works in both directions: a cheap main loop escalating to a smart subagent, or cheap workers under a smart orchestrator.
