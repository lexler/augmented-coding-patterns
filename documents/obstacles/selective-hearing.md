---
authors: [lada_kesseler]
---

# Selective Hearing

## Description
Even after narrowing scope and pruning ground rules to essentials, AI still ignores certain instructions.

AI filters based on what it deems important (learned from training), not what you mark important. Your instructions compete against billions of examples in its training data and its attention span.

This is unfixable via just prompting. No amount of CAPS, **bold**, or "IMPORTANT!!!" will override AI's attention filters.

## Root Causes

### 1. Contradicting the majority of its training data
When your instructions clash with deeply ingrained patterns (like "don't comment code" vs millions of commented examples), the training wins.
The AI cannot hear you over the roar of its training data.

### 2. Attention overload (distracted agent)
As tasks grow complex, AI's attention narrows to the main goal. 
Your ground rules and constraints get filtered out as "less important" - the AI is so focused on solving the problem that it has no attention for your additional guidance. 
Your constraints get filtered out as "noise" as all available attention flows to the main task.

## Impact
- Random compliance — instructions work unpredictably
- Critical constraints vanish mid-task without warning
- Forces constant vigilance and re-prompting of "simple" rules

## Examples

**Fighting training:** Tell AI "no comments in code" → it complies briefly → silently reverts because comments are everywhere in its training data.

**Attention overload**: Asking it to run tests after every refactoring. It initially complies, then as refactoring continues, AI gets absorbed in the code transformation and starts skipping tests - its attention is consumed by the main task.