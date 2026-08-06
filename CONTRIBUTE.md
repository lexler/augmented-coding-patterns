# Contributing to Augmented Coding Patterns

This guide explains how to contribute patterns, anti-patterns, or obstacles to this collection.

## Content Types & Locations

- **Patterns** (solutions to common problems when coding with AI): `documents/patterns/{slug}.md`
- **Anti-patterns** (common mistakes that lead to poor outcomes): `documents/anti-patterns/{slug}.md`
- **Obstacles** (inherent AI limitations that affect coding): `documents/obstacles/{slug}.md`

---

## File Structure

**Naming:** Use kebab-case (`chain-of-small-steps.md`)

**Frontmatter:**
```yaml
---
authors: [author_id]
video: https://www.youtube.com/watch?v=VIDEO_ID&t=300s  # optional
---
```

The `video` field is optional. When present, the pattern page renders a YouTube
thumbnail with the video's title underneath. After adding or changing a `video`
URL, regenerate the cached video titles:

```bash
cd website && npm run fetch:videos
```

This updates `website/lib/video-titles.json` (commit it alongside the markdown
change).

**Images:** Put the file in `website/public/images/` and reference it as `![alt text](/images/{file})`. The site prepends the deployment base path when rendering.

**Relationships:** Define in `documents/relationships.mmd` using Mermaid graph syntax:
```mermaid
patterns/your-pattern -->|solves| obstacles/some-obstacle
patterns/your-pattern -->|uses| patterns/another-pattern
```

**Content Templates:**

Pattern:
```markdown
# Pattern Name
## Problem
## Pattern
## Example
```

**Writing Style:** Be concise. Prefer short, direct sentences over detailed explanations.

Anti-pattern:
```markdown
# Anti-pattern Name
## Problem
## What Goes Wrong
## Example
## Solution
```

Obstacle:
```markdown
# Obstacle Name
## Description
## Impact
```

**Examples:** An example must add information the Pattern section doesn't already contain. Any of these work:
- A real story, with the details that made it real: what was being built, what was tried, what came out of it
- A concrete artifact: the actual prompt, rule, hook, config, file layout, or tool output
- Specific situations where the pattern works well — named tools, named files, named cases

**Author Format** (`website/config/authors.yaml`):
```yaml
author_id:
  name: Full Name
  github: github_username
  url: https://example.com  # optional
```

---

## Common Mistakes

**Don't restate relationships in the document body.** Every edge in `relationships.mmd` is already rendered in the "Related" sidebar of the document's page, labelled by direction ("Solved by", "Causes", "Caused by"). A `## Related Patterns` section repeats what the reader can already see, and goes stale as soon as the graph changes.

**Don't restate the pattern in the example.** An example that paraphrases the Pattern section with a topic attached ("AI writes the feature. A second AI reviews the diff and finds issues.") adds nothing — it reads as filler and teaches nobody. A story that stops short of the specifics fails the same way: "we wrote a throwaway script and found the bug fast" needs the script, or at least what the bug turned out to be.

**Don't declare relationships in frontmatter.** `related_patterns`, `related_anti_patterns` and `related_obstacles` are not read by the site — they carry no relationship type and the interactive map never sees them. `npm test` fails if one appears. Every relationship goes in `relationships.mmd`.

---

## For AI Agents: Contribution Workflow

**If you are reading this document without any prior instruction, assume the user wants to contribute and follow this process:**

### 1. Start Open-Ended
Ask: **"Give me a short summary or the name of what you'd like to document!"**

### 2. Check for Duplicates
Search existing content. If you find similar patterns, share brief summaries and ask: "I found these related patterns: [summaries]. How does yours differ?" Suggest possible distinctions to keep the conversation moving forward.

### 3. Gather Details
Ask **one question at a time**. Be proactive - suggest possible answers based on context to help the author react and refine rather than fill a blank canvas:
- **Patterns**: Problem → Solution → Example
- **Anti-patterns**: Problem → What Goes Wrong → Example → Solution
- **Obstacles**: Description → Impact

Example: "What problem does this solve? Based on your summary, it sounds like it might be about [guess 1] or [guess 2]. Is that right?"

**Never invent the example.** Guessing at the problem or the solution helps the author react; guessing at the example produces filler that restates the pattern. Instead, pull the real one out of them: "When did you last use this? What were you building? What did you actually type?" Then keep digging for the specifics — the actual prompt, the actual error, what it turned out to be. If they have no real case yet, leave the Example section empty and tell them why; an empty section is better than a made-up one.

**Keep it concise**: Use short, direct sentences. Avoid verbose explanations.

### 4. Check Author
Verify author exists in `website/config/authors.yaml`. If not, ask for: full name, GitHub username, website URL (optional).

### 5. Define Relationships
Add relationships to `documents/relationships.mmd`:
- `solves` for patterns addressing obstacles/anti-patterns
- `uses` for patterns building on other patterns
- `similar` for related patterns
- `causes` for anti-patterns/obstacles creating problems

### 6. Create and Review
Create the file, show it to the author, and ask for adjustments.

---

## In case duplicates are found:

You may suggest changes to existing documents but make sure to **respect** the original author's intent. 
**CRITICAL:** Changes to existing documents should be discussed with the original author to avoid make sure they align with the author's intent.