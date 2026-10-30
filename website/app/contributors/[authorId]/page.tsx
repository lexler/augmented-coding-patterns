import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getContributorDetailById, getContributorStats } from "@/lib/contributors";
import styles from "./page.module.css";

export function generateStaticParams() {
  const contributors = getContributorStats();
  return contributors.map((contributor) => ({
    authorId: contributor.authorId,
  }));
}

interface ContributorDetailPageProps {
  params: Promise<{
    authorId: string;
  }>;
}

export async function generateMetadata({ params }: ContributorDetailPageProps): Promise<Metadata> {
  const { authorId } = await params;
  const contributor = getContributorDetailById(authorId);

  return contributor
    ? {
        title: contributor.name,
        description: `Patterns, anti-patterns, and obstacles contributed by ${contributor.name}.`,
      }
    : {};
}

export default async function ContributorDetailPage({ params }: ContributorDetailPageProps) {
  const { authorId } = await params;
  const contributor = getContributorDetailById(authorId);

  if (!contributor) {
    return null;
  }

  const githubUrl = `https://github.com/${contributor.github}`;
  const hasWebsite = !!contributor.url;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.avatarWrapper}>
          <Image
            src={contributor.avatarUrl}
            alt={`${contributor.name}'s avatar`}
            width={80}
            height={80}
            unoptimized
            className={styles.avatar}
          />
        </div>
        <h1 className={styles.title}>{contributor.name}</h1>
        <div className={styles.statsRow}>
          <div className={styles.totalBadge}>
            {contributor.total} contribution{contributor.total !== 1 ? 's' : ''}
          </div>
          <div className={styles.linksWrapper}>
            <Link
              href={githubUrl}
              className={styles.githubLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              View GitHub Profile
            </Link>
            {hasWebsite && (
              <Link
                href={contributor.url!}
                className={styles.websiteLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Website
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className={styles.categoriesGrid}>
        {contributor.obstacles > 0 && (
          <section className={styles.categorySection}>
            <div className={styles.categoryHeader}>
              <h2 className={styles.categoryTitle}>Obstacles</h2>
              <span className={styles.categoryCount}>({contributor.obstacles})</span>
            </div>
            <ul className={styles.patternList}>
              {contributor.contributions.obstacles.map((pattern) => (
                <li key={pattern.slug} className={styles.patternItem}>
                  <Link
                    href={`/obstacles/${pattern.slug}/`}
                    className={styles.patternLink}
                  >
                    {pattern.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {contributor.antiPatterns > 0 && (
          <section className={styles.categorySection}>
            <div className={styles.categoryHeader}>
              <h2 className={styles.categoryTitle}>Anti-Patterns</h2>
              <span className={styles.categoryCount}>({contributor.antiPatterns})</span>
            </div>
            <ul className={styles.patternList}>
              {contributor.contributions.antiPatterns.map((pattern) => (
                <li key={pattern.slug} className={styles.patternItem}>
                  <Link
                    href={`/anti-patterns/${pattern.slug}/`}
                    className={styles.patternLink}
                  >
                    {pattern.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {contributor.patterns > 0 && (
          <section className={styles.categorySection}>
            <div className={styles.categoryHeader}>
              <h2 className={styles.categoryTitle}>Patterns</h2>
              <span className={styles.categoryCount}>({contributor.patterns})</span>
            </div>
            <ul className={styles.patternList}>
              {contributor.contributions.patterns.map((pattern) => (
                <li key={pattern.slug} className={styles.patternItem}>
                  <Link
                    href={`/patterns/${pattern.slug}/`}
                    className={styles.patternLink}
                  >
                    {pattern.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
