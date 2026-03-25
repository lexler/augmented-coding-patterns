---
authors: [rdmueller]
related_patterns:
  - knowledge-document
  - text-native
  - semantic-anchors
  - feedback-loop
---

# Architecture as Documentation

Stop reading generated code. Read the architecture.

## Problem
AI-generated code has no architecture documentation. Teams review generated code line by line, which doesn't scale. A coding agent generates 10,000 lines in an afternoon. Nobody reviews that properly. And even if they try, reading code shows you the "what" but not the "why."

## Pattern
Have the coding agent generate structured architecture documentation alongside the code. Review the architecture instead of reviewing the code.

Use an established template like [arc42](https://arc42.org). The building block view shows structural problems. Architecture decisions capture reasoning. The runtime view shows how components interact. The agent knows *why* it wrote what it wrote, so the generated documentation carries the "why", not just the "what".

This turns code review from "read every line" into "check the architecture, verify with tests."

When the agent builds a feature, it also updates the architecture documentation. When you review, you open the arc42 document first, the source files second (if at all).

## Example

After generating a search feature, tell the agent:

```
Generate the arc42 building block view and architecture
decisions for the search module you just built.
```

The agent produces a document showing: three components (indexer, query parser, result ranker), their interfaces, and an ADR explaining why it chose an in-memory index over Elasticsearch.

You spot it immediately: "Did the agent create a second database connection pool because it didn't know about the first one?" That's visible in the building block view in seconds, not by reading 47 source files.

The architecture document becomes both the spec the agent reads before coding and the verification artifact you review afterwards. Same document, two roles.