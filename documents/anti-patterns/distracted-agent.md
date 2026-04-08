---
authors: [lada_kesseler]
video: https://www.youtube.com/watch?v=_LSK2bVf0Lc&t=836s
---

# Distracted Agent (Anti-pattern)

## Problem
Using one agent for everything - coding, documentation, committing, web research, all in the same context.

AI has limited attention. Everything in context competes for that attention. With too many responsibilities,
the agent either stays shallow across all of them or fixates on the wrong things.

Even with the same ground rules, a distracted agent won't follow them as well as a focused one. For many tasks, a distracted agent is good enough. The need for focus becomes critical when precision matters - following specific rules, catching subtle issues, or applying domain expertise consistently.

## What Goes Wrong
- Agent stays shallow, doesn't engage deeply with any single responsibility
- Or fixates on the wrong things while missing what matters
- Ground rules get ignored even when explicitly stated
- Instructions inconsistently followed

## Example
Main development agent with ground rules to catch bad practices. Same rules as a focused committer agent. The main agent never warned about committing node_modules or style violations. The focused committer caught both immediately.

**This is hard to spot**. The distracted agent doesn't feel broken - it often seems to work fine. You only realize the problem when you see a focused agent handle the same responsibility. The contrast makes it obvious how much the distracted agent was missing.
