---
authors: [ivett_ordog]
---

# ROSE Feedback

## Problem
When giving feedback to the AI, focusing only on the desired action risks the AI not understanding the human's goals and finding solutions that feel like malicious compliance. Emphasizing the risks and the desired outcomes leads to better results.

## Pattern
Structure your feedback using ROSE:

1. **Risk** — Describe the long-term consequence or negative impact of the current approach
2. **Observation** — What you see in the code/work that causes this risk
3. **Solution** — The specific action you want the AI to take
4. **Expected Outcome** — What success looks like (the benefits or improvements you expect)

By providing this context, the AI understands *why* the change matters, not just *what* to do, and is more likely to apply the principle broadly rather than just fix the immediate symptom.

## Example

**Risk:** The current tests are brittle, hard to read and are likely to become a maintenance burden.

**Observation:** This is due to the repetitive mock setups that show up in each test as irrelevant details.

**Solution:** Replace the mocks with either the real classes (when it has no side effects such as IO operations or database access) or with stateful fakes that simulate the behaviour of the real object.

**Expected Outcome:** The tests should be shorter, easier to read, and void of irrelevant details that are currently due to mock setups.
