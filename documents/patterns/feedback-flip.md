---
authors: [lada_kesseler]
synonyms: [Adversarial Review, Evaluator-Optimizer]
---

# Feedback Flip

## Problem
AI focused on implementing is often unable to keep everything you're asking it to do in parallel in focus and give it equal priority.
So code quality and other potential considerations don't get enough attention and suffer as a result.

The First output is rarely optimal, but you don't have to limit yourself to the first output.

## Pattern
Flip from producing to evaluating:

1. AI implements the task
2. Different AI (or same AI, refocused): Gets task + code diff → "Find problems and suggest improvements"
3. Feed critique back to original AI to fix

**Variations:**
- Different models, different windows (most variety)
- Same model, different windows (very effective)
- Same model, same window (just shift the focus)

**Before human review:** Do this before PR/code review - catches obvious issues so humans start from better ground.

## Why This Works
When implementing, AI seems to be hyper-focusing on getting the goal completed, and the main goal to it is usually implementing the feature asked of it. 
Quality takes lower precedence and suffers.

Flip the focus to finding problems; now quality is the main goal. AI sees issues it couldn't see before because you've shifted what it's focused on. Even the same AI in the next prompt.

We're shifting its focus to a new goal, and making it what is important to us its main priority for one of the iterations.

## Example
AI implements authentication. Focused on making it work.

Flip: Second AI gets task + diff, finds a lot of issues with implementation.

Give feedback to the first AI again, it fixes → code ready for human review.
