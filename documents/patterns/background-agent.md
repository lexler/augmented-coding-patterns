---
authors: [nitsan_avni]
---

# Background Agent

## Pattern
Delegate standalone tasks to background agents running in parallel while you stay focused on main work.

**Workflow:**
1. **Collect**: During main work, capture todos/ideas in markdown file (GTD-style)
2. **Identify**: Find tasks that are standalone, well-sized, clear enough to delegate
3. **Spawn**: Launch background agent per task (separate branch/context)
4. **Continue**: Stay focused on main thread while agents work in parallel
5. **Integrate**: Review and merge results when ready

**What makes a task ready for background agent:**
- Standalone: doesn't block your current work
- Well-sized: clear scope, not too big
- Clear enough: agent can execute without constant guidance

Human stays on main thread. Agent works asynchronously.

## Example

**Main work: Refactoring authentication flow**

While working, you notice:
- Tests are missing for edge cases
- Documentation needs updating
- Dead code should be removed
- Logging format is inconsistent

Collect these in `todo.md`. Each is standalone and clear.

Spawn background agents:
- Agent 1: Add edge case tests (branch: `add-edge-tests`)
- Agent 2: Update auth docs (branch: `update-auth-docs`)
- Agent 3: Remove dead code (branch: `cleanup-dead-code`)

You continue refactoring. Agents work in parallel on their branches.

**Tools that enable this:**
- Claude Code GitHub app: runs agents in GitHub Actions, creates branches
- Multiple chat windows/sessions
- Separate working directories (git worktrees)
