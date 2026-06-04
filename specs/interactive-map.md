# Interactive Map

The project includes a visual map designed for a talk presentation. It provides a guided path through a curated subset of the patterns collection.

## Talk Path

The talk has evolved across versions, shown as map tabs (see Map Feature). The breakdown below is v1 (27 items), organized into three sections:

Section 1 — Context Management: How to set up and maintain context for AI
- Foundations (cannot-learn, context-rot, context-management, knowledge-document, ground-rules, extract-knowledge)
- Focus (limited-context-window, distracted-agent, limited-focus, focused-agent, references, knowledge-composition)
- Noise (excess-verbosity, semantic-zoom, noise-cancellation)

Section 2 — Reliability: How to get consistent, correct results
- Non-Determinism (non-determinism, knowledge-checkpoint, parallel-implementations, offload-deterministic)
- Hallucinations and Complexity (hallucinations, perfect-recall-fallacy, playgrounds, unvalidated-leaps, degrades-under-complexity, chain-of-small-steps)
- Forcing Compliance (hooks, reminders)

Section 3 — Steering: How to keep AI aligned with your intent
- black-box-ai, compliance-bias, silent-misalignment, active-partner, check-alignment, context-markers, answer-injection, tell-me-a-lie, reverse-direction, text-native

The sequence is defined in `/talk_path.md`. Not all patterns in the collection are part of the talk.

## Map Feature

`/talk/` shows the talk maps as tabs. Each node's position comes from the SVG; `map-index*.json` maps a node's number to a pattern slug. Clicking an interactive node opens that pattern in a modal. A YouTube walkthrough is linked below the map.

Files live in `website/public/maps/`:
- `semantic_map.svg` + `map-index.json` — v1 (interactive)
- `semantic_map_v2.svg` + `map-index-v2.json` — v2 (interactive)
- `semantic_map_v3.svg` + `map-index-v3.json` — v3 (interactive)

## Adding a map

1. Export the diagram from Excalidraw as SVG. Keep the standard fills — the classifier reads them: obstacle `#ffc9c9`, pattern `#b2f2bb`, anti-pattern `#ffec99`, pit-stop `#a5d8ff`. Put each number inside its node; each name touching its node.
2. Generate the interactive SVG:
   `python3 tools/process_map.py <input.svg> website/public/maps/semantic_map_vN.svg`
3. Add `website/public/maps/map-index-vN.json` — `{ "<number>": { "name", "category", "slug" } }`. Each `slug` must match a `documents/<category>/<slug>.md`. Obstacles carry no number — they link by name, so the name must equal the document's title.
4. Add a tab in `app/talk/page.tsx`: `buildDataByNumber(mapIndexVN, allPatterns)` and render `<PatternMap patternDataByNumber={...} patternDataByLabel={...} mapFile="semantic_map_vN.svg" />`.

Export with the light theme so fills match the palette above (a dark-theme export uses different hex and won't classify). Matching pairs each label/number to the shape it touches (bounding-box distance), so placement is forgiving. If a node comes out mislabeled, move its label nearer its own shape and re-run step 2.
