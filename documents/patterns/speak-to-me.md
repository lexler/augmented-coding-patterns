---
authors: [ivett_ordog]
---

# Speak to Me

## Problem
You hand the agent a longer task and turn to something else. Watching the terminal defeats the purpose of delegating — but ignoring it means you discover problems late and miss the moments where a quick answer from you would unblock it.

## Pattern
Ask the agent to speak short progress updates out loud as it works, using a text-to-speech command (`say` on macOS). One short sentence per update: milestones reached, direction changes, blockers, questions for you.

Voice becomes an ambient status channel: you follow the work without looking at it, and it claims your attention only when something actually needs it.

## Example
Add to the prompt or ground rules: "While working on long tasks, use the `say` command to get my attention. Use it when you hit a blocker, change direction or reach a major milestone. Keep the announcements short, fewer than 10 words."

You review another PR or cook dinner. In the background you hear: "Tests are green, starting the refactor." … "The migration is failing, I need your input." You come back exactly when you're needed — not before, not too late.
