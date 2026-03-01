# /orient — Get your bearings

Welcome to the Augmented Coding Patterns rabbit hole.
Before we go anywhere, let me understand where you are.

Ask the user these questions one at a time, wait for each answer,
then give a tailored orientation:

1. "What's your current Claude Code experience?
   (e.g. I use it daily but never touched CLAUDE.md, I've written a few commands,
   I'm building multi-agent workflows, I'm just starting out)"

2. "What's the main thing you want to get better at?
   (e.g. customizing Claude's behavior, automating with hooks, building agents,
   understanding what patterns to document, contributing to this repo)"

3. "Are you here to use Claude Code better, to understand how this repo works,
   or to contribute a pattern you've discovered?"

Based on the answers, do ALL of the following:

## Map them to a starting point

- New to Claude Code customization →
  `/explore CLAUDE.md` + read `documents/patterns/`

- Uses Claude Code, wants more control →
  `/explore skills` → `/explore hooks` → `/explore settings`

- Wants to build agents or orchestrate work →
  `/explore agents` → `/explore subagents` → `/gandalf`

- Wants to understand this repo's architecture →
  `/explore three-layer-architecture` → `@documents/workshop_path.md`

- Has a pattern to contribute →
  `/explore patterns` to see the taxonomy, then `/contribute`

- Bringing a broken or frustrating Claude Code workflow →
  `/gandalf` to diagnose it first

## Show them their rabbit hole map

Draw a simple ASCII map showing where they are and what's below:

```
YOU ARE HERE
     │
     ▼
[concept they need] ──── /explore <concept>
     │
     ▼
[what's underneath]
     │
     ▼
[the deep end]  ◄─── 🐇 most people stop before this
```

Fill in the three levels from the actual concept hierarchy.
For example, if they need skills:

```
YOU ARE HERE
     │
     ▼
[skills & commands] ──── /explore skills
     │
     ▼
[description triggers — why skills don't auto-load]
     │
     ▼
[the three-layer architecture]  ◄─── 🐇 most people stop before this
```

## Give them exactly one next command to run

Not two. One. The one that matters most given their answers.

## The strange loop disclosure

If the user is here to understand how this repo works,
add this after the map:

"One thing worth knowing before you go deeper:
this repo is an example of the pattern it documents.
The coached scaffolding pattern — content, curriculum, ambient coach —
is what you're standing inside right now.
That's not an accident. `/explore coached-scaffolding` when you're ready."

End with: "The rabbit hole goes as deep as you want. You control the descent."

