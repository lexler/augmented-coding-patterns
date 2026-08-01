---
authors: [nitsan_avni]
---

# JIT Docs

## Pattern
Rely on up-to-date documentation searched in real-time by the agent, rather than AI's outdated training data.

**Workflow:**
1. Point AI to documentation source once
2. AI searches relevant sections in real-time based on your task
3. AI fetches and uses current information
4. One-click access via tools like Context7 MCP

**Key shift:** From "AI knows from training" → "AI searches current docs"

## Example

**Building with Next.js 15:**
Old way: AI uses outdated training data, suggests deprecated APIs
New way: Point to Next.js docs once, AI searches current v15 docs for each feature you need

**Using Context7:**
```
You: "Use context7 for Next.js, build auth flow"
AI: Searches Next.js 15 docs in real-time
AI: Finds current app router + middleware patterns
AI: Generates code with actual current APIs
```

**Internal project patterns:**
```
You: "Check our API conventions doc"
AI: Searches your docs for relevant patterns
AI: Applies current team standards
```

**What this solves:**
- Outdated training data → Current, accurate information
- Hallucinated APIs → Real, version-specific docs
- Manual doc hunting → Agent searches autonomously

**Tools that enable this:**
- Context7 MCP: One-click library documentation
- Custom MCP servers: Project-specific docs
- Agent search capabilities built into tools
