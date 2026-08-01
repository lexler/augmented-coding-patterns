---
authors: [svetkis]
---

# Memory Grooming

## Problem

AI context rots. So does AI memory.

Persistent memory files make up for the model's statelessness. But they are not the only thing that rots. `AGENTS.md` and project-level `CLAUDE.md` are rules, not memory, yet they overlap with it: the same fact can exist as a rule in `AGENTS.md` and as a note in `.serena/memories/`. Groom them together, or contradictions will hide in the gaps. But left alone, they degrade:

- **Duplicates**: the same fact recorded three times with different wording.
- **Contradictions**: one file says "use X," another says "avoid X."
- **Fuzziness**: vague statements that once meant something specific but now could mean anything.
- **Outdated entries**: rules about a library you removed six months ago.
- **Marker drift**: context markers and decision guards copied without their meaning, becoming decorative noise.

The agent won't groom its own memory. It can't tell a duplicate from a stale entry, or a sharp anchor from a vague phrase. It writes whatever sounds right in the moment. Left alone, memory bloats context, confuses the agent, and quietly breaks instructions.

## Pattern

Maintain agent memory actively. Don't just accumulate notes.

1. **Schedule grooming sessions**
   - After every major feature.
   - When context feels "heavy" or responses start ignoring known rules.
   - When you notice the agent citing a memory you do not remember writing.
   - After a silent misalignment surfaces — it may be caused by stale or contradictory memory.

2. **Deduplicate**
   - Find redundant entries and merge them into one clear statement.
   - Prefer the version tied to a concrete example or decision.

3. **Resolve contradictions**
   - If two memories conflict, decide which one is current.
   - Archive or delete the loser; do not leave both in place.

4. **Sharpen fuzzy entries with semantic anchors**
   - Replace long descriptions with well-known domain terms.
   - Use established names like "TDD, London School" or "arc42" instead of describing the same idea in your own words.
   - The agent records memory as prose; you rewrite it as anchors.

5. **Refresh markers and guards**
   - Check that context markers and decision guards still mean what they say.
   - Remove markers that no longer activate useful behavior.
   - Update references if the underlying file moved.

6. **Delete obsolete memory**
   - Before deleting, make sure the decision is recorded elsewhere — git history, ADR, or code comments. If yes, delete without keeping an archive.
   - Archives rot too: nobody grooms them, they grow, and sooner or later someone pulls old garbage back into context.

7. **Keep memory composable by scope**
   - Split large memory files by topic or area of application.
   - Contradictions are acceptable when scopes are explicit: `frontend-testing.md` and `backend-testing.md` can disagree.
   - Grooming still covers every file; composition just makes contradictions local and resolvable.

Groom memory before it becomes noise. Clean memory is smaller, easier to follow, and easier to debug when the agent goes wrong.

## Example

**Before grooming:**

```markdown
# AGENTS.md

- Start every reply with 🍀.

Always write tests first.
We do TDD here, red-green-refactor.
Make sure to create a failing test before implementation.
Use test doubles for external dependencies.

# memory/project.md

Project uses Jest for testing.
Testing approach: write tests before code.
Do London-style TDD.
Avoid mocking too much.
```

After a few iterations, the agent starts using mocks inconsistently. It has four overlapping descriptions of the testing process and a contradiction about when to mock.

**After grooming:**

```markdown
# AGENTS.md

- Start every reply with 🍀.
- TDD, London School.
```

The agent now has one clear anchor (`TDD, London School`) instead of five overlapping paraphrases. The name activates the methodology; no explanation needed. The mock contradiction is folded into the anchor: London School TDD uses mocks for external dependencies. The marker 🍀 stays explicit and checkable.

## When to Stop

Don't groom memory into perfection. Aim for "good enough to be reliable."

If grooming keeps surfacing contradictions that are really scope differences, apply Knowledge Composition: split the memory by area of application so each file has one coherent scope. Then groom each file separately.
