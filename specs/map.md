# Map

Where everything lives in this repo.

```
/
├── documents/              Content source (markdown + relationships graph)
│   ├── patterns/           Pattern documents
│   ├── anti-patterns/      Anti-pattern documents
│   ├── obstacles/          Obstacle documents
│   └── relationships.mmd   Centralized relationship graph
│
├── website/                Next.js application (all dev work happens here)
│   ├── app/                Pages and components
│   ├── lib/                Content processing, relationships, authors
│   ├── config/             authors.yaml
│   ├── tests/              Jest unit + Playwright E2E tests
│   ├── public/             Static assets (maps, images)
│   └── out/                Build output (generated, not committed)
│
├── specs/                  High-level project documentation
│
├── scripts/                One-off and build scripts
│   ├── validate-relationships.js
│   ├── fix-frontmatter-newlines.js
│   ├── migrate-relationships.js
│   └── remove-frontmatter-relationships.js
│
├── tools/                  Map processing utilities
│   ├── process_map.py
│   ├── habit-hooks.sh      Code-smell sensors for website/ (config in website/.habit-hooks/)
│   └── map images
│
├── slides/                 Talk presentation materials
├── playground/             Throwaway exploratory code
│
├── CLAUDE.md               AI assistant instructions (project level)
├── CONTRIBUTE.md           How to add content
├── talk_path.md            Talk sequence definition (27 + 32 item versions)
└── README.md               Repo readme
```
