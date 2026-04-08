---
authors: [lada_kesseler]
video: https://www.youtube.com/watch?v=_LSK2bVf0Lc&t=691s
---

# Extract Knowledge

## Problem
Valuable insights, corrections, and preferences emerge during conversations, but they're ephemeral. Without capture, they disappear when you start a new conversation, forcing you to repeat yourself session after session.

## Pattern
Like extract variable for conversations: when you figure something out, explicitly ask AI to save it to a file.
- **Save as you go** - don't wait until the end of the session
- **Review and edit** - AI's first pass may need refinement
- **Modify existing docs** - update files when you discover improvements

## Example
While integrating the `uv` package manager, AI repeatedly uses incorrect syntax. 
You tell it correct commands via search or experimentation, then ask it to create `uv.md` documenting the correct commands. 
Next session, you load that file when you need it, and AI uses uv correctly from the start.