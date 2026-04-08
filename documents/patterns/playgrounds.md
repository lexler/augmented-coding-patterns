---
authors: [lada_kesseler]
video: https://www.youtube.com/watch?v=_LSK2bVf0Lc&t=3135s
---

# Playgrounds

## Problem
Need a safe space for AI to experiment, test assumptions, and explore libraries without affecting production code or committing throwaway experiments.

## Pattern
Allow it to experiment when it gets stuck.

For example, create an isolated playground folder (can make it .gitignored) where AI can:
- Test library behaviors and discover constraints
- Validate assumptions about APIs
- Try different approaches without consequences
- Build proof-of-concepts before real implementation and gain valuable learning

When AI gets stuck or when working with new libraries or uncommon languages:
- Pull back from complex debugging
- Have AI experiment in playground
- Test assumptions directly
- Discover library constraints quickly

## Example
Building chess app, nothing working. Instead of debugging through UI → components → chess.js integration, stopped and had AI write playground script to test chess.js directly.

Quickly discovered: chess.js requires kings on board. Would have taken much longer debugging from the top down.
