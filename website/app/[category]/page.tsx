import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPatterns } from "@/lib/markdown";
import { getCategoryConfig, isValidCategory } from "@/app/lib/category-config";
import { PatternCategory } from "@/lib/types";
import CompactAuthors from "@/app/components/CompactAuthors";
import styles from "../pattern-list.module.css";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { category: 'patterns' },
    { category: 'anti-patterns' },
    { category: 'obstacles' }
  ];
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;

  if (!isValidCategory(category)) {
    return {};
  }

  const config = getCategoryConfig(category as PatternCategory);
  return { title: config.labelPlural, description: config.listDescription };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  if (!isValidCategory(category)) {
    notFound();
  }

  const config = getCategoryConfig(category as PatternCategory);
  const patterns = getAllPatterns(category as PatternCategory);

  return (
    <div className={`${styles.container} ${styles[config.styleClass]}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.icon}>{config.icon}</span>
          {config.labelPlural}
        </h1>
        <p className={styles.description}>
          {config.listDescription}
        </p>
        <p className={styles.count}>{config.countText(patterns.length)}</p>
      </header>

      <div className={styles.patternList}>
        {patterns.map((pattern) => (
          <Link
            key={pattern.slug}
            href={`/${category}/${pattern.slug}`}
            className={styles.patternCard}
          >
            {pattern.emojiIndicator && (
              <div className={styles.patternEmoji}>{pattern.emojiIndicator}</div>
            )}
            <div className={styles.patternContent}>
              <h2 className={styles.patternTitle}>{pattern.title}</h2>
            </div>
            {pattern.authors && pattern.authors.length > 0 && (
              <div className={styles.patternAuthors}>
                <CompactAuthors authors={pattern.authors} />
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
