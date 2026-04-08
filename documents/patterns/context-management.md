---
authors: [lada_kesseler]
video: https://www.youtube.com/watch?v=_LSK2bVf0Lc&t=352s
---

# Context Management

## Problem
AI has no persistent memory and context degrades over time.

## Pattern
Treat context as a scarce, degrading resource that requires active management.
You have only two operations: **append to context** (prompt it) and **reset it** (start a new conversation). Everything you do with AI works within this constraint.