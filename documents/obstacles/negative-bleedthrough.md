---
authors: [juanmichelini]
---

# Negative Bleedthrough (Obstacle)

## Description
When you tell an LLM what *not* to do, you're activating the very tokens you want it to avoid. Negation words like "don't", "not", "never" are weak signals compared to the content words around them. The model processes "don't mention the moon" by first attending heavily to "moon" : and now the moon is in the room.

This is well-documented in NLP research. Studies on negation handling in transformer models (e.g., [Kassner & Schütze, 2020](https://aclanthology.org/2020.acl-main.698/) : *Negated and Misprimed Probes for Pretrained Language Models*) show that LLMs struggle to distinguish negated statements from affirmative ones. The model's internal representations for "the moon is a planet" and "the moon is not a planet" are surprisingly similar.

**Example: "List the traditional planets, but not the moon."**

The model sees heavy token activation around "planets" and "moon." The negation "not" is a lightweight modifier that often loses the fight. You'll frequently get the moon in the list anyway.

This isn't just a text problem. Vision models show the same behavior : ask for "a room with no elephants" and you'll likely get elephants. The underlying mechanism is the same: describing what to avoid activates representations of that thing.

## Root Causes

### Token activation doesn't respect negation
Transformers build meaning by attending to content words. "Not" modifies the intent, but the attention still flows to whatever follows it. By the time the model is generating output, the activated concept is competing with the instruction to suppress it.

### Training data reinforcement
Most training examples of "X is not Y" still associate X and Y. The model learns co-occurrence patterns, not logical negation. So "planets, not the moon" reinforces the planet–moon association.

## Impact
- Negative instructions increase the chance of getting exactly what you asked to avoid
- More negations in a prompt means more unwanted concepts activated in context
- Workarounds like repeating "do NOT" or using caps don't fix the underlying mechanism : they just add more tokens that activate the concept
