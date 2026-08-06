---
authors: [ivett_ordog]
---

# Phased Delivery

## Problem
A big task in a single session leads to a distracted agent. This in turn leads to incomplete work, bugs, and a lack of feedback. One fix to this is the Chain of small steps pattern, but it requires an active human in the loop. In situations when the goal is clear this is not the most effective way to deliver.  

## Pattern

Key constraint: for this pattern to work the goal has to be unambiguously verifiable. Works best when the desired end state is provided rather than the roadmap to get there. 

A special case of Background Agent: structure the run into phases, each with its own focus and its own gate:

1. **Plan** — produce the plan and acceptance criteria; checkpoint it
2. **Implement** — one phase of the plan at a time
3. **Review** — a separate reviewer pass judges the result against your principles and the phase's acceptance gate. Fail → back to Implement with the feedback. Repeat until it passes. 
4. **Goal check** — a separate agent compares the delivered branch with the goal, and marks any gaps in the original plan. If those gaps exist it re-plans and returns to step 2. 
5. **Rebase** — rewrite the working history into clean, atomic commits before handing over

Notice that this pattern implements an agile team's sprint at the agent level. Critics may call out the lack of feedback, but the feedback is still there at a granular level, it's just shifted to the AI. 

The other reason this works is because of focus (see Focused Agent and Feedback Flip): an implementer and a reviewer see different things, even on the same model. 

The final rebase converts "how the agent got there" into "what a human should review", one atomic commit at a time.

## Example

This technique has been used in various contexts effectively:
- Porting legacy applications (for example COBOL financial systems) to modern languages
- Implementing systems that need to follow clear regulatory guidelines. 
- Turning vibe coded prototypes into production ready systems (mostly for startups)
- Migration projects that swap one technology for another (i.e. migrate from Angular to React)