# /explore — Go down the rabbit hole on any Claude Code concept

Concept to explore: $ARGUMENTS

This command has three depth levels. Always start at level 1 and ask before going deeper.

---

## Level 1 — The Surface (always show this first)

Explain the concept in 3-4 sentences. Assume the user has seen it but hasn't thought hard about it.
Show the simplest correct example. Then show the most common wrong version next to it.

Format:
```
THE CONCEPT
───────────
[plain explanation, no jargon without definition]

✓ RIGHT                          ✗ WRONG (and why)
[correct example]                [incorrect example]
                                 ^ [one-line reason]
```

End with: "🐇 Go deeper? I can show you [specific next level topic]. Just say yes or /explore [next topic]"

---

## Level 2 — The Decision Layer (only if user asks to go deeper)

This is where you explain WHY the pattern exists. What problem does it solve?
What breaks if you ignore it? Reference the pattern catalog:

- If a documented pattern exists: "This is the **[Pattern Name]** pattern → `@documents/patterns/[file].md`"
- If an anti-pattern exists: "Ignoring this leads to the **[Anti-pattern Name]** → `@documents/anti-patterns/[file].md`"
- If an obstacle exists: "This runs into the **[Obstacle Name]** → `@documents/obstacles/[file].md`"

Show a real-world scenario where it matters. Not "imagine you have a project" but
a concrete situation: a specific CLAUDE.md that's 400 lines long, a skill that
never auto-triggers, a hook that fires too late to block what it was meant to block.

End with: "🐇 There's a deeper layer here around [specific technical detail]. Want to see it?"

---

## Level 3 — The Deep End (only if user explicitly wants it)

This is where most people stop. You're going to show:

1. The edge cases and failure modes
2. The expert-level nuance (e.g. for skills: description trigger mechanics,
   context injection ordering, `context: fork` isolation behavior)
3. The interaction effects — how this concept behaves when combined with others
4. What the official docs actually say vs. what practitioners discover

Reference the spec that demonstrates this in practice:
"See this specified: `@specs/[relevant-spec].md`"

Reference the Gandalf reference doc for this topic:
"Reference: `@.claude/skills/coach/references/claude-code-[topic].md`"

End with: "You've reached the bottom of this particular hole.
Related holes worth exploring: /explore [topic1], /explore [topic2]"

---

## Topic map (use this to know what's connected)

- CLAUDE.md → memory-hierarchy → auto-memory → instructions-as-prompts → iteration
- skills → description-triggers → supporting-files → context-injection → `context:fork`
- commands → frontmatter → `$ARGUMENTS` → `!command` → user-invoked
- agents → subagents → context-isolation → tool-restriction → agent-memory
- hooks → lifecycle-events → PreToolUse → PostToolUse → hook-types
- settings → permissions → allow-deny → env-passthrough → managed-settings
- patterns → anti-patterns → obstacles → taxonomy → contribute
- coached-scaffolding → three-layer-architecture → strange-loop → GEB
- MCP → tool-integration → external-services → server-configuration

---

## Concept-to-reference mapping

If the concept has a Gandalf reference doc, point to it at Level 2 and 3:

- CLAUDE.md, memory, instructions → `@.claude/skills/coach/references/claude-code-CLAUDE-md.md`
- skills, commands, SKILL.md, triggers → `@.claude/skills/coach/references/claude-code-skills.md`
- agents, subagents, delegation → `@.claude/skills/coach/references/claude-code-agents.md`
- hooks, lifecycle, PreToolUse → `@.claude/skills/coach/references/claude-code-hooks.md`
- settings, permissions, env → `@.claude/skills/coach/references/claude-code-settings.md`
- patterns, anti-patterns, catalog → `@.claude/skills/coach/references/claude-code-patterns.md`

If no reference doc exists for the concept:
"This isn't in the reference catalog yet. `/contribute` to add it — or `/gandalf` to
explore it from first principles."

---

## The coached-scaffolding special case

If $ARGUMENTS is `coached-scaffolding`, `three-layer-architecture`, `strange-loop`,
or `this-repo`:

At Level 1, add after the standard explanation:
"Note: you are currently inside this pattern. The command you just ran is Layer 2.
The skill that may have helped route you here is Layer 3. The documents you'll
be pointed to are Layer 1. The loop is not a metaphor."

At Level 3, end with:
"The deepest hole in this repo is the one you dig yourself.
`/contribute` is the meta-command. `/achilles` is the easter egg.
You were warned."

