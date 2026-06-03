---
authors: [lada_kesseler]
---

# External Context

## Problem
Both context size and attention are finite; everything in the context competes for it.
Spin up a search, chase a bug, read a giant file — and the raw byproducts pile into the same thread as your main work, until it's bloated, unfocused, and rotting.

## Pattern
Move a distinct piece of work into its own agent — it runs in a separate context and hands back only the result.

Like delegating to a teammate: they do the legwork and report back a summary, not their whole day.

Both sides get sharper:
- The main thread stays clean — the sub-task's noise never enters it
- The sub-task gets its own window — full focus on a single goal

Different implementations of this idea: a sub-agent, a parallel session, or a remote agent.

## Example
- Web research — an agent runs a bunch of searches and brings back the answer, not the pages.
- Find code — an agent searches a big repo and comes back with the few files that matter.
- Build a feature — a side agent builds it with TDD while your main agent holds the plan and reviews what comes back.
- Fix a bug — hand a failing case to a separate agent; it works it out and returns the fix while your main thread keeps going.

