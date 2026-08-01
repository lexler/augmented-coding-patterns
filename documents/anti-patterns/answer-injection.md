---
authors: [lada_kesseler]
video: https://www.youtube.com/watch?v=_LSK2bVf0Lc&t=5752s
---

# Answer Injection

## Problem
The way you ask a question can dramatically limit the solution space without you realizing it.

By putting solutions in your questions, you're limiting AI to your preconceived approach instead of leveraging its breadth of knowledge. You're preventing yourself from discovering things you don't know exist, or better approaches.

This is sneaky and hard to detect - you don't realize you're limiting yourself, but you can be really missing out.

## What Goes Wrong
AI has read about countless approaches you haven't considered. By injecting your solution into the question, you:
- Miss creative alternatives
- Get confirmation of your idea instead of exploration
- Waste AI's breadth of knowledge
- Often get suboptimal solutions

## Examples

**Simple case - Team celebration:**
- Asking: "Which fancy restaurant should I book for my team's celebration?" → Got restaurant suggestions only
- Asking: "Give me suggestions for team celebration" → Got restaurants, outdoor activities, team building events, budget options

The first question injected "fancy restaurant" as the answer. The second left it open.

**Arbitrary limits:**
"Give me 3 questions to understand this." Why 3? Maybe AI has 1 crucial question or 5.
- If it has 1, it makes up 2 more - wasting your time
- If it has 5, you miss the 4th which might be the key one

**Surfacing unknown unknowns:**
Wanted two Claude Code instances to communicate. Asked "Can Claude Code communicate with another Claude Code?"

AI researched Claude's features: "No, Claude Code doesn't have inter-instance messaging." Dead end.

Later, while experimenting with launching instances, accidentally discovered that terminal commands sent to one instance appeared in another. Wait... that IS messaging. It IS possible.

Only then realized: my first question got interpreted as "Does Claude Code have a built-in messaging feature?" AI answered that question correctly (no), but I didn't know that's how it understood me.

Reformulated: "I have two terminal windows. How can I send a message from one to another?"

AI: "You could use tmux, and there's also AppleScript - any application on Mac can talk to each other."

Discovered an entire automation layer I didn't know existed. Built a lightweight messaging system.

What went wrong: First question accidentally narrowed AI to Claude Code's feature set when the real solution was at the OS level. The narrowing was invisible to me - I didn't realize AI had interpreted my question that way until the accident showed me what was actually possible.

**Email processing:**
Needed to process emails during a Hackathon. Asked "how to connect to email servers?" Got complex server setup. Real need: automate locally on user's computer. Asked for simpler local solution - got email extraction + Python processing that fit within complexity and constraints. No servers needed.

## Solution
Present the problem, not your solution:
- State what you're trying to achieve, not how
- Go as far back from the solution as possible
- Remove arbitrary constraints (numbers, specific tech)
- Let AI's breadth reveal unknown unknowns
- AI is incredibly well-read - use that