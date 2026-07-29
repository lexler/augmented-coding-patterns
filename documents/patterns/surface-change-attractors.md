---
authors: [ivett_ordog]
alternative_titles: ["Hotspot Analysis"]
---

# Surface Change Attractors

## Problem
Architectural problems hide as churn. Some files attract every change; some files always change together even though the module structure claims they're independent. Humans normalize this friction. Agents suffer it too: hot files get re-read into context constantly, and edits concentrate exactly where the conflicts and bugs live. None of this is visible by reading the code — the structure looks fine; only the history shows the problem.

## Pattern
Mine version control for behavioral signals (Adam Tornhill-style analysis):

- **Hotspots**: change frequency × complexity — files that are both churned and complicated
- **Change coupling**: files that repeatedly change in the same commits despite no visible dependency

Then hand the findings to the agent as design constraints, not just data:

- "These five files change together in most commits — propose a redesign that lets them change independently"
- "This file is touched by every feature — split it along its reasons to change"

Refactor incrementally toward the proposed design.

Canary in the Code Mine reads the AI's live struggle as the quality signal; Surface Change Attractors finds the same signal in your version history — before the struggle happens.

## Example
A script over `git log` counts per-file commit frequency and co-change pairs (code-maat and CodeScene do this out of the box — or Offload Deterministic: have the agent write the script). The top attractor is a 900-line "service" touched in 70% of commits, co-changing with a validator and a serializer in two other modules. Given those constraints, the agent proposes moving validation and serialization behind the service's interface. After the refactor, features stop fanning out across three modules.
