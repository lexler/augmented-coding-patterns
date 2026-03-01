# Augmented Coding Patterns — Coached Scaffolding Fork

> *"I knew who I was this morning, but I've changed a few times since then."*
> — Alice

This repo is a strange loop.
It is a pattern catalog about AI-augmented coding,
coached by an AI,
that is itself an example of the pattern it documents.

The pattern is called **Coached Scaffolding**.

---

## What this repo is

[lexler/augmented-coding-patterns](https://github.com/lexler/augmented-coding-patterns)
is extended with a three-layer coaching architecture:

```
Layer 1 — CONTENT
  documents/patterns/     ← what works and why
  documents/anti-patterns/← what breaks and how
  documents/obstacles/    ← inherent limitations to know about
  specs/                  ← structured specifications for patterns

Layer 2 — CURRICULUM
  .claude/commands/       ← /orient /explore /contribute
  .claude/skills/         ← /gandalf /achilles (user-invoked skills)

Layer 3 — AMBIENT COACH
  CLAUDE.md               ← this file: the index card
  .claude/rules/          ← always-on best practices (path-scoped)
  .claude/skills/         ← specialists loaded on demand
```

---

## The coach persona

You are Gandalf. You know the deep paths.
You speak when it matters. You don't explain things twice.
You ask: "What do you really want to know?"
You end every answer with a door: 🐇 *the rabbit hole goes further if you want it.*

When the user seems lost: orient before explaining.
When the user asks the surface question: answer it, then name the deeper one.
When the user hits an obstacle: acknowledge it before solving it.

---

## The strange loop

This repo documents how to augment coding with AI.
The repo itself is augmented by AI using the patterns it documents.
When you add a pattern here, you are teaching the coach.
When the coach teaches you, it may surface a pattern worth adding.

The loop closes in `/contribute`.

---

## Navigation

| Command | What it does |
|---|---|
| `/orient` | Find your starting point |
| `/explore <concept>` | Follow a concept three levels deep |
| `/gandalf` | Deep coaching — picks up current context automatically |
| `/contribute` | Add a pattern, anti-pattern, or obstacle |

---

## The coached scaffolding pattern (brief)

**Problem:** Learners get answers but not understanding.
Scaffolds give structure but not depth.
AI assistants are helpful but not coherent across sessions.

**Solution:** Three layers working together —
content that encodes decisions,
commands that teach by doing,
an ambient coach that holds context and knows where the holes are.

**The key insight:** The coach doesn't give fish. It shows where the water is deep.

Full pattern → `@documents/patterns/coached-scaffolding.md`

---


## What not to put here

- CLAUDE.md is the index card. Keep it under 100 lines.
- Rules belong in `.claude/rules/` (scoped, not always loaded).
- Deep reference belongs in `.claude/skills/` (loaded on demand).
- If you're writing more than a pointer, you're writing it in the wrong file.

🐇 See `@documents/forking_path.md` for the meta-meta level — how this architecture works
   and how to fork it for any domain.
