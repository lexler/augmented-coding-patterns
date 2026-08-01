---
authors: [lada_kesseler]
video: https://www.youtube.com/watch?v=_LSK2bVf0Lc&t=3345s
---

# Unvalidated Leaps

## Problem
AI gets stuck because it's building on unverified assumptions about the code.
- Assumes functions return X when they return Y
- Misinterprets errors based on a wrong mental model
- Each assumption becomes a foundation for the next wrong step

This is a human problem too - when you can't run code frequently but keep writing it, you make assumption chains. AI does the same.

## What Goes Wrong
AI gets stuck spinning:
- Checks step A, step C, step V
- Misses the wrong assumption at step B
- Every "fix" builds on that wrong foundation

## Solution
- When AI gets stuck, stop it and tell it to validate each step incrementally
- Use TDD to create automatic micro-feedback loops that catch drift early. Try Predictive TDD - AI predicts test outcomes, gets surprised when wrong (like humans do), immediately corrects its mental model

The key: frequent reality checks prevent assumption chains. Code's self-verifiable nature makes this possible in ways that wouldn't work for general facts.

## Example

**AppleScript debugging:**
AI kept adjusting patterns, tweaking parsing, trimming whitespace - all based on one hidden assumption: AppleScript's `log` returns the session IDs.

Wrong. `log` prints descriptions, doesn't return values. Needed `return` instead. Because it never validated that first step, every downstream fix was wasted effort.

Asked "check each command step by step" - it isolated the AppleScript call, validated output, saw the real problem. Fix was trivial once the base assumption was checked.

**This happens with humans too:**
Early in my career, paired with someone who wrote PL/SQL for three hours without running it once. So many unvalidated assumptions. When we finally ran it, it didn't even compile.