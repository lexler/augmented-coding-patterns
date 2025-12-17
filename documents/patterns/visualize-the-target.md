---
authors: [juanmichelini]
---

# Visualize the Target

## Problem
When you tell an AI that you *don't* want a thing, you're first activating context related to a thing, then asking it to avoid that thing. This creates an overhead and can increase the likelihood of getting what you're trying to avoid.

The same principle applies beyond code generation - in image generation, "Create a picture of a room with no elephants" is more likely to produce a room with elephants than simply saying "Create a room."

## Pattern
Instead of describing what you don’t want, directly describe what you do want. Visualize the target we are aiming for. Transform negative instructions into positive ones by focusing on the desired outcome.

**Transform negations:**
- "Don't use global variables" → "Use local variables and parameter passing"
- "Don't make the function too complex" → "Keep the function simple and focused on a single responsibility"
- "Don't write comments" → "Write self-documenting code with clear variable and function names"
- "Don't use nested loops" → "Use helper functions or built-in methods like map/filter"
- "Don't hardcode values" → "Use configuration files or constants"

**For prompts:**
- "Don't generate verbose code" → "Generate concise, minimal code"
- "Don't use deprecated methods" → "Use current best practices and modern APIs"
- "Don't create security vulnerabilities" → "Follow secure coding practices"

## Example

**Instead of:**
```
"Create a user authentication system. Don't store passwords in plain text, don't use weak encryption, don't forget input validation, and don't make it vulnerable to SQL injection."
```

**Use:**
```
"Create a secure user authentication system that hashes passwords with bcrypt, validates all inputs, uses parameterized queries, and follows OWASP security guidelines."
```

**Image generation example:**
- ❌ "Generate a clean office space with no clutter, no personal items, and no distracting elements"
- ✅ "Generate a minimalist office space with a clean desk, organized shelving, and professional lighting"

The positive framing gives AI a clear target to aim for rather than a list of things to juggle and avoid.
