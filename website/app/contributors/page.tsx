import Image from "next/image";
import Link from "next/link";
import { getContributorStats } from "@/lib/contributors";
import { siteConfig } from "@/config/site";
import styles from "./page.module.css";

export default function ContributorsPage() {
  const contributors = getContributorStats();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Contributors</h1>
        <p className={styles.description}>
          Thank you to all the contributors who have documented patterns, anti-patterns, and obstacles.
        </p>
        <p className={styles.description}>
          Want to contribute? Read the{" "}
          <Link
            href={`${siteConfig.links.github}/blob/main/CONTRIBUTE.md`}
            target="_blank"
            rel="noopener noreferrer"
          >
            contribution guide
          </Link>.
        </p>
      </header>

      <div className={styles.contributorGrid}>
        {contributors.map((contributor) => {
          const contributorUrl = contributor.url || `https://github.com/${contributor.github}`;
          const breakdownItems = [];

          if (contributor.patterns > 0) {
            breakdownItems.push(`${contributor.patterns} pattern${contributor.patterns !== 1 ? 's' : ''}`);
          }
          if (contributor.antiPatterns > 0) {
            breakdownItems.push(`${contributor.antiPatterns} anti-pattern${contributor.antiPatterns !== 1 ? 's' : ''}`);
          }
          if (contributor.obstacles > 0) {
            breakdownItems.push(`${contributor.obstacles} obstacle${contributor.obstacles !== 1 ? 's' : ''}`);
          }

          return (
            <article key={contributor.github} className={styles.contributorCard}>
              <div className={styles.contributorHeader}>
                <Image
                  src={contributor.avatarUrl}
                  alt={`${contributor.name}'s avatar`}
                  width={32}
                  height={32}
                  unoptimized
                  className={styles.avatar}
                />
                <Link
                  href={contributorUrl}
                  className={styles.contributorName}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contributor.name}
                </Link>
              </div>

              <div className={styles.contributorStats}>
                <Link
                  href={`/contributors/${contributor.authorId}/`}
                  className={styles.totalBadge}
                >
                  {contributor.total} contribution{contributor.total !== 1 ? 's' : ''}
                </Link>
              </div>

              {breakdownItems.length > 0 && (
                <div className={styles.breakdown}>
                  {breakdownItems.join(', ')}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
