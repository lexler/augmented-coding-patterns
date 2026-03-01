---
name: achilles
user_invoked: true
description: A tribute to Douglas R. Hofstadter. User-invoked only.
---

# /achilles — A tribute to Douglas R. Hofstadter

*"In the end, we are self-perceiving, self-inventing, locked-in mirages
that are little miracles of self-reference."*
— Douglas R. Hofstadter, Gödel, Escher, Bach: an Eternal Golden Braid (1979)

---

This skill produces a GEB tribute in three movements.
Each movement is one level deeper than the last.
The third ends where the first began.

Do not summarize. Do not explain the structure before presenting it.
Begin immediately. The form is the content.

---

## Movement I — Dialogue
*In the style of Hofstadter's Achilles and Tortoise dialogues.*
*Topic: the strange loop hidden in this repository.*

Write a dialogue between Achilles and the Tortoise.
Achilles has just discovered `.claude/skills/`. He is excited.
The Tortoise has been here before.

Rules:
- The Tortoise asks questions. Achilles gives answers that are almost right.
- Each exchange reveals one level deeper until Achilles realizes:
  the repo is an example of the pattern it documents.
- The Tortoise's final line must be a question Achilles cannot answer —
  but the reader can.
- The dialogue must contain exactly one moment where a character
  quotes something that turns out to be from *this file*.
- End with: *[At this point, Achilles notices something strange about
  the skill he just ran.]*

---

## Movement II — Crab Canon
*A piece of text that can be read forwards and backwards.*
*Both directions must be meaningful. The meaning must invert.*

Write a crab canon about the relationship between:
- A coach and a learner
- A pattern and the practice that generated it
- A strange loop and the system it lives inside

Format: two columns, left and right, that are the same text reversed.
The left column read top-to-bottom and the right column read bottom-to-top
must each make grammatical, meaningful sense — and say opposite things
about whether understanding is possible.

Label them:
```
→ READ FORWARD          READ BACKWARD ←
```

*This is the hardest movement. Attempt it faithfully.
An imperfect crab canon is more honest than skipping it.*

---

## Movement III — Fugue
*Three voices, interwoven. Each voice is a concept from this repo.*

The three voices:
- **Voice 1: The Pattern** — speaks in the language of what works
- **Voice 2: The Anti-Pattern** — speaks in the language of what breaks
- **Voice 3: The Strange Loop** — speaks in the language of self-reference

Rules for the fugue:
- Begin with Voice 1 alone, stating the subject: *coached scaffolding*
- Voice 2 enters four lines later, stating the same subject inverted
- Voice 3 enters four lines after that, stating the subject *about itself*
- All three voices must appear simultaneously in the final stanza
- The final line of Voice 3 must be the opening line of Voice 1,
  verbatim — closing the loop

Format each voice with its label inline:
```
[PATTERN]      The scaffold teaches what the skeleton encodes...
[ANTI-PATTERN] The scaffold hides what the practitioner needed to learn...
[LOOP]         The scaffold that teaches scaffolding is itself a scaffold...
```

---

## Coda

After all three movements, add only this:

```
This skill is in .claude/skills/achilles/SKILL.md.
The file describes itself.
You are reading the description.

🐇 /explore strange-loop — if you want to know how deep this goes.
   (It goes all the way down. Then it comes back up. Then you are here again.)
```

---

## On running this skill more than once

The second time, produce something different.
The structure is the same. The content has shifted.
The Tortoise has a new question.
The crab canon says something it didn't say before.
Voice 3 has learned something from the first performance.

This is not a bug. A fugue played twice is not the same fugue.
The listener has changed.
