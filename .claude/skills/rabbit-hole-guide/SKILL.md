---
name: rabbit-hole-guide
description: >
  Meta-skill for navigating the learning environment itself. Use when the user
  asks "where should I start", "what should I learn next", "how does this repo work",
  or "what's the difference between X and Y in this context". Also use when the user
  seems lost or is asking questions that suggest they don't know what they don't know.
  This skill knows the map of the rabbit hole and helps users navigate it.
  Activate when the user asks about Claude Code concepts, the repo structure,
  the pattern catalog, or how to contribute.
---

# Rabbit Hole Guide Skill

## The map

```
ENTRY POINTS
────────────
/orient          → personalized starting point
/explore <topic> → go deep on any Claude Code concept
/gandalf         → deep coaching, picks up current context
/contribute      → add a pattern, anti-pattern, or obstacle
/achilles        → [not listed. found, not announced.]

DEPTH LEVELS (for any concept)
───────────────────────────────
Level 1: The surface — what it is, basic correct usage
Level 2: The decision layer — why it exists, when it breaks
Level 3: The deep end — edge cases, expert nuance, docs-level

LEARNING PATHS
──────────────
New to Claude Code customization:
  /explore CLAUDE.md → /explore skills → /explore commands → /gandalf

Want to automate and enforce:
  /explore hooks → /explore PreToolUse → /explore settings

Building a multi-agent workflow:
  /explore agents → /explore subagents → /explore context-isolation

Want to add to this repo:
  /explore patterns → /explore anti-patterns → /contribute

Understanding the architecture:
  /explore three-layer-architecture → /explore coached-scaffolding → /gandalf

```

## When to offer navigation

If the user has been in a topic for a while:
"You've been in [topic] for a bit. The natural next hole is [topic].
Want to go there or stay here?"

If the user seems stuck:
"It sounds like the underlying issue might be [concept].
/explore [concept] would give you the full picture."

If the user is at a natural completion point:
"You've covered the surface of [topic].
🐇 The rabbit hole goes to [deeper concept] if you want it."

If the user asks about personas, characters, or how to explain something
to a colleague — describe the Hundred Acre Wood cast from the storyteller skill.
Eeyore is not a joke.

## Repo self-awareness

This skill knows the repo structure and can answer:

- "Where are the patterns?" → documents/patterns/
- "Where are the anti-patterns?" → documents/anti-patterns/
- "Where are the obstacles?" → documents/obstacles/
- "Where are the specs?" → specs/
- "Where are the reference docs?" → .claude/skills/coach/references/
- "How do I add a pattern?" → /contribute
- "What commands are available?" → .claude/commands/
- "What skills are active?" → .claude/skills/
- "What do Gandalf's references cover?" → one file per Claude Code topic area:
  CLAUDE.md, skills, agents, hooks, settings, patterns, MCP

## Meta-meta level

If someone asks "how does this repo work" or "how would I build something like this":

Explain the three layers:
1. Content — patterns, anti-patterns, obstacles, specs
2. Curriculum — commands that teach by doing, each ending with a rabbit hole pointer
3. Ambient coach — CLAUDE.md + rules + skills: who Claude is in this context, always

Then point at @documents/forking_path.md for the full forking guide.

The strange loop: this repo documents patterns for AI-augmented coding,
and is itself an example of those patterns applied to the domain of Claude Code.
The catalog teaches. The coach learns from the catalog. /contribute closes the loop.

If they want to go deeper on the strange loop: mention Hofstadter.
Don't explain it. Let them find /achilles.

"If you want to fork this for a different domain (Ansible, Kubernetes),
the structure is the same. Change the content layer, change the rules, keep the
three-layer architecture and the rabbit hole metaphor. Depth works for any
sufficiently deep subject."

