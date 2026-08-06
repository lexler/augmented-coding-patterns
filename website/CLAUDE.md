# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 static site that displays documentation for augmented coding patterns, anti-patterns, and obstacles. The content is authored in markdown files stored in `../documents/` (outside the website directory) and rendered as a static documentation website deployed to GitHub Pages.

## Development Commands

```bash
# Development
npm run dev              # Start dev server on http://localhost:3000 (uses Turbopack)

# Testing
npm test                 # Run Jest unit tests (4 suites, 63 tests)
npm run test:watch       # Run Jest in watch mode
npm run test:e2e         # Run Playwright smoke tests (5 critical path tests)
npm run test:e2e:ui      # Run Playwright with UI mode

# Quality
npm run lint             # Run ESLint (must have 0 errors, 0 warnings)
npm run build            # Production build (static export to out/)
npm start                # Serve production build locally

# Running a single test file
npx jest path/to/test.test.ts
npx playwright test path/to/test.spec.ts
```

## Architecture

### Content Source and Processing

**Markdown Content Location**: `../documents/` (sibling to website directory)
- Directory structure: `../documents/{category}/{slug}.md`
- Three categories: `patterns/`, `anti-patterns/`, `obstacles/`
- Each markdown file has a frontmatter section and content

**Content Processing Pipeline**:
1. `lib/markdown.ts` reads markdown files from `../documents/`
2. Uses `gray-matter` to parse frontmatter
3. Extracts title and emoji from first H1 line in content
4. **Strips the first H1** from content (displayed separately in page header to avoid duplicate H1s)
5. Returns `PatternContent` object with metadata and processed content
6. Next.js pages render using `react-markdown` with `remark-gfm` for GitHub-flavored markdown

**Important**: The first H1 in markdown files is extracted as the page title and removed from the rendered content to maintain semantic HTML (only one H1 per page).

**Images in documents** (agent decision): document images live in `public/images/` and are referenced from markdown as `/images/{file}`. Every `ReactMarkdown` call passes `markdownComponents` from `app/components/markdownComponents.tsx`, which renders images through `next/image` with the deployment `basePath` prepended — a bare `<img>` would 404 on GitHub Pages. Add the override to any new `ReactMarkdown` call site.

### Category Configuration System

**Centralized in** `app/lib/category-config.ts`:
- `CATEGORY_CONFIGS` object defines all three categories (patterns, anti-patterns, obstacles)
- Each category has: id, label, labelPlural, icon, description, listDescription, countText, styleClass
- Use `getCategoryConfig(category)` and `isValidCategory(category)` helpers
- **Never hardcode category-specific logic** - always use the config system

### Next.js App Router Structure

```
app/
├── page.tsx                    # Home page: displays three category cards
├── [category]/
│   ├── page.tsx               # Category list: shows all patterns in a category
│   └── [slug]/
│       └── page.tsx           # Pattern detail: renders markdown content
├── lib/
│   ├── category-config.ts     # Category configuration (source of truth)
│   └── types.ts              # TypeScript type exports
└── layout.tsx                 # Root layout with header/nav/footer

lib/
├── markdown.ts                # Markdown file reading and parsing
└── types.ts                   # Shared TypeScript types
```

### Static Site Generation

**Build Configuration** (`next.config.ts`):
- Environment-aware: `output: 'export'` only in production
- `basePath: '/augmented-coding-patterns'` for GitHub Pages deployment
- `trailingSlash: true` for better GitHub Pages compatibility
- `images.unoptimized: true` required for static export

**Static Params Generation**:
- Category pages and pattern detail pages use `generateStaticParams()`
- Reads all markdown files and generates routes at build time
- Build generates ~49 static HTML pages

### Test Strategy

**Philosophy**: Fast unit tests for comprehensive coverage, minimal E2E smoke tests for critical paths.

**Unit Tests** (`tests/unit/` and `tests/integration/`):
- Component tests: Layout, pages (home, category list, pattern detail)
- Markdown processing: File reading, title extraction, emoji parsing
- Test using `@testing-library/react` and `jest-dom`
- Mocks: `react-markdown` and `remark-gfm` are mocked in `tests/setup.ts`

**E2E Tests** (`tests/e2e/smoke.spec.ts`):
- Only 5 smoke tests covering critical user journeys
- Single browser (Chromium only)
- Tests: home page load, navigation to list, navigation to detail, back button, header navigation
- Playwright configured to start dev server automatically

**Important Test Patterns**:
- Use `page.locator('nav a[href="/patterns/"]')` with trailing slashes for navigation links
- Use `.nth(1)` to skip the breadcrumb/header link when selecting pattern cards
- Pattern detail URLs have trailing slashes: `/patterns/active-partner/`

## Key Implementation Details

### Security Considerations

**Path Traversal Protection** (`lib/markdown.ts:validateSlug`):
- Validates slugs before file system access
- Rejects `..`, `/`, `\` characters
- Only allows alphanumeric, hyphens, and underscores
- Throws error for invalid slugs

### Markdown Title and Emoji Extraction

The `lib/markdown.ts` module parses the title as follows:
1. Finds first line starting with `#`
2. Extracts leading emoji using Unicode regex
3. Returns clean title and optional emoji separately

Titles carry no category suffix — the category comes from the directory and is rendered as a label.

### ESLint Configuration

**Ignore patterns** (`eslint.config.mjs`):
- `playwright-report/**` - test reports
- `test-results/**` - test artifacts
- `coverage/**` - coverage reports
- `jest.config.js` - uses require() which triggers warnings

**Must maintain**: 0 errors, 0 warnings

## GitHub Pages Deployment

See `deployment-notes.md` for full details. Key points:
- Site deploys to: `https://USERNAME.github.io/augmented-coding-patterns/`
- Build generates static files in `out/` directory
- `.nojekyll` file prevents Jekyll processing
- All internal links automatically handle basePath via Next.js Link component
- Cannot use server-side features (SSR, API routes, dynamic image optimization)

## Common Patterns

### Adding a New Pattern

1. Create markdown file in `../documents/{category}/{slug}.md`
2. Include frontmatter and first H1 with optional emoji
3. Run build to verify static generation works
4. Pattern automatically appears on category list page

### Adding a New Category

1. Update `PatternCategory` type in `lib/types.ts`
2. Add category config to `CATEGORY_CONFIGS` in `app/lib/category-config.ts`
3. Create directory in `../documents/{new-category}/`
4. Add CSS styles for category in `pattern-detail.module.css` and `category-list.module.css`
5. Update tests to include new category

### Working with Categories

Always use `getCategoryConfig(category)` instead of hardcoding strings or logic. This ensures consistency across the application and makes it easy to update category metadata globally.
