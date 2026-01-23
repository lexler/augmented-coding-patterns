---
authors: [emilybache]
---

# Follow Obvious Fix
## Problem
Build tools, package managers, linters, and compilers often provide an explicit next step to resolve a failure.

Rather than wasting focus and tokens trying to assess options, follow the suggested fix. Especially if it is low-risk and purely "infrastructure" (deps, tooling, environment).

## Pattern
If the error message contains a suggested fix, do that first—*when it’s low-risk and tool/infrastructure-focused*.

Guidelines:
- Prefer suggestions that are **reversible** and **don’t touch core business logic**.
- Be cautious with suggestions that are **destructive** (deleting lockfiles, wiping caches broadly, resetting environments).
- After applying the suggestion, **re-run the original command**. Continue based on the new output.

## Example
Error message:

> Could not find the proper version of rake (13.3.1) in any of the sources. 
> Run 'bundle install' to install missing gems.

Do the suggested fix first:

    bundle install

Then re-run the original command. If it still fails, you now have a more current error to act on—without unnecessary guesswork.
