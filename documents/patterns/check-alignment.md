---
authors: [lada_kesseler]
video: https://www.youtube.com/watch?v=_LSK2bVf0Lc&t=5448s
---

# Check Alignment

## Problem
Misalignment between your understanding and AI's only reveals itself after implementation, wasting time on wrong solutions.

## Pattern
Before letting AI implement, make it show its understanding:
- "Tell me what you're going to do before you do it"
- "Show me your plan" or "Draw an architecture diagram"
- "What questions do you have?" (not "ask me 3 questions" - let it surface real confusion)
- "What are you trying to achieve?"

Force it to be very succinct - makes what it tells you scannable.

**Why this works:**
When you see something, you immediately spot what needs adjusting. Catch it early, adjust before implementation starts - not after wasting time going the wrong direction.

## Example
Before refactoring: "Show me how you understand the current architecture and what you plan to change, succinctly"

AI draws diagram, reveals it misunderstood service boundaries. Corrected before any code was written - saved an hour of going in wrong direction.