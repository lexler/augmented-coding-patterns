---
authors: [florian_wilhelm]
---

# Shared Core with Native Shells

Closely related: [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/) and [Humble Object](https://martinfowler.com/bliki/HumbleObject.html)

## Problem
Agents make it cheap to give one application several native front ends: GTK, Win32, AppKit, a browser, a terminal. The repetitive platform work that used to push you toward a single cross-platform toolkit is no longer the bottleneck.

But every shell an agent builds is another roll of the dice. Left alone, each one re-implements undo, selection, wrapping, or caret movement slightly differently. The shells drift apart, and nobody notices until a user does.

## Pattern
Put everything that must agree into one **core**. Let agents build thin **shells** around it. Keep them in line with checks, not instructions.

- **The core owns state and rules:** document, selection, undo history, modified state, commands. That includes layout that affects behavior: if wrapping decides where Down goes, the core wraps and the shell only supplies font metrics.
- **Shells translate and render.** They turn platform input into core commands and draw what the core reports, using native menus, dialogs, and key bindings. They keep no copy of application state.
- **Build a CLI over the core first.** Whatever a window can do, a script, a test, and an agent can do too. The agent verifies behavior without a GUI.
- **Make parity mechanical.** Tests fail the build when a core operation has no CLI command, or a shell lacks a shared command or key binding.
- **Look at every shell.** Parity checks catch drift, not appearance. Screenshot each shell on its real platform and review it.

Define the core boundary before building the second shell.

Skip this when a cross-platform toolkit gives an acceptable experience, or when the application is mostly presentation with little behavior to share.

## Example
My [editor template](https://github.com/fwilhe2/editor/blob/main/doc/architecture.md) has a Rust core with CLI, terminal, GTK, WebAssembly browser, Win32, and AppKit shells.

Three rules are checked by machine:

- `cli/tests/parity.rs` reads `core/src/app.rs`. Every `pub fn` in `impl App` needs a row in `doc/cli-parity.md` naming its CLI command, or a `not exposed:` reason.
- Every CLI subcommand must appear in `examples/sample.sh`, and a test runs the script.
- Every `Command` must be in every shell's menus or keys, and every `Motion` needs a key in every shell.

Each CLI call is its own process, so a session file carries the caret and undo history:

```sh
quill --session s.json type notes.txt --text 'hello world'
quill --session s.json undo notes.txt
quill --session s.json move notes.txt down --width 20
```

The checks cannot see everything. The core wraps text using font metrics each shell supplies, and the browser shell supplied wrong ones: Firefox gave it no font, so it measured at the canvas default of 10px and nothing wrapped. The jsdom smoke test passed the whole time. Only a screenshot from real Firefox showed it, which is why every shell gets looked at.

The same approach carried over to the larger [grind office suite](https://github.com/fwilhe2/grind).

Also published in [awesome-agentic-patterns](https://github.com/nibzard/awesome-agentic-patterns/blob/main/patterns/shared-core-native-shells.md).
