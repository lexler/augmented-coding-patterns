---
authors: [lada_kesseler]
video: https://www.youtube.com/watch?v=_LSK2bVf0Lc&t=975s
---

# Focused Agent

## Problem
LLMs have limited attention. The more you ask an agent to handle, the worse it performs at everything - even following explicit ground rules.

## Pattern
Prefer single, narrow responsibility on important tasks.

This gives the AI cognitive space to:
- Actually follow your ground rules
- Pay attention to details that matter for that specific task
- Perform at its best instead of spreading thin

## Example
Dedicated committer agent - only writes commit messages. Immediately caught naming convention violations and accidental node_modules commits.

Main development agent with identical ground rules and same model never caught these issues. Its attention was diluted across coding, debugging, architecture decisions The focused committer could dedicate all its attention to commit quality.

Small, focused agents > large, scattered agents.