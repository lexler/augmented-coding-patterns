---
authors: [ivett_ordog]
alternative_titles: ["Show me, I will repeat-automate"]
video: https://www.youtube.com/watch?v=9dyGJ2cg8p4&t=258s
---

# Show the Agent, Let it Repeat/Automate

## Problem
AI's non-deterministic nature means it interprets the same task differently each time. Without codified knowledge, you waste time explaining the same mistakes repeatedly, especially for tasks that require multiple iterations (like migrations, refactoring patterns, or complex chores).

## Pattern
Turn collaborative work into either reusable knowledge for AI-assisted repetition or full automation:

1. **Identify** a task that will be repeated multiple times
2. **First iteration**: Work through it together with the AI
3. **Document**: Ask the AI to "Document how we [task description] as a process file in [filename.md]. Focus on things you wish you had known before starting the task. The audience is future AI agents working on similar tasks."
4. **Second iteration**: AI attempts the task using the documentation while you correct mistakes
5. **Refine**: Ask the AI to "Refine the document based on things you wish you'd known when starting"
6. **Repeat** refinement cycles until AI can work independently
7. **Automate (optional)**: For mechanical steps, ask AI to identify and automate them, potentially reducing required context window or eliminating AI involvement entirely

The documentation becomes a living knowledge base that captures effective patterns, common gotchas, and context-specific constraints. Automation can transform AI-assisted processes into self-running systems.

## Example

### Example 1: AI-Assisted Repetition (Database Migration)
**Task**: Migrating legacy MongoDB application to SQL in a messy codebase where one-shot prompting consistently failed.

**Process**:
- First migration done collaboratively, discovering test writing patterns, preferred migration tools, and typical oversights from poor code quality
- Created purpose-built testing and migration infrastructure together
- Documented the complete process including tool usage, test examples, and gotchas
- Second migration attempted by AI with corrections
- Documentation refined based on lessons learned
- Result: AI completed all subsequent migrations independently except the first two

### Example 2: Full Automation (Tax Processing)
**Task**: Processing invoices for tax reporting (non-coding task).

**Process**:
- Showed coding agent the manual process of handling invoices
- AI identified mechanical steps that could be automated
- Created automation: send invoices to an email address → AI sorts, parses, and generates necessary reports
- Result: Eliminated need for AI involvement in routine execution; process runs automatically

**Benefits of automation path**:
- Significantly reduces or eliminates required context window
- Transforms AI-assisted process into self-running system
- Frees AI for more complex, judgment-requiring tasks

**Generic task descriptions for documentation**:
- "migrated this MongoDB collection to a Postgres database"
- "refactored this part of the system to hexagonal architecture"
- "extracted this legacy component into a microservice"
