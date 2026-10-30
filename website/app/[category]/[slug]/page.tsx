import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPatternBySlug, getPatternSlugs, titleToSlug } from "@/lib/markdown";
import { getCategoryConfig, isValidCategory } from "@/app/lib/category-config";
import { basePath } from "@/lib/config";
import { PatternCategory, PatternContent } from "@/lib/types";
import Authors from "@/app/components/Authors";
import RelatedLinks from "@/app/components/RelatedLinks";
import VideoThumbnail from "@/app/components/VideoThumbnail";
import { markdownComponents } from "@/app/components/markdownComponents";
import styles from "../../pattern-detail.module.css";

interface PatternPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const categories: PatternCategory[] = ['patterns', 'anti-patterns', 'obstacles'];
  const params: { category: string; slug: string }[] = [];

  for (const category of categories) {
    const slugs = getPatternSlugs(category);
    for (const slug of slugs) {
      // Add canonical slug
      params.push({ category, slug });

      // Add alternative title slugs for redirect pages
      try {
        const pattern = getPatternBySlug(category, slug);
        if (pattern?.alternativeTitles) {
          for (const altTitle of pattern.alternativeTitles) {
            const altSlug = titleToSlug(altTitle);
            params.push({ category, slug: altSlug });
          }
        }
      } catch {
        // If pattern can't be read, skip alternative titles
        // This is expected and can be safely ignored
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: PatternPageProps): Promise<Metadata> {
  const { category, slug } = await params;

  if (!isValidCategory(category)) {
    return {};
  }

  const resolved = resolvePattern(category as PatternCategory, slug);
  return resolved ? { title: resolved.pattern.title } : {};
}

interface ResolvedPattern {
  pattern: PatternContent;
  canonicalSlug: string;
  isAlternativeTitle: boolean;
}

function resolvePattern(category: PatternCategory, slug: string): ResolvedPattern | null {
  const pattern = findPatternBySlug(category, slug);
  if (pattern) {
    return { pattern, canonicalSlug: slug, isAlternativeTitle: false };
  }
  return findPatternByAlternativeTitleSlug(category, slug);
}

function findPatternBySlug(category: PatternCategory, slug: string): PatternContent | null {
  try {
    return getPatternBySlug(category, slug);
  } catch {
    return null;
  }
}

function findPatternByAlternativeTitleSlug(category: PatternCategory, slug: string): ResolvedPattern | null {
  for (const candidateSlug of getPatternSlugs(category)) {
    const candidate = getPatternBySlug(category, candidateSlug);
    if (candidate?.alternativeTitles?.some((altTitle) => titleToSlug(altTitle) === slug)) {
      return { pattern: candidate, canonicalSlug: candidateSlug, isAlternativeTitle: true };
    }
  }
  return null;
}

export default async function PatternPage({ params }: PatternPageProps) {
  const { category, slug } = await params;

  if (!isValidCategory(category)) {
    notFound();
  }

  const config = getCategoryConfig(category as PatternCategory);

  const resolved = resolvePattern(category as PatternCategory, slug);

  if (!resolved) {
    notFound();
  }

  const { pattern, canonicalSlug, isAlternativeTitle } = resolved;

  if (isAlternativeTitle) {
    const canonicalPath = `/${category}/${canonicalSlug}/`;
    const canonicalUrl = `${basePath}${canonicalPath}`;
    return (
      <html>
        <head>
          <meta httpEquiv="refresh" content={`0; url=${canonicalUrl}`} />
          <link rel="canonical" href={canonicalUrl} />
        </head>
        <body>
          <div className={styles.container}>
            <p>Redirecting to <Link href={canonicalPath}>{pattern.title}</Link>...</p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <div className={styles.container}>
      <Link href={`/${category}/`} className={styles.backLink}>
        <span className={styles.backArrow}>←</span>
        Back to {config.labelPlural}
      </Link>

      <header className={styles.header}>
        <div className={styles.headerMain}>
          <div className={styles.titleWrapper}>
            {pattern.emojiIndicator && (
              <div className={styles.emoji}>{pattern.emojiIndicator}</div>
            )}
            <div>
              <h1 className={styles.title}>{pattern.title}</h1>
              {pattern.alternativeTitles && pattern.alternativeTitles.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Also known as: {pattern.alternativeTitles.join(', ')}
                </p>
              )}
              {pattern.synonyms && pattern.synonyms.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Synonyms: {pattern.synonyms.join(', ')}
                </p>
              )}
            </div>
          </div>
          <span className={`${styles.category} ${styles[config.styleClass]}`}>
            {config.label}
          </span>
        </div>
        {pattern.video && (
          <div className={styles.headerAside}>
            <VideoThumbnail
              url={pattern.video}
              title={pattern.title}
              videoTitle={pattern.videoTitle}
            />
          </div>
        )}
      </header>

      <article className={styles.content}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {pattern.content}
        </ReactMarkdown>
      </article>

      <RelatedLinks
        relatedPatterns={pattern.relatedPatterns}
        relatedAntiPatterns={pattern.relatedAntiPatterns}
        relatedObstacles={pattern.relatedObstacles}
      />

      {pattern.authors && <Authors authors={pattern.authors} />}
    </div>
  );
}
