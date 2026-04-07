---
authors: [juan_michelini]
---

# Point the Target

## Problem
Negative instructions activate the very concepts you're trying to avoid (see: negative-bleedthrough). Telling a model "don't include X" puts X front and center in its attention.

Consider listing the traditional planets but not the moon:

- ❌ **"List traditional planets but not the moon."** : Fails. "Moon" gets activated and often leaks into the output.
- ⚠️ **"List traditional planets but not the moon. No extra words, just the list."** : Sometimes works, but it has over-constrained the format just to suppress one concept. Maybe you were fine with commentary.
- ✅ **"List visible planets from Earth and add the Sun."** : Same specificity as the first prompt but no negation. Doesn't fail.

The second one is the most specific, but it also overconstrains the solution space. Plus you are increasing the negated context.

## Pattern
Replace negative instructions with positive descriptions of the target. Reframe the request so the unwanted concept never enters the context.

**Transform the framing, not the detail level:**
- "Don't use global variables" → "Use local variables and parameter passing"
- "Don't make it complex" → "Keep it focused on a single responsibility"
- "Don't write verbose code" → "Write concise, minimal code"
- "Don't use deprecated APIs" → "Use current APIs and modern idioms"

## Example

**Instead of:**
```
"Build a REST API. Don't use callbacks, don't nest routes deeply,
and don't put business logic in controllers."
```

**Use:**
```
"Build a REST API using async/await, flat route structure,
and a service layer for business logic."
```

Same constraint but no negation. The model never activates the concepts you wanted to avoid.

## How is this different from "be specific"?
Being specific means adding detail. Pointing the target means *choosing which concepts to activate*. Trying to solve negative-bleedthrough with specificity usually increases the number of negations and overconstrains the solution space.
