# Claude Code — CLAUDE.md Guidelines

*Source: https://docs.anthropic.com/en/docs/claude-code/overview*
*Distilled for /gandalf coaching use*

---

## The guidelines

### CLAUDE.md is the index card, not the manual

CLAUDE.md is read at the start of every session. Everything in it costs
tokens on every session start, regardless of relevance. The right use is
pointers — to rules, skills, and reference files — not the content itself.

**Trap:** Putting everything in CLAUDE.md because it's easy.
**Break:** 500-token overhead on every session, most of it irrelevant.
**Fix:** CLAUDE.md ≤ 100 lines. Rules in `.claude/rules/`. Depth in `.claude/skills/`.

### Memory hierarchy: four CLAUDE.md files, not one

Claude Code loads CLAUDE.md files from multiple locations, in precedence order:
1. `~/.claude/CLAUDE.md` — user-level, always loaded
2. Project root `CLAUDE.md` — loaded for this project
3. `.claude/CLAUDE.md` — alternative project location
4. Subdirectory `CLAUDE.md` files — loaded when working in that directory

The right level for a guideline is the most specific level where it applies.
Team conventions → project root. Personal style → user-level. Module rules → subdirectory.

### Auto-memory supplements, doesn't replace

Claude Code builds auto-memory as it works — build commands, debugging
insights, codebase patterns — without you writing anything. This accumulates
in `.claude/` project memory files. Do not duplicate auto-memory content
in your handwritten CLAUDE.md. Let it accumulate separately.

**Trap:** Manually maintaining what auto-memory would learn anyway.
**Break:** Stale, contradictory instructions as auto-memory diverges from manual.

### Instructions are prompts — iterate on them

CLAUDE.md content is part of Claude's prompt. A common mistake is writing
it once and never measuring whether it changes behavior. Treat CLAUDE.md
like any frequently used prompt: experiment, observe, refine.

---

## Rabbit holes from here

- Skills: how to move depth out of CLAUDE.md into on-demand specialists
- Rules: path-scoped always-on guidelines that don't inflate every session
- Memory architecture: auto-memory vs. manual CLAUDE.md vs. subagent memory
