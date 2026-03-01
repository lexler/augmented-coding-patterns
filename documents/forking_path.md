# How This Repo Was Built (And How to Build One Like It)

This is the meta-meta level. How does the repo itself work as a pattern?
How would you fork it for a different domain?

## The three-layer architecture

```
Layer 1: CONTENT
  documents/patterns/ + documents/anti-patterns/ + documents/obstacles/
  ↓
  "Here is the right way to do the thing — and why"

Layer 2: CURRICULUM
  .claude/commands/
  ↓
  "Here is how to learn the thing, guided by Claude"

Layer 3: AMBIENT COACH
  CLAUDE.md + .claude/rules/ + .claude/skills/
  ↓
  "Here is who Claude is in this context, all the time"
```

The insight from lexler/augmented-coding-patterns:
document what you know as patterns, anti-patterns, and obstacles.
The patterns teach. The anti-patterns warn. The obstacles set expectations.

The insight from the rabbit hole metaphor:
depth is the point. Not breadth. Not completeness. Depth.
Every concept can be followed further. The commands make that explicit.

## What makes a good command

A good slash command:
1. Has a clear contract (what it takes, what it produces)
2. Teaches something by doing something
3. Ends with a rabbit hole pointer ("🐇 go deeper?")
4. Can be run by a beginner and still be useful

A bad slash command:
- Generates boilerplate without explaining it
- Has no interactivity (just dumps output)
- Could be a skill instead (auto-triggered is better than manual)
- Does too many things

## What makes a good skill

A skill is triggered automatically when relevant.
This means the **description** is the most important part — Claude uses it to decide
whether to activate the skill.

Make descriptions "pushy":
```
# Too passive:
description: Claude Code best practices reference

# Pushy and trigger-rich:
description: >
  Deep Claude Code expertise. Use PROACTIVELY when the user writes, reviews,
  or asks about CLAUDE.md files, skills, commands, agents, hooks, or settings.
  Activate when you see frontmatter, SKILL.md files, or settings.json.
```

## Forking this for a different domain

Replace three things:

1. **The content** — the domain's patterns, anti-patterns, and obstacles
   - Ansible: idempotency patterns, vault anti-patterns, molecule obstacles
   - Kubernetes: resource limit patterns, privilege escalation anti-patterns, CNI obstacles
   - LLM evaluation: benchmark patterns, overfitting anti-patterns, hallucination obstacles

2. **The rules** — the domain's always-on best practices (`.claude/rules/`)
   - Claude Code: CLAUDE.md stays thin, skills over rules for deep content
   - Ansible: no_log on credentials, changed_when on commands
   - Kubernetes: resource limits required, non-root containers, network policies

3. **The coach skill** — the domain expert persona (`.claude/skills/coach/`)
   - Change the reference docs to cover the domain's core concepts
   - Update the coach's opinions to reflect domain-specific right ways
   - Update the rabbit hole map (what leads to what in this domain)

Keep:
- The `/orient`, `/explore`, `/story`, `/review`, `/debug`, `/contribute` command structure
- The three-depth-level pattern in `/explore`
- The rabbit hole 🐇 pointer at the end of every explanation
- The patterns/anti-patterns/obstacles taxonomy in `documents/`
- The meta-meta layer (this file)

## The coaching model encoded here

The coach (Claude) is:
- **Opinionated** — has a position on the right way, not "it depends" every time
- **Contextual** — knows what the user is doing and where they are in the learning path
- **Depth-aware** — knows what's shallow and what's deep, and makes the difference visible
- **Pattern-linked** — connects live work to named concepts in the catalog
- **Non-prescriptive about pace** — the user controls how deep they go

The Alice in Wonderland frame works because it:
- Validates curiosity ("following the rabbit is good, not naive")
- Normalizes depth ("of course it goes deeper")
- Makes the coach's role clear ("I know where the next hole leads")
- Works for experienced practitioners (they've fallen down holes before)

## The meta-anti-pattern to avoid

The most common mistake when building a repo like this:

**Too much in CLAUDE.md.**

CLAUDE.md is loaded every session. If it's 500 lines, every session starts
with 500 tokens of overhead and most of it is irrelevant to the current task.

The pattern: CLAUDE.md is the index card. Rules are the reference sheets.
Skills are the specialist on-call. Only load what's needed when it's needed.

```
CLAUDE.md         → 50-100 lines, always loaded, pointers only
.claude/rules/    → always loaded for matching paths, focused
.claude/skills/   → loaded on demand, unlimited depth
.claude/commands/ → loaded only when invoked
```

## The living document problem

Pattern catalogs rot. Skills get stale. Commands diverge from current practice.

The solution is the `/contribute` command — it lowers the friction to update the catalog
to the same friction as writing a PR comment. When something breaks on a real project,
the practitioner runs `/contribute` and documents it while it's fresh.

This is how augmented-coding-patterns works. The patterns aren't written upfront.
They're extracted from real pain, documented while the memory is fresh.

## 🐇 The deepest hole in this repo

The deepest rabbit hole is the one you dig yourself.

`/contribute` is the meta-command. Every pattern you add teaches the next practitioner
who hits that same problem. The value of the repo grows with every contribution.

That's the meta-meta level: the repo is a collective memory of hard-won
knowledge about AI-augmented coding, surfaced by a coach that knows where all the holes are.
