import styles from "./page.module.css";
import { PATTERN_CATALOG_GROUPS } from "./constants";
import { getAllPatterns } from "@/lib/markdown";
import { getAuthorById } from "@/lib/authors";
import CatalogView from "./CatalogView";
import { CatalogGroupData, CatalogPreviewItem } from "./types";
import { getCategoryConfig } from "@/app/lib/category-config";

function extractSummary(markdown: string): string | undefined {
  const lines = markdown.split("\n");
  const summaryLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.length === 0) {
      if (summaryLines.length > 0) {
        break;
      }
      continue;
    }

    if (/^#{1,6}\s/.test(trimmed)) {
      continue;
    }

    if (/^[-*]\s/.test(trimmed)) {
      continue;
    }

    if (/^>/.test(trimmed)) {
      continue;
    }

    const plain = trimmed
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/_(.*?)_/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/\[(.*?)]\((.*?)\)/g, "$1");

    summaryLines.push(plain);

    if (summaryLines.join(" ").length >= 220) {
      break;
    }
  }

  const summary = summaryLines.join(" ").trim();

  if (!summary) {
    return undefined;
  }

  return summary.length > 240 ? `${summary.slice(0, 237).trimEnd()}…` : summary;
}

function resolveAuthorNames(authorIds: string[] | undefined): string[] {
  if (!authorIds || authorIds.length === 0) {
    return [];
  }

  return authorIds
    .map((authorId) => {
      const author = getAuthorById(authorId);
      return author?.name ?? null;
    })
    .filter((name): name is string => Boolean(name));
}

function resolveAuthorGithub(authorId: string): string | null {
  const author = getAuthorById(authorId);
  return author?.github ?? null;
}

function buildCatalogGroups(): CatalogGroupData[] {
  return PATTERN_CATALOG_GROUPS.map(({ category, label }) => {
    const config = getCategoryConfig(category);
    const items = getAllPatterns(category)
      .sort((a, b) => a.title.localeCompare(b.title))
      .map(
        (pattern) =>
          ({
            slug: pattern.slug,
            title: pattern.title,
            emojiIndicator: pattern.emojiIndicator,
            alternativeTitles: pattern.alternativeTitles,
            synonyms: pattern.synonyms,
            authorIds: pattern.authors ?? [],
            authorNames: resolveAuthorNames(pattern.authors),
            authorGithubs: pattern.authors?.map(resolveAuthorGithub).filter((g): g is string => g !== null) ?? [],
            summary: extractSummary(pattern.content),
            content: pattern.content,
            video: pattern.video,
            videoTitle: pattern.videoTitle,
          }) satisfies CatalogPreviewItem
      );

    return {
      category,
      label,
      icon: config.icon,
      styleClass: config.styleClass,
      items,
    } satisfies CatalogGroupData;
  });
}

export default function PatternCatalogPage() {
  const catalogGroups = buildCatalogGroups();

  return (
    <div className={styles.container}>
      <CatalogView title="Complete Catalog" groups={catalogGroups} />
    </div>
  );
}
