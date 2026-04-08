---
authors: [lada_kesseler]
video: https://www.youtube.com/watch?v=_LSK2bVf0Lc&t=3575s
---

# Chain of Small Steps

## Problem
AI degrades under complexity. Complex, multi-step tasks often fail or produce incorrect results when attempted in one shot. AI loses track of requirements and context as complexity increases.

## Pattern
You have to manage the complexity. Break complex goals into small, focused, verifiable steps. Chain them together:
1. Identify the complex goal
2. Break it into small, independent steps
3. Execute each step with AI, verify it works
4. Commit or save progress after each step
5. Move to the next step, building on verified foundation

Small steps are reliable. Each has narrow focus, which AI handles well. Verification catches problems early before they compound.

## Example
Hack4Good hackathon - needed version numbering for rapid releases (v1 → v51):

**Instead of**: "Add automated version bumping to the app"

**Small steps**:
1. **Step 1**: Add version variable to JavaScript (starting at 001) and display it in settings UI
   - Small change to existing code
   - Verify: version shows in UI
   - Commit

2. **Step 2**: Write `update-version.sh` script that reads and increments patch version
   - New focused script, single responsibility
   - Test: run script, verify version increments
   - Commit

3. **Step 3**: Create git hook to run script automatically on push
   - New focused piece, single responsibility
   - Test: make commit, verify version bumps automatically
   - Commit

Result: fully automated version bumping. Each step was manageable for AI, verified before moving on. Complex goal achieved through chain of simple steps. 