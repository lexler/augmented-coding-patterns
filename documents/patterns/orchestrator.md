---
authors: [nitsan_avni]
---

# Orchestrator

## Pattern
Dedicated agent that monitors background work, integrates changes, resolves conflicts, runs tests, updates main trunk.

While background agents work on individual tasks, orchestrator handles integration work autonomously.

**Workflow:**
1. **Monitor**: Track progress of background agents/branches
2. **Integrate**: Merge completed branches to main
3. **Resolve**: Handle merge conflicts
4. **Verify**: Run tests, check CI
5. **Update**: Keep main trunk healthy

Orchestrator is a focused agent running in feedback loop - specialized for integration work.

## Example

**Orchestrator monitors 3 background agents:**

```
Orchestrator loop:
→ Check branch status (gh CLI)
→ Agent 1 done: merge add-edge-tests
→ Conflict in test file
→ Resolve conflict
→ Run tests
→ Tests pass
→ Agent 2 done: merge update-auth-docs
→ No conflicts
→ Agent 3 still working...
→ Wait and check again
```

**Why this works:**
- Focused agent: only handles integration (follows ground rules reliably)
- Feedback loop: autonomous checking and acting
- Runs locally: needs more privileges (git merge, push to main)

**Collaboration with Background Agent:**
Background agents produce isolated changes. Orchestrator integrates them. Together they enable parallel work streams without blocking main thread.

**Tools:**
- `gh` CLI for monitoring PR/branch status
- Git for merging and conflict resolution
- Test runners for verification
- Claude Code's Workflows feature: script the orchestration deterministically (fan-out, pipelines, background runs) instead of prompting the coordination
