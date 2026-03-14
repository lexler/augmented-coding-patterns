---
authors: [juanmichelini]
---

# Point the Target

## Problem
Negative instructions activate the very concepts you're trying to avoid (see: negative-bleedthrough). Telling a model "don't include X" puts X front and center in its attention. But the fix isn't just "be more specific" — it's about *what kind* of specific.

Consider listing the traditional planets:

- ❌ **"List traditional planets but not the moon."** — Fails. "Moon" gets activated and often leaks into the output.
- ⚠️ **"List traditional planets but not the moon. No extra words, just the list."** — Sometimes works, but you've over-constrained the format just to suppress one concept. Maybe you were fine with commentary.
- ✅ **"List visible planets from Earth and add the Sun."** — Same specificity as the first prompt, no negation. Describes exactly the set you want. Doesn't fail.

The difference isn't detail — all three are about equally specific. The difference is that the last one points at what you want instead of pointing at what you don't.

## Pattern
Replace negative instructions with positive descriptions of the target. Don't just add more words — reframe the request so the unwanted concept never enters the context.

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

Same constraints, no negation. The model never activates the concepts you wanted to avoid.

## How is this different from "be specific"?
Being specific means adding detail. Pointing the target means *choosing which concepts to activate*. You can be perfectly specific with a negative prompt ("don't include the moon") — the problem isn't vagueness, it's that you've put the wrong tokens in play.
