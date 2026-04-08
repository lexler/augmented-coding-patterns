---
authors: [lada_kesseler]
video: https://www.youtube.com/watch?v=_LSK2bVf0Lc&t=2917s
---

# Offload Deterministic

## Problem
AI is non-deterministic. Using it for deterministic work (counting, parsing, exact operations, repeatable  tasks) produces unreliable results.

Every time you ask AI to do something deterministic, there's a chance it does it wrong.

## Pattern
AI is bad at determinism. Code is good at it. Use the right tool for the job.

**Don't ask AI to do deterministic work. Ask AI to write code that does it.**

Then you run that code every time you need it - reliable and repeatable.

**Use AI to explore. Use code to repeat.**

1. Identify the deterministic task (counting, parsing, repeating exact operation)
2. Ask AI to write a script for it
3. Test and tweak the script until it works how you want
4. Run the script whenever you need it

AI figures out the tricky bits (Puppeteer config, parsing logic, edge cases). You get reliable, repeatable execution.

## Examples

**Counting:**
Don't ask AI to count Rs in "strawberry" - it's bad at counting.
Instead: Ask it to write bash - you'll get something like this that you can test and that is deterministic: `echo "strawberry" | grep -o "r" | wc -l`

**Capturing screenshots:**
Need to update app screenshot frequently. Don't ask AI each time to "take screenshot using Puppeteer" - unreliable.

Instead: "Make me a shell script to capture screenshot at iPhone dimensions." AI figures out Puppeteer,
dimensions, error handling. Script fails first try - puppeteer not installed. AI adds Safari fallback. Now
you have `capture_screenshot.sh`. Run it anytime - reliable every time.

**Converting diagrams:**
Mermaid → DrawIO conversion needed repeatedly. Gave AI examples, it wrote conversion code. Tweaked colors and
formatting. Now every update is quick and reliable.

**Making tools makes you more capable.** AI helps you create the tools quickly. Code makes them reliable.
