---
authors: [lada_kesseler]
video: https://www.youtube.com/watch?v=_LSK2bVf0Lc&t=775s
---

# Limited Context Window (Obstacle)

## Description
Context has a fixed size limit. Once the limit is reached, older content has to be dropped or summarized by coding assistant to make room for new input.

Everything you put in context competes for this limited space.

## Impact
- Long conversations eventually lose early messages
- Large files can't be loaded whole
- Everything loaded (code, docs, ground rules, conversation history) fights for the same limited space
- Forces choices about what to keep in context and what to leave out

