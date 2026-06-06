---
authors: [svetkis]
---

# Decision Guards

> A lightweight implementation of **ADR** (Architecture Decision Records), adapted for AI-assisted workflows. Instead of full decision documents, it uses inline markers that point to concise rationales in a decisions log.

## Problem

AI loves to refactor. It sees a synchronous function and thinks "this should be async." It spots a manual loop and wonders why you didn't use the library helper. The agent isn't wrong—locally, those look like improvements. But without knowing the history, it "fixes" code that was intentionally written that way, turning a careful tradeoff into a silent bug.

`// don't touch this` doesn't work. The agent deletes it as noise. `AGENTS.md` helps, but that context degrades as the conversation grows.

## Pattern

Guard counter-intuitive code with a short numbered marker that points to a decisions file.

Create `DECISIONS.md` with entries like:

```markdown
## DEC-42
**Location**: `src/cache.ts:15`
**Topic**: Intentionally sync cache lookup
**Rationale**: Hot path (50k calls/min). Promise allocation adds 0.3ms. Deliberate performance tradeoff.
```

Inline reference:

```typescript
// DEC-42: sync lookup is intentional performance tradeoff
function fastLookup(key: string): string {
  return cache[key];
}
```

Tell the agent in `AGENTS.md`: *If you see a `DEC-` comment, check `DECISIONS.md` before changing that code.*

Don't mark everything. Reserve guards for code that looks wrong but isn't. If your decisions file grows faster than your codebase, the agent will start ignoring the markers.

## Example

**Without guard:** Agent refactors sync to async.

```diff
- function fastLookup(key: string): string {
-   return cache[key];
- }
+ async function fastLookup(key: string): Promise<string> {
+   return Promise.resolve(cache[key]);
+ }
```

**With guard:** Agent sees `DEC-42`, checks the decisions file, and leaves it alone.

```typescript
// DEC-42: sync lookup is intentional performance tradeoff
function fastLookup(key: string): string {
  return cache[key];
}
```
