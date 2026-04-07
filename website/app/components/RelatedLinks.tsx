import Link from 'next/link'
import { getCategoryConfig } from '@/app/lib/category-config'
import { PatternCategory, RelatedPattern, RelationshipType } from '@/lib/types'
import styles from './RelatedLinks.module.css'

interface RelatedLinksProps {
  relatedPatterns?: RelatedPattern[]
  relatedAntiPatterns?: RelatedPattern[]
  relatedObstacles?: RelatedPattern[]
}

function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatRelationshipType(type: RelationshipType, direction: 'outgoing' | 'incoming'): string {
  // Symmetric relationships (same label regardless of direction)
  if (type === 'similar' || type === 'alternative' || type === 'related') {
    const formatMap: Record<string, string> = {
      'related': '',
      'similar': 'Similar to',
      'alternative': 'Alternative to'
    }
    return formatMap[type] || type
  }

  // Asymmetric relationships (different labels based on direction)
  if (direction === 'outgoing') {
    const outgoingMap: Record<string, string> = {
      'solves': 'Solves',
      'enables': 'Enables',
      'uses': 'Uses',
      'causes': 'Causes',
      'extends': 'Extends'
    }
    return outgoingMap[type] || type
  } else {
    const incomingMap: Record<string, string> = {
      'solves': 'Solved by',
      'enables': 'Enabled by',
      'uses': 'Used by',
      'causes': 'Caused by',
      'extends': 'Extended by'
    }
    return incomingMap[type] || type
  }
}

interface RelationshipGroup {
  category: PatternCategory
  patterns: RelatedPattern[]
}

export default function RelatedLinks({
  relatedPatterns,
  relatedAntiPatterns,
  relatedObstacles
}: RelatedLinksProps) {
  const hasAnyRelations =
    (relatedPatterns && relatedPatterns.length > 0) ||
    (relatedAntiPatterns && relatedAntiPatterns.length > 0) ||
    (relatedObstacles && relatedObstacles.length > 0)

  if (!hasAnyRelations) {
    return null
  }

  const relationshipGroups: RelationshipGroup[] = []

  if (relatedPatterns && relatedPatterns.length > 0) {
    relationshipGroups.push({
      category: 'patterns',
      patterns: relatedPatterns
    })
  }

  if (relatedAntiPatterns && relatedAntiPatterns.length > 0) {
    relationshipGroups.push({
      category: 'anti-patterns',
      patterns: relatedAntiPatterns
    })
  }

  if (relatedObstacles && relatedObstacles.length > 0) {
    relationshipGroups.push({
      category: 'obstacles',
      patterns: relatedObstacles
    })
  }

  return (
    <aside className={styles.container}>
      <h2 className={styles.heading}>Related</h2>

      {relationshipGroups.map(({ category, patterns }) => {
        const config = getCategoryConfig(category)

        // Group patterns by relationship type (considering direction for asymmetric types)
        const patternsByType = patterns.reduce((acc, pattern) => {
          const typeLabel = formatRelationshipType(pattern.type, pattern.direction)
          if (!acc[typeLabel]) {
            acc[typeLabel] = []
          }
          acc[typeLabel].push(pattern)
          return acc
        }, {} as Record<string, RelatedPattern[]>)

        // Sort type groups: empty string (related) first, then alphabetically
        const sortedTypes = Object.keys(patternsByType).sort((a, b) => {
          if (a === '') return -1
          if (b === '') return 1
          return a.localeCompare(b)
        })

        return (
          <div key={category} className={styles.section}>
            <h3 className={`${styles.categoryHeading} ${styles[config.styleClass]}`}>
              <span className={styles.categoryIcon}>{config.icon}</span>
              {config.labelPlural}
            </h3>
            {sortedTypes.map(typeLabel => (
              <div key={typeLabel || 'related'}>
                {typeLabel && <h4 className={styles.typeHeading}>{typeLabel}</h4>}
                <ul className={styles.list}>
                  {patternsByType[typeLabel].map(pattern => (
                    <li key={pattern.slug} className={styles.listItem}>
                      <Link
                        href={`/${category}/${pattern.slug}/`}
                        className={`${styles.link} ${styles[config.styleClass]}`}
                      >
                        {slugToTitle(pattern.slug)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )
      })}
    </aside>
  )
}
