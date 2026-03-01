# Claude Code — Skills & Commands Guidelines

*Source: https://docs.anthropic.com/en/docs/claude-code/skills*
*Distilled for /gandalf coaching use*

---

## The guidelines

### Skills and commands are now unified

`.claude/commands/review.md` and `.claude/skills/review/SKILL.md` both
create `/review` and work identically. The difference: skills support
supporting files, frontmatter invocation control, and automatic loading.
New work belongs in `.claude/skills/`. Old `.claude/commands/` files keep working.

### The description field is the trigger mechanism

Claude uses the `description` frontmatter to decide whether to auto-load
a skill. A passive description means the skill never auto-activates.
A "pushy" description with specific trigger keywords means it fires when relevant.

```yaml
# Too passive — never auto-triggers
description: Reference for code review

# Pushy — triggers on relevant content
description: >
  Expert code reviewer. Use PROACTIVELY when the user writes, modifies,
  or asks about code quality, security, tests, or pull requests.
  Activate when you see code changes or review requests.
```

**Trap:** Writing a description that describes what the skill does rather
than when it should activate.
**Break:** Skill never auto-loads. Only works when explicitly invoked.

### Supporting files extend the skill without inflating the prompt

A skill directory can contain templates, examples, scripts, and reference docs.
Reference these from SKILL.md so Claude knows they exist and when to load them.
The SKILL.md itself stays short — the depth lives in the supporting files.

```
.claude/skills/coach/
├── SKILL.md              ← short: persona + trigger + what references exist
└── references/
    ├── claude-code-CLAUDE-md.md
    └── claude-code-skills.md
```

Claude loads supporting files on demand — they don't inflate every invocation.

### Context injection with `!command`

Skills can inject live data before Claude sees the prompt:

```yaml
## Pull request context
- Diff: !`gh pr diff`
- Comments: !`gh pr view --comments`
```

The shell command runs first. Claude receives the rendered output, not the
command itself. This is preprocessing, not something Claude executes.

**Use for:** PR diffs, git status, environment state, file listings.
**Don't use for:** Secrets (output appears in Claude's context), long-running commands.

### `context: fork` runs the skill in a subagent

Adding `context: fork` in frontmatter spawns the skill in an isolated
context. The main conversation isn't polluted. Results are returned.
Use for self-contained tasks — analysis, generation, review — where you
want a clean slate and a clear output boundary.

### Auto-loading vs. manual invocation

Skills with good descriptions auto-load. Skills without `user_invoked: true`
can be triggered by Claude automatically. Setting `user_invoked: true` means
the skill only runs when the user explicitly calls `/skill-name`.

Use `user_invoked: true` for destructive operations, long tasks,
or anything that should require explicit intent.

---

## Rabbit holes from here

- Agents: when a skill isn't enough and you need a subagent with its own context
- Hooks: when you need deterministic execution, not LLM judgment
- The description problem: why most skills never auto-trigger
