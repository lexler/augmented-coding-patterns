# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 static documentation website that presents an evolving collection of patterns, anti-patterns, and obstacles for developing software with LLMs. The site is deployed to https://ai-coding-patterns.dev/ (Cloudflare Pages) and mirrored on GitHub Pages at https://lexler.github.io/augmented-coding-patterns/

See `specs/project.md` for the overall architecture and `specs/map.md` for the full directory map.

All development work happens in the `/website/` directory.

## Commands

From the `/website/` directory:

```bash
# Development
npm run dev                    # Start dev server on port 3000 with Turbopack

# Testing
npm test                       # Run all Jest unit tests
npm run test:watch            # Jest in watch mode
npm run test:e2e              # Run Playwright smoke tests
npx jest path/to/test.test.ts # Run single Jest test file
npx playwright test path/to/test.spec.ts # Run single Playwright test

# Quality Checks
npm run lint                  # Must have 0 errors, 0 warnings
npm run validate              # Validate relationships graph

# Build
npm run build                 # Create static site in out/ directory
npm start                     # Serve production build locally
```

## Rules

- Never hardcode category-specific logic. Always use `getCategoryConfig(category)` and `isValidCategory(category)` from `app/lib/category-config.ts`
- Always validate slugs with `validateSlug()` before file system access
- Trailing slashes required on all URLs (GitHub Pages compatibility)
- One H1 per page — first H1 is extracted as the page title, don't duplicate it
- Always use Next.js `Link` component for internal navigation (handles basePath)
- Static export only — no server-side features, API routes, or dynamic image optimization
- All pages must use `generateStaticParams()` for static generation
- Use `.nth(1)` to skip breadcrumb links when selecting pattern cards in tests

## Documentation

- `/specs/` - High-level project specs (architecture, content system, relationships, frontmatter, interactive map, website)
- `/website/CLAUDE.md` - Detailed developer guide with implementation instructions
- `/CONTRIBUTE.md` - Contribution workflow for adding content
