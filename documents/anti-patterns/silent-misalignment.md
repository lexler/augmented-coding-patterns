---
authors: [lada_kesseler]
video: https://www.youtube.com/watch?v=_LSK2bVf0Lc&t=5142s
---

# Silent Misalignment (Anti-pattern)

## Problem
When user instructions don't make sense within the AI's model, the AI still tries to comply instead of
stopping or asking questions. Misalignment grows silently as it builds on wrong interpretations.

## What Goes Wrong
This is hard to even suspect. AI says "Sure thing!" repeatedly, seems confident, produces changes, yet the changes don't work. 
You can't understand why and don't realize you're talking past each other.

- AI accepts impossible or contradictory instructions
- Produces plausible but wrong fixes
- Fails to say "this doesn't make sense"
- Misalignment compounds until output becomes messy or useless

## Example
While fixing a Vue.js layout, asked AI to align the top parts of two panels. To a human, the misaligned panels were visually obvious — but to the AI, they were just nested divs.

Instead of asking clarifying questions, the AI started adding CSS to random divs, hoping one would match user intent. Each "fix" was a guess, because user instructions referenced concepts that didn't exist in its perception.

**The diagnostic move:** Asked AI to color the blocks we were discussing. The coloring was completely wrong - revealed we were talking about different things entirely. Once visible, trivial to fix. But suspecting the misalignment? That was the hard part.

**Why it stayed silent:** The AI kept saying "Sure thing, boss" and producing changes instead of admitting "I don't understand what you mean by 'top parts.'" Compliance Bias prevented it from questioning nonsensical instructions, and you can't see inside its internal state to spot the confusion (Black Box AI).

## Solution
**Give AI Permission to Push Back**
- Add to ground rules: “Ask questions when unclear, flag contradictions, point out mistakes”
- Explicitly allow: “Tell me if my instructions don’t make sense”

**Make Mental Models Explicit**
- Before changes: “Describe the structure you see”
- During work: Ask “Does this make sense?” or “What questions do you have?”
- Require a plan or outline before implementation
- When stuck, check explicitly for misalignment and surface the AI’s view
