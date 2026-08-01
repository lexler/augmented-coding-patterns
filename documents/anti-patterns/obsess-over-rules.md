---
authors: [gregor_riegler]
---

# Obsess Over Rules

## Problem
Trying to generate the perfect output by adding more and more rules to the context.

## What Goes Wrong
- The more rules you add, the more they will be ignored due to Limited Focus.
- Lots of rules lead to a big initial context and Context Rot, harming the quality of the output.

## Example
Software design is a complex, creative activity that requires deep knowledge, experience, and judgment.
When we work with agents, we naturally want it to produce a design to our liking.
So we keep adding rules, hoping they will steer the agent in the right direction.
But as we add more and more rules, the ruleset becomes so complicated and intertwined that the agent will start ignoring some of them.

## Solution

Use Focused Agents that focus on a smaller scope and thus need fewer rules.
Use a Refinement Loop to iterate over the imperfect output and improve it to your liking.
