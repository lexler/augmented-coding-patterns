---
authors: [lada_kesseler]
video: https://www.youtube.com/watch?v=_LSK2bVf0Lc&t=300s
---

# Cannot Learn (Obstacle)

## Description
LLMs have two fundamental limitations that prevent further learning:

- **Fixed Weights**: The model cannot learn from your interactions. You can't make it write better code by talking to it, teach it your coding style, or make it remember your preferences through conversation. The only way to change model behavior is through additional training or fine-tuning, which is either unavailable or hard for an individual developer.

- **Statelessness**: The model itself has no memory between API calls. What appears as "memory" in AI tools is the tool re-sending all messages in the conversation with each request. The model isn't remembering, it's re-reading everything every time.

## Impact
- You must continually restate context, preferences, and project details. YOU are becoming its memory, and it's very tiresome
- Knowledge vanishes when a session resets or starts fresh
- The model cannot adapt to your codebase or preferences through experience
- Any lasting memory must be explicitly managed through external means (files, notes, configurations, etc)
