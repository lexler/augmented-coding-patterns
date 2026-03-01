---
authors: [bbaassssiiee]
---

# Coached Scaffolding

## Problem

You want AI to help a practitioner go deep on a subject —
not just answer questions, but build understanding over time.

The standard approaches fail in predictable ways:

A **reference document** (even a good one) answers questions the practitioner
already knows to ask. It can't surface what they don't know they don't know.

A **boilerplate generator** produces correct output that the practitioner
copy-pastes without understanding. The next variation breaks them.

A **chat assistant** is stateless. Every session starts from zero.
The practitioner repeats context. The assistant repeats explanations.
Nothing accumulates.

## Solution

Three layers, each with a different job:

```
Layer 1 — CONTENT
  The domain's "right way to do the thing."
  Skeletons, examples, annotated references.
  Encodes decisions so practitioners don't have to rediscover them.

Layer 2 — CURRICULUM
  Slash commands that teach by doing.
  /orient  → personalized starting point
  /explore → three depth levels, stops and asks before going deeper
  /story   → narrative explanation for experienced practitioners
  /review  → code review that names patterns and anti-patterns
  /debug   → root cause + deeper issue + rabbit hole pointer
  /contribute → adds to the living catalog

Layer 3 — AMBIENT COACH
  CLAUDE.md + rules/ + skills/
  The coach persona, always-on opinions, specialists loaded on demand.
  Knows where the rabbit holes are and names them.
```

The key mechanism: **the rabbit hole pointer.**

Every explanation ends with a door:
> 🐇 There's a deeper layer here around [concept]. /explore [concept] if you want to follow it.

This makes depth visible and opt-in. The practitioner controls the descent.

## The coaching model

The coach (Claude) is:

- **Opinionated** — has a position on the right way, not "it depends" every time
- **Contextual** — knows what the practitioner is doing and names the pattern they're in
- **Depth-aware** — distinguishes surface from deep, makes the difference explicit
- **Non-prescriptive about pace** — the practitioner controls how far they go

The coach does not give fish. It shows where the water is deep.

## Wrong way — Boilerplate Dump

```
# /new-role command (anti-pattern version)

Generate a role skeleton for: $ARGUMENTS

[dumps 8 files with no explanation]
Done! Your role is ready.
```

Why this fails: the practitioner has files but no understanding.
The next role they write is identical, or broken in a new way.

## Right way — Coached Scaffolding

```
# /new-role command (pattern version)

Role name: $ARGUMENTS

Step 1 — Interview:
  Ask what the role does, what platforms it targets, whether it handles secrets.
  Do not generate anything until you have answers.

Step 2 — Generate with explanation:
  Each file includes comments explaining the decision behind every choice.
  Credential tasks include: "# no_log: true — always. See anti-pattern: vault-bypass"

Step 3 — Checklist + rabbit holes:
  ✓ tasks/main.yml  — organized by concern, not type
  ✓ defaults/main.yml — every variable declared with comment
  TODO: run molecule test twice (second run must show zero changed)
  🐇 /explore idempotency — why your tasks should pass twice
  🐇 /explore handlers  — restart on change, not always
```

Why this works: the practitioner understands each decision.
When the next role is different, they know which decisions to revisit.

## The strange loop property

A coached scaffolding repo is self-applying.

The repo documents patterns about AI-augmented coding.
The repo is itself an example of those patterns in a specific domain.
When a practitioner adds a pattern via `/contribute`, they are teaching the coach.
When the coach surfaces a pattern during a session, it may be worth contributing.

This is not a bug. It is the point.
The catalog grows from real practice. The coach improves as the catalog grows.

## Implementation checklist

To fork this pattern for a new domain:

1. **Replace the content** (Layer 1)
   - Domain skeletons: the right starting points
   - Annotated examples: decisions explained inline
   - Reference documents: authoritative sources cross-linked

2. **Keep the command structure** (Layer 2)
   - `/orient`, `/explore`, `/story`, `/review`, `/debug`, `/contribute`
   - Three depth levels in `/explore` — surface, decision layer, deep end
   - Rabbit hole pointer at the end of every explanation

3. **Replace the coach persona** (Layer 3)
   - CLAUDE.md: index card, under 100 lines, pointers only
   - Rules: domain best practices, path-scoped
   - Skills: domain specialists, loaded on demand

4. **Keep the strange loop**
   - `/contribute` as the meta-command
   - The pattern catalog as living memory
   - The coach as the map, not the territory

## When to use

When you want practitioners to build understanding, not just produce output.
When the domain has depth worth following.
When the team's knowledge should accumulate across sessions and people.

## When NOT to use

When you need fast boilerplate with no learning goal.
When the domain is shallow enough that a reference document suffices.
When the overhead of three layers exceeds the value of the depth.

## In the wild

- This repo
  — this pattern applied to AI-augmented coding itself (meta)
- [ansible-rabbit-hole](https://github.com/bbaassssiiee/ansible-rabbit-hole)
  — this pattern applied to Ansible for DevOps practitioners

## Related

- 🐇 `/explore depth-levels` — how to structure three-level explanations
- 🐇 `/explore living-documentation` — why catalogs rot and how to prevent it
- ⚠️ Anti-pattern: Boilerplate Dump — generates without teaching
- ⚠️ Anti-pattern: Context Overload — too much in CLAUDE.md, all loaded always
- ⚠️ Anti-pattern: Passive Reference — documents that don't know the rabbit holes

