import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";
import { getPatternSlugs, getAllPatterns } from "@/lib/markdown";
import { getGraphData } from "@/lib/graph-data";
import RelationshipGraph from "./components/RelationshipGraph";
import SearchBar from "./components/SearchBar";

const intro =
  "A collection of emerging patterns, anti-patterns and obstacles for effective AI-augmented software development. " +
  "Learn how to collaborate successfully with AI coding assistants and avoid common pitfalls.";

export const metadata: Metadata = {
  description: intro,
};

export default function Home() {
  const patternsCount = getPatternSlugs("patterns").length;
  const antiPatternsCount = getPatternSlugs("anti-patterns").length;
  const obstaclesCount = getPatternSlugs("obstacles").length;
  const graphData = getGraphData();

  const patterns = getAllPatterns("patterns");
  const antiPatterns = getAllPatterns("anti-patterns");
  const obstacles = getAllPatterns("obstacles");
  const allPatterns = [...patterns, ...antiPatterns, ...obstacles];

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>Augmented Coding Patterns</h1>
        <p>{intro}</p>
        <div className={styles.searchContainer}>
          <SearchBar patterns={allPatterns} />
        </div>
      </section>

      <div className={styles.categories}>
        <Link href="/obstacles" className={`${styles.categoryCard} ${styles.obstacles}`}>
          <div className={styles.categoryIcon}>⛰️</div>
          <h2 className={styles.categoryTitle}>Obstacles</h2>
          <p className={styles.categoryDescription}>
            Understand the inherent limitations and challenges of AI-augmented coding.
            Be aware of these obstacles to set realistic expectations.
          </p>
          <div className={styles.categoryCount}>{obstaclesCount} Obstacles</div>
        </Link>

        <Link href="/anti-patterns" className={`${styles.categoryCard} ${styles.antiPatterns}`}>
          <div className={styles.categoryIcon}>⚠️</div>
          <h2 className={styles.categoryTitle}>Anti-Patterns</h2>
          <p className={styles.categoryDescription}>
            Common mistakes and pitfalls to avoid when working with AI assistants.
            Learn from these anti-patterns to prevent costly errors.
          </p>
          <div className={styles.categoryCount}>{antiPatternsCount} Anti-Patterns</div>
        </Link>

        <Link href="/patterns" className={`${styles.categoryCard} ${styles.patterns}`}>
          <div className={styles.categoryIcon}>🧩</div>
          <h2 className={styles.categoryTitle}>Patterns</h2>
          <p className={styles.categoryDescription}>
            Proven strategies and best practices for working effectively with AI coding assistants.
            These patterns help you maximize productivity and code quality.
          </p>
          <div className={styles.categoryCount}>{patternsCount} Patterns</div>
        </Link>
      </div>

      <section className={styles.graphSection}>
        <h2 className={styles.sectionTitle}>Pattern Relationships</h2>
        <p className={styles.sectionDescription}>
          Explore how patterns, anti-patterns, and obstacles relate to each other.
          Click on any node to navigate to that pattern.
        </p>
        <RelationshipGraph graphData={graphData} />
      </section>
    </div>
  );
}
