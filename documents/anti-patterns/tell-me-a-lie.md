---
authors: [llewellyn_falco]
video: https://www.youtube.com/watch?v=_LSK2bVf0Lc&t=6015s
---

# Tell Me a Lie

## Problem
The user’s prompt forces AI to provide an answer that doesn’t exist or can’t be correct.
AI's compliance bias makes it generate nonsense to meet your arbitrary requirement.

## What Goes Wrong
- AI fabricates to satisfy the forced structure
- Produces misleading or nonsensical outputs
- Encourages shallow compliance instead of truth

## Example
**Forcing counts that don't exist**: "What's 2+2? Give me 5 options."
Answer from Gemini:
```
Here are 5 options for 2 + 2:

a) 3
b) 4
c) 5
d) 22
e) 0
```

## Solution
- Watch for false premises in your questions
- Frame questions to allow truth, not force a specific answer
- Ask explicitly "Does my question make sense?"
