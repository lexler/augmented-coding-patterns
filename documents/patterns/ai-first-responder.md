---
authors: [ivett_ordog]
---

# AI First Responder

## Problem

During incidents fast response time is key. Since most incidents start with the same safe read-only steps, this work can be done without human intervention. The incident response team can hit the ground running.

## Pattern

Trigger an AI agent on the alert. Give it read-only access to production. By the time the human is on the call, the agent has gathered context, formed a hypothesis, and posted it to the incident channel. Sometimes a draft fix is waiting too.

Production access stays read-only. Any change is a draft PR, a recovery script, or a one-click button the human approves.

This can be a single agent or a multi-agent setup, depending on the alert.

## Example

A setup might work like this:

**Check if the alert has a recorded first-response playbook.** If yes, follow it.

A playbook can:
- Validate whether this is a known issue with a known fix
- Post a summary to the incident response channel
- In the best case, offer a short proof that the agent found the right issue and a button that applies the fix (reconfigure the load balancer, restart a job, etc.)

**If no playbook applies, the coordinator agent spawns sub-agents in parallel:**
- One reads logs and code
- One scans past incidents for similar signatures
- One reviews recent commits for potential culprits

The coordinator collects their findings, posts a summary to the incident response channel, and may spawn more agents to draft a PR, a recovery script, or step-by-step instructions for the on-call engineer.
