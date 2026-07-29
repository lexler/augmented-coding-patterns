---
authors: [ivett_ordog]
---

# Speak to Me

## Problem
You hand the agent a longer task and turn to something else. Watching the terminal defeats the purpose of delegating — but ignoring it means you discover problems late and miss the moments where a quick answer from you would unblock it.

## Pattern
Ask the agent to speak short progress updates out loud as it works, using a text-to-speech command (`say` on macOS). One short sentence per update: milestones reached, direction changes, blockers, questions for you.

Voice becomes an ambient status channel: you follow the work without looking at it, and it claims your attention only when something actually needs it.

Where Mind Dump uses voice as the input channel, Speak to Me uses it as the output channel.

## Example
Add to the prompt or ground rules: "While working, announce your progress with the `say` command — one short sentence per milestone or blocker."

You review another PR or cook dinner. In the background you hear: "Tests are green, starting the refactor." … "The migration is failing, I need your input." You come back exactly when you're needed — not before, not too late.

A narrower variant appears in the Ground Rules example: "use ./speak.sh to talk to me out loud when you warn me about issues" — voice reserved for warnings only.
