# Project

A static documentation website that presents an evolving collection of patterns, anti-patterns, and obstacles for developing software with LLMs.

Deployed at https://ai-coding-patterns.dev/ (Cloudflare Pages) and mirrored on GitHub Pages at https://lexler.github.io/augmented-coding-patterns/

## Purpose

Coding with AI is new and still evolving. We're trying to understand what we're dealing with — what works well, what doesn't, and what's inherently difficult. This project collects those learnings as a shared, growing body of knowledge.

## Three Content Categories

- Obstacles — inherent AI limitations you can't eliminate, only manage (e.g., Hallucinations, Context Rot)
- Anti-patterns — common mistakes to avoid (e.g., Silent Misalignment, Answer Injection)
- Patterns — proven strategies that help (e.g., Active Partner, Chain of Small Steps)

These three categories are the core taxonomy. Everything in the project — content, navigation, styling, relationships — is organized around them.

## Two-Layer Architecture

```
/documents/          Content layer — markdown source files
/website/            Application layer — Next.js app that renders them
```

The content layer is independent of the website. Documents are plain markdown with YAML frontmatter. The website reads them at build time and produces a static site.

This separation means content can be authored, reviewed, and versioned without touching application code.

## How They Connect

At build time, the website:
1. Reads all markdown files from `/documents/{category}/`
2. Parses frontmatter and extracts titles
3. Loads the relationship graph from `/documents/relationships.mmd`
4. Generates static HTML pages for every document, category listing, and feature page

There is no runtime server. The output is a set of static files deployed to GitHub Pages.
