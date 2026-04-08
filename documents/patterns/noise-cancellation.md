---
authors: [lada_kesseler]
video: https://www.youtube.com/watch?v=_LSK2bVf0Lc&t=1461s
---

# Noise Cancellation

## Problem
AI is verbose by default, creating poor signal-to-noise ratio. Responses overwhelm you with detail, and documents accumulate bloat and outdated information over time ("document rot") - making everything hard to scan and work with.

## Pattern
Explicitly ask AI to be more succinct - strip filler, compress to essence. Don't let bloat accumulate.

**For responses:** 
- "Much more succinct please" (use this liberally)
- "shorter"
- "Higher level of abstraction"
- "Give me TLDR"

**For documents:** 
- Regularly compress knowledge documents - ask AI to remove outdated info and noise
- Delete mercilessly - Git is your friend, you can always get it back
- Think of files as temporary vs permanent - toss the temporary ones frequently

## Examples

**Documentation:**
Force AI to keep documentation extremely succinct. Helps handle document rot, keeps documentation scannable for humans and maintainable.

**Debugging:**
Higher level debugging is often possible. Ask AI to explain the problematic code block in English on a high level. The nonsense becomes obvious fast.

**Learning New Tools:**
Ask "What's Cargo.toml?" and get a wall of text about Rust's build system, dependencies, package metadata,
workspace configuration... while you are just starting and don't need all of these details yet.

Say "Much more succinct please" and get: "It's Rust's project configuration file - like package.json. Has
metadata, dependencies, build settings."

The level of detail now matches your level of curiosity.
