---
authors: [rdmueller]
---

# Architecture as Documentation

## Problem
AI-generated code has no architecture documentation. Teams review generated code line by line, which doesn't scale. When an agent generates 10,000 lines in an afternoon, nobody can review that properly.

## Pattern
Have the coding agent generate structured architecture documentation alongside the code. Review the architecture instead of the code.

Use an established format like arc42. The building block view shows structural problems. Architecture decisions capture reasoning. The runtime view shows component interactions. The agent knows *why* it wrote what it wrote, so the generated documentation carries the "why", not just the "what".

This turns code review from "read every line" into "check the architecture, spot-check the code."

## Example
After generating a feature, the agent also produces an arc42 document with building block view, architecture decisions, and runtime scenarios. The architect reviews this document.

"Did the agent create a second database connection pool because it didn't know about the first one?" is visible in the building block view in seconds, not by reading 47 source files.
