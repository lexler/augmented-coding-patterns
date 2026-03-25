---
authors: [rdmueller]
---

# Semantic Anchors

## Problem
LLMs interpret vague descriptions inconsistently. "Write isolated tests with mocks" can mean different things to different models. Long, detailed prompts that try to nail down every aspect are fragile and expensive.

## Pattern
Use established domain terms that are well-represented in training data. These terms act as compact references that activate rich knowledge the model already has.

A single well-chosen term like "TDD, London School" activates a specific, stable methodology more reliably than a paragraph explaining the same concept. The model has encountered this term thousands of times during training and associates it with a coherent set of practices.

Pick terms that are: widely used in the field, unambiguous in meaning, and well-documented in public sources. The more canonical the term, the stronger and more consistent the anchor.

## Example
Instead of:
> "Write tests that isolate the unit under test by replacing dependencies with test doubles, testing behavior rather than implementation, working from the outside in"

Say:
> "TDD, London School"

The model activates the correct methodology without ambiguity.

More info: https://llm-coding.github.io/Semantic-Anchors/
