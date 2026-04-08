---
authors: [ivett_ordog]
video: https://www.youtube.com/watch?v=GyI5qU9MNJU&t=1578s
---

# Constrained Tests

## Problem
Code coverage is easy to cheat. Tests can execute code without assertions, making coverage an unreliable quality metric. In general, ensuring test validity is impossible, but for specific subsystems in constrained domains, you can design tests that guarantee validity.

## Pattern
Create a domain-specific language for testing that makes it impossible to write tests without sufficient assertions.

Use external DSLs (data files with custom parsers) rather than internal DSLs (fluent APIs). External DSLs make it easier to enforce required components - the parser can reject incomplete test specifications.

Structure the DSL to combine:
- Input specification
- Expected outcomes
- Validation rules

When tests are constrained this way, code coverage becomes a reliable measure of test suite quality.

Implementation typically uses data providers where the external DSL drives a single test function that:
1. Parses the DSL file
2. Executes the system under test
3. Validates outputs match the DSL specification

## Example

Two implementations of this pattern optimize for different goals:

**Approved Scenarios** uses domain-specific formats optimized for easy validation. Even non-experts can review and verify correctness at a glance.

**Approved Logs** captures production logs and turns them into regression tests immediately. Optimizes for bug reproduction speed over readability.
