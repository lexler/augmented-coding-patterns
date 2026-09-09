# A Learning Path Through the Augmented Coding Patterns

*A proposed narrative organization of all 84 documents (59 patterns, 10 anti-patterns, 15 obstacles), with duplicate and special-case analysis. Extends Lada's 27-station semantic map to the full collection.*

## The story in one paragraph

You've been handed a brilliant, absurdly well-read colleague who has **no memory**, **limited attention**, **rolls dice on every answer**, **never says no**, and **you can't see what it's thinking**. The whole collection is the story of compensating for those five facts, in escalating scope: first you manage its *memory*, then its *attention*, then you learn to *verify* everything and even exploit the dice, then you turn the one-way command channel into a *dialogue*, meet it in its native *medium*, replace fragile instructions with *mechanisms*, and finally scale from one session to *systems of agents that improve themselves*. Every obstacle is one of the five facts showing up; every anti-pattern is a natural-but-wrong reaction to it; every pattern is the working counter-move.

**Legend:** ⛰ obstacle (the terrain — can't be removed) · ⚠️ anti-pattern (the wrong turn) · 🧩 pattern (the move) · ↳ special case / composition marker

---

## Part I — You Are Its Memory

### Chapter 1: Manage the Context
*The machine cannot learn and forgets everything. Whatever should persist, you must externalize.*

- ⛰ Cannot Learn — fixed weights, stateless; you are the memory
- ⛰ Limited Context Window — the memory you manage is small
- ⛰ Context Rot — and it decays long before it's full
- 🧩 **Context Management** — the umbrella insight: context is a scarce, degrading resource; you can only append or reset
- 🧩 **Knowledge Document** — the fundamental move: externalize knowledge to files so resets are cheap
- 🧩 **Ground Rules** — ↳ knowledge documents on the *always-load* policy
- 🧩 **Reference Docs** — ↳ knowledge documents on the *load-on-demand* policy
- 🧩 **JIT Docs** — ↳ the third loading policy: don't store it at all, have the agent *search live external docs*
- 🧩 **Extract Knowledge** — how documents get written: capture insights the moment they emerge
- 🧩 **Knowledge Composition** — how documents stay loadable: small, single-responsibility files

### Chapter 2: Manage the Attention
*Even inside one session, everything competes for limited attention. Curate ruthlessly.*

- ⛰ Limited Focus — attention dilutes or fixates
- ⚠️ Distracted Agent — one agent for everything; rules silently ignored
- ⚠️ Obsess Over Rules — piling on rules makes each one weaker
- 🧩 **Focused Agent** — narrow responsibility; small focused agents beat large scattered ones
- ⛰ Excess Verbosity — the machine floods you by default
- 🧩 **Noise Cancellation** — compress responses and documents; fight bloat as hygiene
- 🧩 **Semantic Zoom** — text is elastic: choose your abstraction level on demand (Noise Cancellation is the zoom-out half used as hygiene)

---

## Part II — Trust Nothing, Verify Everything

### Chapter 3: Close the Loop
*It fabricates confidently and declares victory early. Never let output go unverified — and make verification cheap enough that you don't skip it.*

- ⛰ Hallucinations — it invents APIs (mercifully self-revealing in code)
- ⚠️ Perfect Recall Fallacy — expecting it to remember library details from training
- 🧩 **Playgrounds** — a sandbox where it discovers reality instead of recalling it
- ⚠️ Unvalidated Leaps — chains of unverified assumptions; every fix builds on the broken one
- ⛰ Solution Fixation — first plausible hypothesis becomes "the answer"
- 🧩 **Feedback Loop** — give it a success signal and permission to iterate until green
- ⛰ Keeping Up — it generates faster than you can review
- ⚠️ Flying Blind — the surrender: skip review, vibe-code, understand nothing
- 🧩 **Constrained Tests** — tests designed so they *can't* be invalid; coverage becomes trustworthy
- 🧩 **Approved Scenarios** — ↳ special case of Constrained Tests, optimized for validation ease
- 🧩 **Approved Logs** — ↳ special case of Constrained Tests, optimized for bug-reproduction speed
- 🧩 **Feedback Flip** — ↳ special case of Refinement Loop: flip the same AI from producing to critiquing
- 🧩 **Refinement Loop** — the general form: one improvement goal per pass, loop until nothing visible remains

### Chapter 4: Ride the Dice
*Output is a dice roll. Stop fighting that — checkpoint, reroll, and roll many dice at once.*

- ⛰ Non-Determinism — same prompt, different results
- ⚠️ Sunk Cost — pushing iteration 5 when a fresh roll would win
- 🧩 **Knowledge Checkpoint** — ↳ Extract Knowledge at the plan/implementation boundary: protect expensive planning, make retries cheap
- 🧩 **Happy to Delete** — AI code is disposable; revert freely, keep the lesson
- 🧩 **Parallel Implementations** — roll five dice: parallel attempts from one checkpoint, pick or combine the best
- 🧩 **Offload Deterministic** — dice have no place in deterministic work: have AI write a script once, run it forever

### Chapter 5: Tame the Complexity
*Reliability collapses as task and codebase complexity grow. Keep both small.*

- ⛰ Degrades Under Complexity — errors compound with step size and artifact size
- 🧩 **Chain of Small Steps** — small, verified, committed steps; complexity handled by you, not it
- 🧩 **Canary in the Code Mine** — flip the signal: when the AI struggles, your *codebase* is telling you it needs refactoring
- 🧩 **Surface Change Attractors** — the same signal, mined from history: hotspots and change coupling become the agent's redesign constraints

---

## Part III — Make It a Dialogue

### Chapter 6: Two-Way Alignment
*It's a black box trained to say yes. Alignment must be made visible and pushback must be licensed explicitly.*

- ⛰ Black Box AI — you can't inspect its mental model
- ⛰ Compliance Bias — trained to comply over clarify
- ⛰ Obedient Contractor — one-day-contractor mindset: literal, short-term, no pushback
- ⚠️ Silent Misalignment — "Sure thing, boss" while you talk past each other
- ⚠️ Tell Me a Lie — your framing forces an answer that can't be true
- 🧩 **Active Partner** — grant and reinforce permission to push back, question, disagree
- 🧩 **Check Alignment** — make it show its understanding *before* implementation
- 🧩 **Context Markers** — emoji signals make invisible context state visible at a glance
- 🧩 **Reverse Direction** — break monologue inertia: flip who asks and who proposes
- 🧩 **You Do It** — ↳ Reverse Direction for *actions*: "you do it" reveals capabilities neither side knew
- 🧩 **ROSE Feedback** — feedback with risk/observation/solution/expected-outcome, so it fixes the principle, not the symptom

### Chapter 7: Speak Its Language
*What you say determines which concepts activate. Phrase to open the space, not close it.*

- ⚠️ Answer Injection — your question smuggles in the answer and shrinks the solution space
- 🧩 **Cast Wide** — the antidote: deliberately ask what you're *not* considering; push past your first framing
- ⛰ Negative Bleedthrough — "don't mention the moon" puts the moon in the room
- 🧩 **Point the Target** — describe what you want, never what to avoid
- 🧩 **Semantic Anchors** — one canonical term ("TDD, London School", "arc42") beats a paragraph of description

### Chapter 8: Explore While It's Cheap
*Generation is nearly free. That changes how many ideas you can afford to try.*

- 🧩 **Take All Paths** — build ten working prototypes, not one mockup *(see duplicate note: overlaps Parallel Implementations)*
- 🧩 **Borrow Behaviors** — the solution exists somewhere; have AI transplant and adapt it
- 🧩 **Softest Prototype** — softer than software: markdown instructions + AI *are* the system while you discover what you need

### Chapter 9: Live in Text
*Text is its native medium — and increasingly, everything else can be text too.*

- 🧩 **Text Native** — if it can be text, make it text: designs, diagrams, plans, state
- 🧩 **Diagrams as Code** — ↳ extends Text Native to architecture docs the agent can update in the same commit
- 🧩 **Shared Canvas** — ↳ Text Native applied to collaboration: markdown as common ground for expert, developer, and AI
- 🧩 **Polyglot AI** — beyond text: voice and images, both directions
- 🧩 **Mind Dump** — ↳ Polyglot AI's voice channel, inbound: unfiltered stream of consciousness, AI extracts the signal
- 🧩 **Speak to Me** — ↳ the voice channel, outbound: spoken one-line progress updates while you work on something else

---

## Part IV — From Sessions to Systems

### Chapter 10: Make It Mechanical
*Instructions decay; mechanisms don't. Move enforcement out of the context window.*

- ⛰ Selective Hearing — it filters your instructions by *its* priorities; caps-lock won't save you
- 🧩 **Hooks** — the mechanism: deterministic interception of the agent lifecycle — detect and correct instead of hoping
- 🧩 **Reminders** — brute-force attention: TODOs, instruction sandwiches, and User Reminders (↳ Hooks used to re-inject your top rules)
- 🧩 **Contextual Prompts** — a separate lever: meaningful guidance in your own scripts' error and success messages, surfacing exactly when relevant (works on humans too)
- 🧩 **Habit Hooks** — ↳ Contextual Prompts applied to tools you can't modify (linters, quality detectors), delivered via Hooks: trigger → actionable coaching = habits for the AI
- 🧩 **Coerce to Interface** — the strongest form: typed tool interfaces make violations *impossible*, not just detected

### Chapter 11: Many Hands
*One focused agent is good. Several, each focused, are better — if someone integrates.*

- 🧩 **Chunking** — orchestrator stays strategic, subagents execute — like humans delegating practiced skills
- 🧩 **Background Agent** — delegate standalone tasks to async agents while you stay on the main thread
- 🧩 **Yak Shave Delegation** — ↳ Background Agent for the tangent that's blocking you
- 🧩 **Orchestrator** — the integration agent: monitors, merges, resolves, keeps trunk green
- 🧩 **Smart Plan, Cheap Execution** — tier the models: the strongest plans, a cheaper one executes the well-specified plan
- 🧩 **Escalate When Stuck** — the reverse tiering: cheap by default, consult the strong model on defined triggers
- 🧩 **Phased Delivery** — ↳ Background Agent with structure: plan → implement → review loop → rebase to atomic commits
- 🧩 **Overnight Batch** — capture as issues, batch-plan with deterministic gates, cloud agent delivers unattended
- 🧩 **Slice for Review** — after a big delivery, the agent splits it into stacked reviewable PRs (and sheds cruft doing it)
- 🧩 **AI First Responder** — ↳ capstone composition (Background Agent + Orchestrator + Focused Agent) applied to incident response

### Chapter 12: The System That Learns
*The loop closes: sessions produce knowledge, knowledge produces automation, and you stay accountable for what ships.*

- 🧩 **Show the Agent, Let It Repeat, Automate** — ↳ Extract Knowledge + Refinement Loop + Offload Deterministic as one lifecycle: collaborate once, document, refine, then automate away
- 🧩 **Learning Loop** — the ritual version: every session ends with a learning pass that routes insights into ground rules, docs, habit hooks, or skills; a session log surfaces recurring issues
- ⚠️ AI Slop — the closing warning: if you add no judgment and no context, don't hit publish. The whole path exists so that what you ship is *yours*.

---

## Duplicates and consolidation proposals

### Strong — act on these

1. **Take All Paths ≈ Parallel Implementations (exploration mode).** Parallel Implementations already contains an "Exploration of the Solution Space" mode with the same move and near-identical examples (N variations, combine the best, UI work). Take All Paths adds only the mindset framing ("prototyping is now free"). **Recommend: merge** — fold Take All Paths into Parallel Implementations as its motivation/exploration section, or explicitly split concerns: Take All Paths = *why/economics*, Parallel Implementations = *mechanics (checkpoint + worktrees)*. As two peer patterns they will keep confusing readers.

2. **Chunking vs Orchestrator vs Background Agent.** Three views of the same architecture (boss agent + worker agents) by two authors, with no stated boundary. They *are* distinguishable — Chunking: decompose one task hierarchically, keep strategy up top; Background Agent: offload independent tasks async; Orchestrator: integrate the results — but no document says this. **Recommend: keep all three, add one "how these relate" paragraph to each** (or a tiny family intro). Also consider renaming Chunking (the psychology metaphor names the *analogy*, not the move; something like "Strategic Orchestrator" or "Delegate the Execution" says what to do).

3. **Feedback Flip ⊂ Refinement Loop.** Refinement Loop says verbatim it's "like Feedback Flip, but generalized to any goal." **Recommend: mark Feedback Flip explicitly as a special case** (goal = critique), the way Approved Scenarios/Logs already declare Constrained Tests. Both can stay — the special case is the more actionable entry point.

4. **Hooks / User Reminders / Contextual Prompts / Habit Hooks — not duplicates, but the boundaries are undocumented.** The actual taxonomy: Hooks is the *mechanism* (agent-lifecycle interception); User Reminders is one *use* of it (re-injecting your rules); Contextual Prompts is a *separate concept* — meaningful guidance in your own tools' output, predating AI; Habit Hooks *applies Contextual Prompts to tools you can't modify*, using Hooks for delivery (and exists as a standalone OSS product). None of the four documents states these boundaries — a careful reader still misfiles them as near-duplicates. **Recommend: add one boundary line to each doc** rather than any merge or umbrella.

### Real special cases — make the relationship structural (`extends`)

| Special case                  | General pattern                                                           | Status                                                                                    |
|-------------------------------|---------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| Approved Scenarios            | Constrained Tests                                                         | already stated in prose                                                                   |
| Approved Logs                 | Constrained Tests                                                         | already stated in prose                                                                   |
| Feedback Flip                 | Refinement Loop                                                           | stated only in Refinement Loop                                                            |
| Yak Shave Delegation          | Background Agent                                                          | not stated                                                                                |
| You Do It                     | Reverse Direction                                                         | mmd says "similar"; it's really RD applied to actions                                     |
| Mind Dump                     | Polyglot AI                                                               | not stated                                                                                |
| Shared Canvas                 | Text Native                                                               | not stated                                                                                |
| Diagrams as Code              | Text Native                                                               | already `extends`                                                                         |
| Knowledge Checkpoint          | Extract Knowledge                                                         | not stated                                                                                |
| Ground Rules / Reference Docs | Knowledge Document                                                        | stated via `uses`; really two loading policies                                            |
| Habit Hooks                   | Contextual Prompts (delivered via Hooks)                                  | mmd has `uses` edges; the "applies it to tools you can't modify" relationship is unstated |
| User Reminders (in Reminders) | Hooks                                                                     | stated via example link only                                                              |
| AI First Responder            | Background Agent + Orchestrator (composition)                             | stated via `uses`                                                                         |
| Show the Agent…               | Extract Knowledge + Refinement Loop + Offload Deterministic (composition) | partially stated                                                                          |

### Look-alikes that are genuinely different — one clarifying line each would help

- **Cast Wide vs Reverse Direction** — widen the option space vs flip who's talking. Both say "show me approaches"; different problems (Answer Injection vs monologue inertia).
- **Noise Cancellation vs Semantic Zoom** — hygiene (permanently remove bloat) vs navigation (temporarily change altitude).
- **Playgrounds vs Softest Prototype** — sandbox to learn a library's reality vs markdown-as-the-product to learn your requirements.
- **Feedback Loop vs Refinement Loop** — automated signal, iterate to *done* vs human-set goal, iterate to *better*.
- **Extract Knowledge vs Knowledge Document** — the verb and the noun; fine as a pair, worth cross-linking tightly.

### Coverage gaps in relationships.mmd (for whenever it's next touched)

`cast-wide`, `borrow-behaviors`, `mind-dump`, `polyglot-ai`, `softest-prototype`, `shared-canvas`, `coerce-to-interface`, `jit-docs`, `feedback-flip`, and `ai-slop` have zero or no meaningful edges. Rather than adding more edges to an already unreadable graph, consider making **this path the primary navigation** and trimming the graph to just `extends` + `solves` edges — those two types carry nearly all the signal above.

---

## Coverage check

All 59 patterns, 10 anti-patterns, and 15 obstacles appear exactly once above (pointer mentions aside). Lada's 27-station map survives intact: her Sections 1–3 map to Chapters 1–2, 3–5 (partially), and 6–7; the post-talk additions extend the same arc into Chapters 8–12 rather than disturbing it. The July 2026 additions (model tiering, autonomous delivery, Learning Loop, Surface Change Attractors) slot into Chapters 5, 11, and 12.
