---
authors: [nitsan_avni]
---

# Coerce to Interface

## Context
You're aiming for either a standardized way of doing something or a verified-to-work approach.

## Pattern
Design MCP tool interfaces that enforce structure through their API definition. Required fields, enums, and typed parameters become constraints the agent cannot bypass.

The interface itself documents usage - well-named fields and clear types reduce the need for separate explanations.

This shifts enforcement from instructions ("please include a title") to mechanism (the tool requires a `title` parameter).

## Example

**Learning MCP with constrained interface:**

```typescript
{
  name: "add_learning",
  parameters: {
    filename: { type: "string", required: true },
    title: { type: "string", required: true },
    topic: { type: "string", required: true },
    oneLiner: { type: "string", required: true },
    context: { type: "string", required: true },
    examples: { type: "string", required: true },
    tags: { type: "array", items: { type: "string" } },
    related: { type: "array", items: { type: "string" } }
  }
}
```

Every learning has identical anatomy. No variation possible. Results are immediately searchable by topic, filterable by tags, linkable through related fields.

