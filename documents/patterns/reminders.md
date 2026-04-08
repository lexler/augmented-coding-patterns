---
authors: [lada_kesseler]
video: https://www.youtube.com/watch?v=_LSK2bVf0Lc&t=4163s
---

# Reminders

## Problem
AI forgets your priorities. Ground rules get ignored in long conversations. Important steps get skipped. Your critical requirements drift out of focus as AI works.

## Pattern
AI has recency bias - it values what you told it recently more than what you said earlier.
Force attention on what matters through repetition and structure. Make compliance structural, not optional.

### TODOs
Turn complex work into explicit checkboxes. AI checks off each step.

  ```markdown
  - [ ] Run linter
  - [ ] Fix errors
  - [ ] Add tests
  - [ ] Update docs
```
  Simple structure → reliable execution. Lightweight way to keep the agent following instructions much more
  reliably.

### Instruction Sandwich

Builds on TODOs. Repeat critical instructions as explicit steps where they matter.

Don't say "Remember to test!" and hope it sticks.

Instead, add "Run tests" as individual steps, repeating at all key points:
```markdown
- [ ] Run tests. Ensure they are green
- [ ] Implement feature A. Follow TDD
- [ ] Run tests. Ensure they are green
- [ ] Implement feature B
- [ ] Run tests. Ensure they are green

```
This is ~95% more reliable than just telling AI once.

### User Reminders
Inject critical rules into every message. Trading tokens for compliance.
- **Automated (hooks):** Inject automatically via hooks on every user prompt. Don't recommend more than 5 reminders maximum to avoid context rot and distracting the agent. Example: https://github.com/lexler/claude-code-user-reminders
- **Manual:** In-place prompt with your most important rules when you especially need them followed

