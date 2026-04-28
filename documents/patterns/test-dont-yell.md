---
authors: [emmanuel_lin_toulemonde]
---

# Test, Don't Yell

## Problem

Emphatic instructions ("NEVER do X", "ALWAYS follow Y", "ABSOLUTELY respect this") are unreliable — AI ignores them over long sessions, forgets them as context grows, or complies superficially. Stronger rules don't improve reliability; they just consume context.

## Pattern

Replace emphatic instructions with automated tests or linters AI can run to verify its own output. Instead of telling AI what to do, give it a way to *check* that it did it.

This turns a subjective instruction into a deterministic assertion. AI gets concrete, unambiguous feedback (pass or fail) without relying on memory or interpretation of rules.

**AI can write these checks itself.** Describe the constraint, ask AI to implement the validation. Once implemented, verify it passes on correct code and fails when a violation is introduced. The test suite becomes the living specification.

For every standard or architecture decision, ask: can this be expressed as an automatic validation?

## Example

**Cloud resource name length** — instead of writing `Cloud resource names must be shorter than 63 characters`, add a test that validates all declared resource names. AI runs it and gets a clear failure with the offending name.

Other applications:
- `Every data product must have a valid data contract` → A test that checks the contract file exists and matches the expected schema.
- `Always follow this architecture pattern` → An import linter that verifies dependencies only flow in the allowed direction.
- `Database migrations must be reversible` → A test that runs each migration up then down and checks the schema is unchanged.
