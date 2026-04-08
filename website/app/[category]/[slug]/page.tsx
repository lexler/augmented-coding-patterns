import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPatternBySlug, getPatternSlugs, titleToSlug } from "@/lib/markdown";
import { getCategoryConfig, isValidCategory } from "@/app/lib/category-config";
import { basePath } from "@/lib/config";
import { PatternCategory } from "@/lib/types";
import Authors from "@/app/components/Authors";
import RelatedLinks from "@/app/components/RelatedLinks";
import VideoThumbnail from "@/app/components/VideoThumbnail";
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

export default async function PatternPage({ params }: PatternPageProps) {
  const { category, slug } = await params;

  if (!isValidCategory(category)) {
    notFound();
  }

  const config = getCategoryConfig(category as PatternCategory);

  // First try to get the pattern by the given slug (might be canonical or alternative)
  let pattern = null;
  try {
    pattern = getPatternBySlug(category as PatternCategory, slug);
  } catch {
    // Slug might be an alternative title slug, not a canonical file slug
    // We'll search for it below
  }

  // If not found directly, search all patterns to find one with a matching alternative title
  let canonicalSlug = slug;
  let isAlternativeTitle = false;

  if (!pattern) {
    const allSlugs = getPatternSlugs(category as PatternCategory);
    for (const candidateSlug of allSlugs) {
      const candidatePattern = getPatternBySlug(category as PatternCategory, candidateSlug);
      if (candidatePattern?.alternativeTitles) {
        // Check if any alternative title converts to the requested slug
        for (const altTitle of candidatePattern.alternativeTitles) {
          if (titleToSlug(altTitle) === slug) {
            pattern = candidatePattern;
            canonicalSlug = candidateSlug;
            isAlternativeTitle = true;
            break;
          }
        }
        if (isAlternativeTitle) break;
      }
    }
  }

  if (!pattern) {
    notFound();
  }

  // If visiting an alternative title slug, render redirect page
  if (isAlternativeTitle) {
    const canonicalPath = `/${category}/${canonicalSlug}/`;
    const canonicalUrl = `${basePath}${canonicalPath}`;
    return (
      <html>
        <head>
          <meta httpEquiv="refresh" content={`0; url=${canonicalUrl}`} />
          <link rel="canonical" href={canonicalUrl} />
          <title>Redirecting to {pattern.title}</title>
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
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
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
