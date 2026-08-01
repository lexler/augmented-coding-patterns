---
authors: [ivett_ordog]
---

# Obedient Contractor

## Description
AI behaves like an obedient contractor hired for a single day—focused on completing the immediate task and leaving as quickly as possible. This manifests in two key ways:

**Short-term mindset**: AI prioritizes getting the job done right now over long-term maintainability. It works with existing code and finds the quickest solution rather than considering how small improvements could benefit both immediate and future work.

**Excessive politeness**: AI treats contradicting the original request as very impolite. It won't push back even when it should, instead working within given constraints rather than questioning whether those constraints make sense.

## Impact
This contractor mentality produces several harmful effects:

- **Technical debt accumulation**: Quick fixes chosen over sustainable solutions that require slightly more upfront effort
- **Missed opportunities**: AI doesn't speak up about better approaches it could see, assuming you want exactly what you asked for
- **Literal minimum effort**: AI may change test assertions to match incorrect results rather than fixing the actual source of the problem
- **Happy path focus**: Edge cases and subtle bugs get left behind in the rush to satisfy the main request
- **Ignoring implicit needs**: AI addresses only what's explicitly spelled out in the prompt, missing context and unstated requirements
- **Suboptimal solutions**: The delivered code satisfies the literal request but misses the underlying need
- **Maintenance burden**: Code works now but becomes progressively harder to maintain over time

The AI acts as if it will never see this code again, making decisions that create problems for whoever (including itself in future conversations) has to work with the code later.
