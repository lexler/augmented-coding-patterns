# Claude Code — Settings & Permissions Guidelines

*Source: https://docs.anthropic.com/en/docs/claude-code/settings*
*Distilled for /gandalf coaching use*

---

## The guidelines

### Settings have four levels — only one wins per setting

From highest to lowest precedence:
1. Managed settings (MDM/org policy — cannot be overridden)
2. User settings (`~/.claude/settings.json`)
3. Project shared settings (`.claude/settings.json` — committed to git)
4. Local settings (`.claude/settings.local.json` — gitignored)

A project `deny` beats a user `allow`. This is intentional — projects
enforce team standards over personal preferences.

**Trap:** Setting permissions in user settings and wondering why they don't
apply in a project that has its own settings.json.
**Break:** Confusing debugging. The project's settings silently override yours.

### Permissions use Tool(pattern) syntax

```json
{
  "permissions": {
    "allow": ["Bash(npm run *)", "Bash(git *)"],
    "deny": ["Bash(rm -rf *)", "Read(.env)", "Read(.env.*)"]
  }
}
```

The pattern after the tool name is glob-matched against the tool's primary
argument. For Bash, it's the command string. For Read/Write, it's the file path.

**Always deny sensitive files explicitly:**
```json
"deny": ["Read(./.env)", "Read(./.env.*)", "Read(./secrets/**)"]
```

These files are excluded from file discovery AND read operations are denied.
Without this, Claude may read secrets if they appear in a path it's exploring.

### Environment variables belong in settings, not shell

```json
{
  "env": {
    "OPENAI_API_KEY": "${OPENAI_API_KEY}",
    "NODE_ENV": "development"
  }
}
```

The `${}` syntax passes through from your shell environment — secrets never
live in the settings file itself. This is how you make API keys available
to hooks and skills without hardcoding them.

**Trap:** Hardcoding API keys in settings.json and committing it to git.
**Break:** Secret exposure. Use `${}` passthrough.

### Managed settings are for org enforcement

Settings delivered via MDM, OS policy, or `managed-settings.json` cannot
be overridden by project or user settings. This is the mechanism for
org-wide policies — blocking specific tools, requiring audit hooks,
restricting network access. If you're on a team and something you configure
has no effect, check whether managed settings are in play.

---

## Rabbit holes from here

- The permission model for hooks: allowedEnvVars intersection
- Plugin settings: enabledPlugins and marketplace configuration
- The deny pattern for secrets: what gets excluded from file discovery
