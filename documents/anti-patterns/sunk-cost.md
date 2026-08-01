---
authors: [ivett_ordog]
---

# Sunk Cost

## Problem
You're multiple iterations into asking an AI to accomplish a task, but it keeps failing to deliver what you need. Despite repeated attempts, the AI either can't understand the requirement or produces increasingly problematic solutions.

## What Goes Wrong
Continuing to push the AI beyond the point where it makes sense wastes time and degrades quality:
- Time wasted on increasingly degraded attempts
- AI compounds errors trying to patch over previous mistakes
- You lose trust in the AI's work quality
- The code becomes messier with each iteration

This parallels the sunk cost fallacy in human decision-making: we feel uncomfortable accepting the time already invested and keep pushing beyond the point where starting fresh would be more efficient. This tendency intensifies when under time pressure, making it tempting to "hit the agent with a stick until it complies."

## Example

**Fundamental misunderstanding**: AI's first attempt shows it misunderstood the core requirement and produces something far from the desired outcome. Rather than reverting, you keep prompting for adjustments that never address the root issue.

**Iterative degradation**: AI fixes one bug but introduces another. You ask for a fix. It patches that but breaks something else. By the fourth or fifth iteration, the code is worse than when you started, yet you continue pushing for one more fix.

Common root causes include:
- Answer injection is leading the AI down the wrong path
- Tell me a lie pattern where AI fabricates plausible-sounding but incorrect fixes
- Code complexity exceeding the agent's effective context window

## Solution
Recognize when you've hit diminishing returns (typically by iteration 3-4) and switch strategies:
- Use **Parallel Implementations**: Start fresh conversations with different approaches
- Apply **Happy to Delete**: Treat the attempt as disposable exploration, discard it, and begin again with lessons learned
- Break the problem into smaller pieces that fit the AI's capabilities
- Step back and verify you haven't triggered Answer Injection or Tell Me a Lie anti-patterns

