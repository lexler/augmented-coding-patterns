---
authors: [lada_kesseler]
video: https://www.youtube.com/watch?v=_LSK2bVf0Lc&t=2671s
---

# Parallel Implementations

## Problem
AI is non-deterministic - like rolling dice. You want a three, but probably won't get it on the first try.

What do you do? Roll five dice.

## Pattern
Run multiple implementations in parallel from the same checkpoint:

1. Create checkpoint (save plan + git commit)
2. Fork into parallel working directories (use git worktrees or similar)
3. Launch multiple AI implementations simultaneously
4. Review all results
5. Pick the best or combine elements from multiple attempts

This is trading tokens (relatively cheap) for your time (expensive).

Two complementary modes:
- **Failure Mitigation**: Complex feature, uncertain approach. Run 3-5 parallel attempts. Some fail, some succeed. You move forward immediately instead of debugging sequential failures.
- **Exploration of the Solution Space**: When quality matters more than speed. Generate multiple working versions, compare approaches, combine the best ideas. Works especially well for creative work: UIs, game mechanics, designs.

## Examples

**Game development (Ricochet Robot):**
Ran three parallel implementations. First version: no walls, robot didn't move - total failure. Second: mediocre. Third: movement logic worked great, loved the button styling. Combined the working movement with the better buttons.

**UI design:**
Run several parallel implementations. One has great layout, another has clever responsive breakpoints, third has interesting  color scheme. Borrow the best from each, combine into richer final design.

**Designer collaboration:**
Designer creates mockup in Figma separately. Run parallel AI implementations. Combine designer's vision with AI's working implementations.
