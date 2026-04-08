---
authors: [lada_kesseler]
video: https://www.youtube.com/watch?v=_LSK2bVf0Lc&t=2495s
---

# Knowledge Checkpoint

## Problem
You spend 30 minutes planning a feature with AI. Then AI implements it and fails. Now you've lost both the  implementation AND the planning context. You have to explain everything again.

Your planning time is valuable. Implementation attempts are cheap to retry.

## Pattern
Before attempting implementation, checkpoint the plan:

1. Plan the feature (with AI)
2. Extract planning knowledge to a document (ask AI: "Save this to feature_todo.md". Note: forcing it to be more succinct often produces better results here)
3. Git commit = checkpoint
4. Now attempt implementation
5. If fails → git reset, retry without redoing planning

**Protect your time, not the code.** Code changes are cheap to regenerate. Your explanations and planning are expensive.
- Protects human time investment in planning
- Decouples deterministic planning from non-deterministic execution
- Enables cheap retries

## Example
Spend 30 minutes outlining feature architecture with AI. Extract to `project.md`, commit. AI's implementation
fails. Reset in under a minute, try again - your planning is preserved. You can course correct, but you're
starting from a known good state.

Some models are over eager to start working and want to jump straight into implementation. You'll have to interrupt it and save it to a file first.
