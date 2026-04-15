---
authors: [gregor_riegler]
related_patterns:
  - semantic-anchors
  - extract-knowledge
related_obstacles:
  - limited-context-window
  - hallucinations
---

# Poor Person's Skill

## Problem
You're about to work on a topic the agent has plenty of training knowledge about, but none of it is active in the current context. And you don't have a skill or knowledge document at hand. Without priming, the agent produces generic output and you only discover the gaps by correcting them mid-task.

## Pattern
Before giving the real instruction, ask the agent an open question: *"What do you already know about X?"*

The answer itself is secondary. The point is that the agent's summary now sits in the context window, shaping everything that follows. You get most of the value of a dedicated skill file at the cost of one question — and you can see what the agent *thinks* it knows, so you can correct or supplement before the work starts.

Use it when:
- The topic is well-represented in training data (frameworks, methodologies, known libraries)
- The task is too small to justify a written skill or reference doc
- You want a sanity check on the agent's baseline understanding before committing to an approach

## Example
Before asking the agent to break a feature into a first slice:

> What do I have to care about when doing vertical slicing?

Or:

> What is important for doing vertical slicing?

The agent surfaces the usual concerns: keeping slices end-to-end, avoiding horizontal layers, picking the thinnest valuable path, deferring edge cases. Now when you ask it to propose a first slice, it draws on that surfaced knowledge instead of guessing. If the recall is wrong or thin, you've caught it before it shaped the work.
