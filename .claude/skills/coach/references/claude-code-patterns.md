# Claude Code — Pattern Catalog Guidelines

*Source: lexler/augmented-coding-patterns taxonomy*
*Distilled for /gandalf coaching use*

---

## The taxonomy

Three document types. Each has a different job.

### Pattern
What works and why. A repeatable solution to a recurring problem.
A pattern has a name you can use in code review: "this is the vault-companion
pattern" means something. It also means "you're doing it wrong" is now
"you're using the anti-pattern for X."

Required sections: Problem, Solution, Wrong Way, Right Way, When to Use,
When NOT to Use, In the Wild.

### Anti-pattern
What breaks and how. A solution that seems reasonable but causes harm.
Not just "don't do this" — the anti-pattern explains WHY people do it,
what the failure mode is, and what the fix is.

The anti-pattern is the pattern's shadow. Every pattern implies an anti-pattern.
Document both, or neither is as useful.

### Obstacle
An inherent limitation. Not something you caused — something that exists.
Obstacles set expectations so practitioners don't waste time fighting
something that cannot be changed.

"Context windows have limits" is an obstacle. "Putting everything in CLAUDE.md"
is the anti-pattern that follows from misunderstanding that obstacle.

---

## The contribution mechanism

The catalog grows from real pain, documented while fresh. The `/contribute`
command is the friction-reduction mechanism — it interviews for classification,
generates the document, asks for confirmation before writing.

Pattern catalogs rot when contribution is harder than not contributing.
`/contribute` makes it easier than filing a ticket.

**The loop:** hit a problem → run `/contribute` → document it →
the next person who hits it gets coached instead of confused.

---

## What makes a good document

**Name it precisely.** "Context Overload" is better than "Too much in CLAUDE.md."
The name has to survive code review — someone has to be able to say it out
loud and have it mean something.

**Name the failure mode concretely.** Not "performance degrades" but
"every session starts with 500 tokens of overhead, most of it irrelevant to
the current task." Concrete failures stick.

**Keep the front matter.** The supported fields are `authors` (required),
`alternative_titles` (for renamed documents — old slugs redirect), and
`synonyms` (alternate names, displayed on the detail page). Cross-referencing
between documents happens through the `Related` section in the body, not frontmatter.

---

## Rabbit holes from here

- The coached-scaffolding pattern: the three-layer architecture this repo embodies
- `/contribute`: the meta-command that closes the loop
- Living documentation: why catalogs rot and how to prevent it
