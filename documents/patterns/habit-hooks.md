---
authors: [ivett_ordog]
video: https://www.youtube.com/watch?v=GyI5qU9MNJU&t=775s
---

# Habit Hooks

## Problem
Enforcing high coding standards without bloating AI's context with extensive style guides is challenging. Generic reminders either get forgotten as conversations progress or consume too much context when repeated constantly. You want AI to follow your specific coding practices, but explaining them repeatedly is inefficient and unreliable.

As Kent Beck said: "I'm not a great programmer, I'm a good programmer with great habits." The challenge is giving AI those same good habits.

## Pattern
A habit is an action taken in response to a trigger. To simulate this, we use **deterministic** scripts that detect triggers (for example quality violations) and provide **actionable** prompts.

Optionally habit hooks can be blocking (for example the pre-commit hook can prevent commits until the triggers are resolved) and may have a snooze feature that the human can use to ignore false positives.

This approach reduces context bloat while improving compliance by providing precise, relevant guidance exactly when violations occur, rather than front-loading massive instructions that AI forgets or misapplies.

Habit Hooks are Contextual Prompts applied to tools you can't modify: a deterministic detector provides the trigger, Hooks provide the delivery, and the prompt provides actionable coaching.

An open-source implementation is available at https://github.com/habit-hooks/habit-hooks/

## Example

### Common Quality Checks and Their Prompts

**Duplication Detector**
- Trigger: Identical or near-identical code blocks detected
- Prompt: "Test code duplication detected. Extract common test utilities, fixture handling, or assertion patterns into shared helper functions."

**Feature Envy Check**
- Trigger: Method primarily uses data/methods from another class
- Prompt: "Consider moving these methods to the class they depend on most, or extract shared behavior."

**File Size**
- Trigger: File exceeds line count threshold
- Prompt: "Split these files into smaller, focused modules immediately."

**Function Size**
- Trigger: Function exceeds complexity threshold
- Prompt: "Analyze responsibilities first - what distinct concerns does this function handle? Consider: (1) Are these separate responsibilities that belong in different methods? (2) Should this become a class with multiple methods? (3) Can you group cohesive data into objects to reduce local variables? Avoid mechanical extraction - find true responsibility boundaries. If the code has many misplaced responsibilities you may need to first inline methods to see the whole picture and find a better way of redistributing functionality. Think of this when reducing line count seems particularly hard. Taking a step backwards may open up new, better possibilities."

**Git Diff Size**
- Trigger: Uncommitted changes exceed threshold
- Prompt: "Commit smaller incremental changes with passing tests to maintain code quality."

**Linter Errors**
- Trigger: Linting violations detected
- Prompt: "Run `npm run lint:fix` to automatically fix many of these issues. Manual fixes may be needed for logical errors."

**Dead Code Detector**
- Trigger: Unused methods/functions detected
- Prompt: "Remove these unused methods to maintain codebase clarity."

**Comments Remover**
Some behaviors are almost impossible to get AI to stop doing reliably because their whole training contradicts it. For example,  reliably getting it to stop commenting code. It's easier to let it add the comment and have an auto-detecting hook provide it feedback to take the comment out.
- Trigger: using tools Write|Edit|MultiEdit
- Prompt: Do not write code comments, prefer expressive self-documenting names and code

### Implementation Tips

AI can generally create these hooks with minimal prompting. The key is:
- **Specificity**: Each prompt should be actionable and specific to the violation
- **Context efficiency**: Inject guidance only when needed, not upfront
- **Treat as user prompts**: Include guidance in your agent file to treat these prompts as user prompts

A hack that tends to work well is including a 🙂💬 emoji pair in the generated prompts, and mentioning their meaning in the agent file as CRITICAL.
