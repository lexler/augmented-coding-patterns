---
authors: [lada_kesseler]
---

# Lenses

## Problem
When you ask AI to do something, it often silently considers only a narrow slice of what matters. Ask it to improve code and it fixes what it happens to notice, then says "looks good". It doesn't think about all the things you would, and you can't see what it skipped.

Asking for everything at once doesn't help. "Build the feature, and keep names clean, and remove dead code": the main goal wins and the extras slip.

## Pattern
> The only way to think about everything is to think about one thing at a time.

Widen on purpose: look at the work through one lens at a time.

A lens is one point of view that becomes the only goal of a pass. Like colored glasses, each one shows what the others hide.

A lens has:
- **An area**: one kind of problem (dead code, naming, error handling, vague wording)
- **A few things to look for**: something concrete for AI to latch onto
- **An open question**: ask for what the list missed

Jesse Schell's *The Art of Game Design: A Book of Lenses* describes a similar idea for game design: lenses are perspectives, "small sets of questions you should ask yourself about your design."

Your set of lenses is a checklist of points of view. Narrow each pass to widen the whole:
- Each lens converges: AI's full attention goes to one area
- The set diverges: together the lenses cover ground AI would never visit on its own

Build the set from what you see go wrong: each time you notice a way AI fails, add a lens that looks for exactly that. The set grows over time.

Use lenses when AI reviews or improves work: a Feedback Flip, a Refinement Loop, a code review. A plain review checks only what AI happens to think of; lenses make it check what you care about. Loop each lens until it finds nothing new.

With every list you give, there's a chance AI won't think about anything that isn't on it. So ask for what you didn't think of:
- At the end of each lens: "What else in this area should we worry about that the list didn't mention?"
- After all the lenses: "What else is wrong here that none of the lenses covered?"

## Example
Refactoring a kata with AI. Asked to improve the code in a loop, it stopped early and declared the code good enough. It wasn't. Re-running the same "improve this code" prompt helped for a while, then every pass answered "it's good enough", while it still hadn't thought about many things I would. Pointing each pass at one type of problem (dead code first, then naming, and so on) made it find problems it had passed over, and the code got much better, quickly.

One lens from that refactoring set:

```markdown
# Lens: Formatting

The surface layer. Dead code, unused imports, inconsistent formatting — noise that obscures what matters.

## The Question
What in this code is just noise that can be removed?

## Look For
- Unused imports
- Dead code
- Inconsistent indentation or spacing
- Redundant wrappers (try/except that just re-raises)

## Process
Scan each file. What can be deleted without changing behavior? What formatting inconsistencies stand out?

## Go Deeper
What else is noise? What other formatting issues exist?
```

This works beyond code too: lenses for the issues you keep seeing in tests, or for AI writing habits in documents.
