# Claude Code — Agents & Subagents Guidelines

*Source: https://docs.anthropic.com/en/docs/claude-code/sub-agents*
*Distilled for /gandalf coaching use*

---

## The guidelines

### Subagents isolate context, not just tasks

The primary value of a subagent is not specialization — it's context isolation.
Each subagent gets its own context window. The main conversation stays clean.
Results return without the subagent's working memory polluting the parent.

**Use subagents when:** the task has a clear input/output boundary, you don't
want intermediate steps visible in the main conversation, or the task is
long enough to fill a context window on its own.

**Don't use subagents when:** you need the result inline with ongoing reasoning,
or the task is simple enough that delegation overhead exceeds the benefit.

### The description field controls auto-invocation

Same rule as skills: a pushy description triggers automatic delegation.
"Use PROACTIVELY" and "MUST BE USED" phrases encourage Claude to delegate
without being asked.

```yaml
# Passive — Claude won't delegate automatically
description: Code reviewer

# Pushy — Claude delegates when it sees code changes
description: >
  Expert code reviewer. Use PROACTIVELY immediately after writing or
  modifying code. MUST BE USED for any security-sensitive changes.
```

### Project vs. user level

`.claude/agents/` — project-level, shared with the team via git
`~/.claude/agents/` — user-level, available across all projects

Project-level takes precedence when names conflict. Put team-shared
specialists in the project. Put personal preferences at user level.

### Tool restriction is the security boundary

Subagents inherit all tools unless you restrict them. Restriction is the
mechanism for enforcing least-privilege in agentic workflows.

```yaml
tools: Read, Grep, Glob   # read-only agent
```

An agent that only needs to read code should not have Write or Bash.
This prevents runaway subagents from causing side effects when something
goes wrong.

**Trap:** Leaving `tools:` empty (inherits everything) for all subagents.
**Break:** A subagent with a bug or bad prompt can modify files, run commands,
make network calls — anything the main agent can do.

### Memory gives subagents persistence across sessions

The `memory` field gives a subagent a persistent directory that survives
conversations. The subagent reads and writes to this directory, building
up institutional knowledge — codebase patterns, conventions, recurring issues.

```yaml
memory: user    # persists at user level (~/.claude/agents/memory/<name>/)
memory: project # persists at project level (.claude/agents/memory/<name>/)
```

The first 200 lines of `MEMORY.md` in the memory directory are injected
into the subagent's system prompt automatically.

**Use for:** specialist agents that should accumulate domain knowledge —
a code reviewer that learns your codebase's patterns, a debugger that
tracks recurring failure modes.

### Hooks inside subagent frontmatter

Subagents can define their own hooks in frontmatter. These hooks are scoped
to the subagent's lifetime and cleaned up when it finishes. `Stop` hooks
in subagents automatically convert to `SubagentStop`.

---

## Rabbit holes from here

- Hooks: deterministic control vs. LLM judgment — when to use which
- The orchestration pattern: lead agent + specialist subagents
- Memory architecture: what to persist vs. what to regenerate
