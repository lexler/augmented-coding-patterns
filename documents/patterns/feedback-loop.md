---
authors: [nitsan_avni]
---

# Feedback Loop

Closely related: ["Engineer the Harness"](https://mitchellh.com/writing/my-ai-adoption-journey#step-5-engineer-the-harness)

## Pattern
Set up automated feedback, give AI permission to iterate autonomously until a goal is reached.

1. Identify a clear success signal (tests pass, UI matches design, coverage hits X%)
2. Give AI access to that signal (tests, devtools, linter, logs)
3. Grant explicit permission: "Keep iterating until tests pass"
4. Step away - AI checks its own work and keeps refining

Human elevates from tactical executor to strategic director.

## Example

**Bug fix with DevTools MCP:**
- Goal: Fix layout bug in web app
- Signal: DevTools screenshots showing the visual issue
- Setup: Point AI to devtools
- Permission: "Keep trying until the layout matches the design"
- AI iterates: change code → check screenshot → adjust → repeat

**Debugging with console logs:**
- Goal: Understand why feature behaves incorrectly
- Signal: Console output showing timing, state, assumptions
- Setup: "Add console.log to help yourself understand what's wrong"
- Permission: "Debug this until you find the root cause"
- AI iterates: add logs → run → validate assumptions → adjust → repeat

**Getting tests to pass:**
- Goal: All tests green
- Signal: Test runner output
- Permission: "Fix the failing tests, keep running them until they all pass"
- AI iterates: read failure → fix code → run tests → repeat

**CI monitoring:**
- Goal: Green CI build
- Signal: Direct access to CI state/logs (e.g., via `gh` CLI)
- Permission: "Monitor CI and fix issues until build passes"
- AI iterates: check status → read logs → fix → push → check again
