---
authors: [rdmueller]
---

# Semantic Anchors

Names beat descriptions. Always.

Related: [Semantic Anchors Catalog](https://llm-coding.github.io/Semantic-Anchors/)

## Problem
LLMs interpret vague descriptions inconsistently. "Write isolated tests with mocks" can mean different things to different models, different runs, different contexts. Long, detailed prompts that try to nail down every aspect are fragile, expensive, and still ambiguous.

## Pattern
Use established domain terms that are well-represented in training data. A single well-chosen term activates a specific, stable methodology more reliably than a paragraph explaining the same concept.

"TDD, London School" works because the model has encountered this term thousands of times during training. It associates the term with a coherent set of practices: outside-in, behavior-focused, mock-heavy. You get all of that for three words.

Pick terms that are: widely used in the field, unambiguous in meaning, and well-documented in public sources. The more canonical the term, the stronger the anchor.

We tested this systematically: 63 anchors, 193 multiple-choice questions, 3 models. Claude Sonnet: 99%, GPT-4o: 97%, Mistral Large: 96%. When we described the Feynman Technique without naming it, Claude and GPT-4o both dropped to 0%. The name activates knowledge that a paraphrase does not.

## Example

Instead of:
```
Write tests that isolate the unit under test by replacing
dependencies with test doubles, testing behavior rather
than implementation, working from the outside in
```

Say:
```
TDD, London School
```

Instead of:
```
Document the system using a template that covers context,
building blocks, runtime scenarios, deployment, and
cross-cutting concepts
```

Say:
```
arc42
```

The model activates the correct methodology without ambiguity. Fewer tokens, more precise results.