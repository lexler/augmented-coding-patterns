---
authors: [lada_kesseler]
video: https://www.youtube.com/watch?v=_LSK2bVf0Lc&t=3865s
---

# Hooks

## Problem

AI has some deeply trained behaviors that might contradict your preferences and are nearly impossible to prevent upfront. Telling AI "don't comment code" often fails because its training is stronger than your instructions. Fighting these instincts by trying to outprompt them is unreliable, so it is easier to let AI do them, automatically detect and correct it after the fact.

## Solution

Some systems (Claude Code) have hooks that hook into deterministic points in the agent lifecycle. They are **deterministic** and in combination with custom scripts allow for flexible and reliable correction of behaviors. 

Use lifecycle event hooks to intercept the agent's workflow at specific trigger points and inject targeted prompts, corrections, validations, or add monitoring.

Example of lifecycle events:
```
• UserPromptSubmit
• PreToolUse
• PostToolUse
• Notification
• Stop / SubagentStop
• PreCompact
• SessionStart / SessionEnd
```

Hooks run shell scripts at these events that can allow you to:
- Validate code quality before commits proceed
- Collect metrics on tool usage patterns
- Enforce project-specific conventions automatically
- Provide just-in-time guidance when specific conditions are detected
- Inject reminders before the agent forgets your preferences

## Example

Create a hook that runs when the agent uses a writing tool (**Write|Edit|MultiEdit** in Claude Code) and a script that detects code comments.  
When the agent adds a code comment, the hook immediately gives feedback that the agent needs to address before it can proceed with the next task.

