---
authors: [lada_kesseler]
video: https://www.youtube.com/watch?v=_LSK2bVf0Lc&t=1388s
---

# Semantic Zoom

## Problem
Code, logs, docs, books, and articles are frozen at a single written abstraction level. You can’t zoom out for overview or zoom in for details — you’re constrained to whatever resolution the author chose.

## Pattern
Generative AI makes text **elastic**. You control the level of detail by how you ask and how you steer it.
You can expand, collapse, and shift abstraction levels on demand.

**Zoom Out** — ask for high-level synthesis
- "Give me the high-level architecture of this codebase"
- "Summarize the main components and how they interact"
- "Make this paragraph much shorter"

**Zoom In** — interrogate specifics interactively
- "How does authentication work here?"
- "Show me the implementation of this flow"
- "What edge cases does this function handle?"

## Examples

**Exploring codebases:**
Opening Kafka repository: First ask for high-level architecture overview with ASCII diagrams. Once oriented, zoom into specific areas: "How does the consumer group rebalancing work?" AI researches and explains the details.

**Research papers:**
Start with chapter-level summary, then zoom into one experiment's methodology. Ask questions when something is unclear.

**Refactoring:**
Extremely powerful as one of the steps during refactoring:
- ask a coding agent to explain your code in English
- force to the right level of abstraction by zooming in or out and tuning the details out until English is extremely clear
- then ask AI to align code with the English
