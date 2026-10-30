---
authors: [mathias_soeholm]
---

# Session Residue

## Description

AI writes artifacts relative to the session that produced them, not as standalone descriptions of the current state. Reversed decisions, superseded approaches and user corrections stay in the generated text. The content is correct, but it describes the current state by comparing it with earlier states that the reader never saw.

For example, a session first puts a `/compatibility` prefix on all endpoint paths, then removes it. The final plan file lists the endpoint paths and adds "(does not include the `/compatibility` prefix)". A reader of the plan has never seen that prefix, so the note only raises the question of why it is there.

## Root Causes

LLMs generate text from the current request and the conversation history. A correction adds to that context; it does not erase earlier approaches or responses. Those details can continue to influence the artifact.

The model also writes for the wrong reader. It treats the artifact as a reply to the latest correction, so the text answers the user in the session instead of a future reader who has only the result.

In [_LLMs Get Lost in Multi-Turn Conversation_](https://arxiv.org/html/2505.06120v1), Appendix F.2, researchers found that even entirely correct Python programs and SQL queries were longer when requirements arrived across multiple turns. They attribute this "answer bloat" to models retaining earlier assumptions and relying too heavily on previous answer attempts.

This is consistent with Session Residue, though the study did not directly test unnecessary historical references in documentation or code comments.

## Impact

- Misleads the reader, who looks for a reason the earlier state matters
- Goes stale fast: "now", "instead of" and "no longer" become wrong after the next change
- Comments describe the change, not the code. This is the "comment as changelog" smell ("Journal Comments" in _Clean Code_); the commit message and pull request already record the change
- Each change in the session can leave another trace, so the noise builds up
- When an agent later reads the artifact, the residue puts the rejected option back into its context, causing Negative Bleedthrough
