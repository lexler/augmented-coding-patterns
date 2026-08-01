---
authors: [ivett_ordog]
alternative_titles: ["Hotspot Analysis"]
---

# Surface Change Attractors

## Problem
Architectural problems hide as churn. Some files attract every change; some always change together even though the module structure claims they're independent. Humans normalize this friction. Agents pay for it too: hot files get re-read into context constantly, and edits concentrate exactly where the conflicts and bugs live. The structure looks fine; only the history shows the problem.

## Pattern
Mine version control for behavioral signals (Adam Tornhill-style analysis):

- **Hotspots**: change frequency × complexity — files that are both churned and complicated
- **Change coupling**: files that repeatedly change in the same commits despite no visible dependency

Hand the findings to the agent as design constraints:

- "These five files change together in most commits — propose a redesign that lets them change independently"
- "This file is touched by every feature — split it along its reasons to change"

Refactor incrementally toward the proposed design.

The metrics nominate candidates, they never decide. Churn says where change lands, the code says why — read every candidate before acting on it.

Canary in the Code Mine reads the agent's live struggle; Surface Change Attractors finds the same signal in your history, before the struggle.

An open-source implementation is available at https://github.com/devill/ivetts-skills#hotspot-rec

![Temporal coupling map: every line joins two files that changed in the same commit, drawn over the package map](/images/example-coupling-map.svg)

*Circles are files, sized by lines and colored by commits; outlined circles are packages. Orange dashed lines join files that change together across a package boundary — co-change the architecture says should not happen.*

## Example
A script over `git log` counts per-file commit frequency and co-change pairs (code-maat and CodeScene do this out of the box — or Offload Deterministic: have the agent write the script). The top attractor is a 900-line "service" touched in 70% of commits, co-changing with a validator and a serializer in two other modules. Given those constraints, the agent proposes moving validation and serialization behind the service's interface. After the refactor, features stop fanning out across three modules.
