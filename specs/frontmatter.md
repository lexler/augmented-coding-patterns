# Frontmatter

Each document in `/documents/` has a YAML frontmatter block at the top. This is the reference for all supported fields.

## authors

```yaml
authors: [lada_kesseler, steve_kuo]
```

Required. Array of author IDs referencing entries in `website/config/authors.yaml`. Displayed on detail pages and contributor pages.

## alternative_titles

```yaml
alternative_titles: ["Show me, I will repeat-automate"]
```

Optional. Array of former or alternate full titles for the document. Used when a document is renamed — the old title's slug continues to work as a URL that redirects to the canonical page.

Frontend support: full. Parsed in `lib/markdown.ts`, generates redirect pages via `generateStaticParams`, and displays as "Also known as: ..." on the detail page.

Added by Ivett Ördög in commit `2b6d2a5`.

## synonyms

```yaml
synonyms: [Dementia]
```

Optional. Array of alternate terms or names for the concept. Unlike `alternative_titles`, these are not full titles and don't imply URL redirects — they're vocabulary aliases that help people recognize the concept under a different name.

Frontend support: display only. Parsed in `lib/markdown.ts` and displayed as "Synonyms: ..." on the detail page. No URL redirects or `generateStaticParams` changes.

Added by Steve Kuo in commit `1d6176c`, moved to frontmatter in `9029de6`.

## video

```yaml
video: https://www.youtube.com/watch?v=abc123&t=412
```

Optional. A single URL pointing to a video explaining the pattern. YouTube timestamps can be embedded directly in the URL (e.g. `&t=412` or `?t=6m52s`).

Frontend support: parsed in `lib/markdown.ts` and rendered on the detail page as a "Watch video" link that opens in a new tab.
