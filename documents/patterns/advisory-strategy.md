---
authors: [ivett_ordog]
---

# Advisory Strategy

Named after Anthropic's [advisor strategy](https://claude.com/blog/the-advisor-strategy).

## Problem
Most of a task is routine work a cheap model handles fine. Now and then it gets stuck: loops on a failing test, patches symptoms instead of causes, contradicts itself. Running the strongest model throughout to cover those few moments is expensive. Letting the cheap model thrash through them wastes more (see Sunk Cost).

## Pattern
Default to the cheap model and define escalation triggers:

- Two failed attempts at the same problem
- Reverting or contradicting its own changes
- The agent declaring uncertainty

On a trigger, consult the stronger model as an advisor: hand it the goal, the attempts so far, and the errors. The advisor diagnoses and plans; the cheap model resumes with the advice. The advisor writes no code and runs no tools, so its share of the bill stays small.

Escalation can be automatic (instruct the agent to ask for help when stuck) or manual (you spot the thrashing and bring in the stronger model yourself).

Same economics as a senior engineer on call. You don't have them type everything; you make them easy to ask.

Anthropic's numbers: Sonnet 4.6 with an Opus advisor gained 2.7 points on SWE-bench Multilingual over Sonnet alone and cost 11.9% less per task, because an advisor's plan runs 400–700 tokens while the executor produces everything else at its own cheaper rate. Haiku 4.5 with the same advisor more than doubled its BrowseComp score, 19.7% to 41.2%. That still trails Sonnet working alone, but at 85% less cost per task.

Smart Plan, Cheap Execution is the mirror image: the smart model leads from the start instead of waiting to be asked.

## Example
Sonnet implements a database migration. After the second failed attempt on the same test, it spawns a subagent on the strongest model with the diff, the error, and "what am I missing?" The advisor spots the wrong assumption, an ORM lifecycle detail, and Sonnet applies the correction and finishes.

In Claude Code, subagents can run a different model than the main loop, so this works in both directions: a cheap main loop escalating to a smart subagent, or cheap workers under a smart orchestrator.
