---
authors: [ivett_ordog]
---

# Approved Logs

## Problem
Bridging the gap between observing a bug and documenting it in a test. Reproducing production bugs in test environments is difficult, and writing tests from scratch during debugging is slow. With AI coding, explaining bugs can be harder than showing evidence - logs remove ambiguity between mental models.

This is a special case of the Constrained Tests pattern.

## Pattern
Turn production logs into regression tests immediately.

When a bug appears:
1. Grab the relevant structured log section from production/staging/development
2. Fix the incorrect log lines to show expected behavior
3. Save as a test file (`.log`, `.md`, or domain-appropriate extension)
4. The first log line specifies the entry point invocation and parameters
5. Test runner parses first line, executes code, captures logs, compares against entire file

Requires structured logging throughout the system. If not present, start adding it as bugs surface.

Minimize entry points - use separate test directories per entry point or design logs to make copy boundaries obvious.

Unlike Approved Scenarios (optimized for validation ease), Approved Logs optimize for bug reproduction speed. They may feel cryptic without system familiarity but turn bug evidence into tests instantly.

## Example

**Typical: Structured JSON logs**

File: `payment-tests/discount-calculation-bug.log`
```
{"event":"payment_processing", "user":"premium_member", "amount":1250}
{"event":"discount_calculated", "discount_percent":20, "amount":250}
{"event":"payment_completed", "final_amount":1000}
```

Test runner:
1. Parses first line, extracts `payment_processing` event
2. Calls payment entry point with `{"user":"premium_member", "amount":1250}`
3. Captures all emitted logs
4. Compares captured logs against entire file (including first line)

Production bug: discount wasn't applied. Copy logs, fix `discount_calculated` and `final_amount` lines to show correct values, save as test. Bug is now documented.

**Atypical: Mixed structured and visual logs**

File: `hexogram-tests/clue-calculation.md`
```
=== HIDDEN SOLUTION ===
   ○ ○ ○ ●
  ○ ○ ● ● ●
 ○ ○ ● ● ○ ○
● ● ● ○ ● ○ ○
 ● ● ○ ● ○ ○
  ○ ○ ○ ○ ○
   ○ ○ ● ○

=== PLAYER STATE ===
   × ○ ○ ○
  × ○ ○ ○ ●
 × ○ ○ ○ × ○
● ● ● × ○ ○ ×
 ○ ○ ○ ● ○ ×
  × × × × ×
   ○ ○ ○ ×

=== DEBUG INFO ===
Hovered Cell: {q: 0, r: 0}
Directions:
  E_W: *3* 1
  NW_SE: 1 *1*
  NE_SW: 3
=== DEBUG INFO ===
Hovered Cell: {q: 1, r: 0}
Directions:
  E_W: *3* 1
  NW_SE: 3
  NE_SW: *1* 2
```

Custom parser:
1. Parses `HIDDEN SOLUTION` and `PLAYER STATE` as input (hex grids)
2. Each `DEBUG INFO` section validates hover calculations for specific cells
3. Visual format beats arrays of 0s and 1s for comprehension

Bespoke parsers for non-structured logs can enhance readability when domain-specific representations (ASCII grids, trees, graphs) make context obvious.
