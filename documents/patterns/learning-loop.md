---
authors: [ivett_ordog]
---

# Learning Loop

## Problem
The model cannot learn, so anything a session taught you evaporates when it ends. Extract Knowledge captures insights when you notice them — but noticing in the moment is unreliable, and nothing connects the dots across sessions to reveal recurring problems.

## Pattern
Make capture a ritual instead of an accident:

1. **End every session with a learning pass**: the agent reflects on the session — corrections you made, surprises, gotchas, things you had to repeat
2. **Categorize and route** each learning to the right durable store:
   - behavioral rules → ground rules
   - project facts → knowledge and reference docs
   - recurring quality corrections → habit hooks
   - repeated processes → a skill or automation
3. **You approve the routing** — the agent proposes, you decide
4. **Advanced**: also append a dated entry to a session log. Periodically have the agent read the accumulated log and surface recurring issues that deserve promotion into stronger mechanisms

This closes the self-improvement loop: sessions generate learnings, learnings harden into mechanisms, mechanisms improve every future session. It ties the other knowledge patterns together into a genuinely self-improving system.

## Example
A `/learn` command runs at session end and proposes: "you corrected mock-heavy tests twice → habit hook candidate; the deploy needs the VPN → project ground rules; the release process we walked through → new skill."

A `/remember` variant first appends the session to a log, then reflects across the whole log. After a few sessions it notices the same flaky-test complaint keeps recurring — and suggests fixing the root cause instead of re-learning the workaround every session.
