# Claude Code — Hooks Guidelines

*Source: https://docs.anthropic.com/en/docs/claude-code/hooks*
*Distilled for /gandalf coaching use*

---

## The guidelines

### Hooks are for determinism, not judgment

Claude decides whether to run a tool. Hooks run unconditionally when the
event fires. This is the fundamental distinction.

Use hooks when the action must always happen — linting after every file write,
audit logging every tool use, blocking specific bash patterns. If the action
requires judgment about whether it's appropriate, use a prompt or agent hook,
or rethink whether it belongs in a hook at all.

**Trap:** Putting judgment logic in command hooks (exit codes only, no reasoning).
**Break:** Either the hook is too blunt (blocks valid operations) or too permissive
(allows what it should block).

### Four hook types for four situations

```
command  → deterministic shell script, fast, no LLM
http     → post to an endpoint (audit service, external system)
prompt   → single LLM call, yes/no decision, no tools
agent    → multi-turn LLM with tools (read files, run commands, verify state)
```

Choose the minimum type that handles the complexity. A `command` hook that
runs in 50ms is always better than an `agent` hook that takes 30 seconds
for the same decision.

### The lifecycle order matters for blocking

```
PreToolUse  → can block the tool call (exit 2 or {"decision": "block"})
PostToolUse → runs after, cannot block (use for logging, formatting)
SessionStart → setup, context loading (cannot block)
Stop         → can prevent Claude from stopping ("block" forces continuation)
```

If you need to prevent something, it must be `PreToolUse`. `PostToolUse`
is for side effects after the fact.

**Trap:** Using PostToolUse to "validate" something you wanted to prevent.
**Break:** The action already happened. PostToolUse is too late.

### Hooks in skills and subagents frontmatter

Hooks don't have to live in `settings.json`. They can be defined in skill
and subagent frontmatter, scoped to that component's lifetime:

```yaml
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/security-check.sh"
```

This is the right pattern for hooks that only apply when a specific
skill or agent is active. It avoids global hooks that fire for everything.

### SessionStart is not for static context

`SessionStart` hooks are for dynamic context — things you need to fetch
or compute at session time. For static context that doesn't change,
use CLAUDE.md. SessionStart runs on every session start, so keep it fast.

**Trap:** Using SessionStart to load a static reference document.
**Break:** Unnecessary overhead every session. Just put it in CLAUDE.md or a skill.

---

## Rabbit holes from here

- The command hook contract: stdin JSON, exit codes, stdout format
- Agent hooks vs. subagents: when you need tool access in validation
- The audit pattern: PostToolUse + http hook for team-wide logging
