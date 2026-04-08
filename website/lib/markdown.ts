import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { PatternCategory, PatternContent, RelationshipType } from './types'
import { getRelationshipsForBoth } from './relationships'
import { getVideoTitle } from './video-titles'

const PATTERNS_BASE_PATH = path.join(process.cwd(), '..', 'documents')

function getCategoryPath(category: PatternCategory): string {
  return path.join(PATTERNS_BASE_PATH, category)
}

function removeCategorySuffix(title: string): string {
  const categoryPattern = /\s*\((Anti-pattern|Obstacle)\)\s*$/i
  return title.replace(categoryPattern, '').trim()
}

function extractEmojiFromTitle(title: string): { title: string; emoji?: string } {
  const emojiRegex = /^(\p{Emoji_Presentation}|\p{Extended_Pictographic})\s+/u
  const match = title.match(emojiRegex)

  if (match) {
    return {
      emoji: match[1],
      title: title.substring(match[0].length).trim()
    }
  }

  return { title }
}

function extractTitleAndEmoji(firstLine: string): { title: string; emoji?: string } {
  const withoutHash = firstLine.replace(/^#\s*/, '').trim()
  const withoutCategory = removeCategorySuffix(withoutHash)
  return extractEmojiFromTitle(withoutCategory)
}

function isMarkdownFile(filename: string): boolean {
  return filename.endsWith('.md')
}

function filenameToSlug(filename: string): string {
  return filename.replace(/\.md$/, '')
}

function validateSlug(slug: string): void {
  if (slug.includes('..') || slug.includes('/') || slug.includes('\\')) {
    throw new Error('Invalid slug format: Path traversal detected')
  }

  const validSlugPattern = /^[a-zA-Z0-9_-]+$/
  if (!validSlugPattern.test(slug)) {
    throw new Error('Invalid slug format: Only alphanumeric characters, hyphens, and underscores allowed')
  }
}

export function slugToTitleCase(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function titleToSlug(title: string): string {
  return title
    .trim() // Trim first before processing
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except word chars, spaces, and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens
}

export function getPatternSlugs(category: PatternCategory): string[] {
  const categoryPath = getCategoryPath(category)

  try {
    const files = fs.readdirSync(categoryPath)
    return files
      .filter(isMarkdownFile)
      .map(filenameToSlug)
  } catch (error) {
    console.error(`Failed to read patterns directory: ${categoryPath}`, error)
    return []
  }
}

export function getPatternBySlug(
  category: PatternCategory,
  slug: string
): PatternContent | null {
  validateSlug(slug)
  const categoryPath = getCategoryPath(category)
  const fullPath = path.join(categoryPath, `${slug}.md`)

  try {
    const fileContents = fs.readFileSync(fullPath, 'utf-8')
    const { content, data } = matter(fileContents)

    const lines = content.split('\n')
    const firstLineIndex = lines.findIndex(line => line.trim().startsWith('#'))
    const firstLine = firstLineIndex >= 0 ? lines[firstLineIndex] : ''
    const { title, emoji } = extractTitleAndEmoji(firstLine)

    // Remove the first H1 from content since it's displayed in the page header
    const contentWithoutTitle = firstLineIndex >= 0
      ? [...lines.slice(0, firstLineIndex), ...lines.slice(firstLineIndex + 1)].join('\n')
      : content

    // Load relationships from centralized registry (both directions)
    const allRels = getRelationshipsForBoth(slug, category)
    const currentFullSlug = `${category}/${slug}`

    // Extract relationships and determine which end is the "other" pattern
    const relPatterns = allRels
      .map(r => {
        // If this pattern is the source, take the target; if target, take the source
        const isOutgoing = r.from === currentFullSlug
        const otherSlug = isOutgoing ? r.to : r.from
        if (!otherSlug.startsWith('patterns/')) return null
        return {
          slug: otherSlug.replace('patterns/', ''),
          type: r.type,
          direction: isOutgoing ? 'outgoing' as const : 'incoming' as const
        }
      })
      .filter((r): r is { slug: string; type: RelationshipType; direction: 'outgoing' | 'incoming' } => r !== null)

    const relAntiPatterns = allRels
      .map(r => {
        const isOutgoing = r.from === currentFullSlug
        const otherSlug = isOutgoing ? r.to : r.from
        if (!otherSlug.startsWith('anti-patterns/')) return null
        return {
          slug: otherSlug.replace('anti-patterns/', ''),
          type: r.type,
          direction: isOutgoing ? 'outgoing' as const : 'incoming' as const
        }
      })
      .filter((r): r is { slug: string; type: RelationshipType; direction: 'outgoing' | 'incoming' } => r !== null)

    const relObstacles = allRels
      .map(r => {
        const isOutgoing = r.from === currentFullSlug
        const otherSlug = isOutgoing ? r.to : r.from
        if (!otherSlug.startsWith('obstacles/')) return null
        return {
          slug: otherSlug.replace('obstacles/', ''),
          type: r.type,
          direction: isOutgoing ? 'outgoing' as const : 'incoming' as const
        }
      })
      .filter((r): r is { slug: string; type: RelationshipType; direction: 'outgoing' | 'incoming' } => r !== null)

    // Merge centralized relationships with frontmatter (remove duplicates by slug)
    // For frontmatter relationships without type info, default to 'related' and 'outgoing'
    const frontmatterPatterns = (data.related_patterns || []).map((slug: string) => ({ slug, type: 'related' as const, direction: 'outgoing' as const }))
    const frontmatterAntiPatterns = (data.related_anti_patterns || []).map((slug: string) => ({ slug, type: 'related' as const, direction: 'outgoing' as const }))
    const frontmatterObstacles = (data.related_obstacles || []).map((slug: string) => ({ slug, type: 'related' as const, direction: 'outgoing' as const }))

    // Merge and deduplicate by slug, preferring centralized type over frontmatter
    type RelatedItem = {slug: string, type: RelationshipType, direction: 'outgoing' | 'incoming'}
    const mergeRelatedPatterns = (centralized: RelatedItem[], frontmatter: RelatedItem[]) => {
      const slugMap = new Map<string, RelatedItem>()
      frontmatter.forEach(item => slugMap.set(item.slug, item))
      centralized.forEach(item => slugMap.set(item.slug, item)) // Centralized overwrites
      return Array.from(slugMap.values())
    }

    const mergedPatterns = mergeRelatedPatterns(relPatterns, frontmatterPatterns)
    const mergedAntiPatterns = mergeRelatedPatterns(relAntiPatterns, frontmatterAntiPatterns)
    const mergedObstacles = mergeRelatedPatterns(relObstacles, frontmatterObstacles)

    return {
      title,
      category,
      slug,
      ...(emoji && { emojiIndicator: emoji }),
      ...(data.authors && { authors: data.authors }),
      ...(data.alternative_titles && { alternativeTitles: data.alternative_titles }),
      ...(data.synonyms && { synonyms: data.synonyms }),
      ...(data.video && { video: data.video }),
      ...(data.video && getVideoTitle(data.video) && { videoTitle: getVideoTitle(data.video) }),
      ...(mergedPatterns.length > 0 && { relatedPatterns: mergedPatterns }),
      ...(mergedAntiPatterns.length > 0 && { relatedAntiPatterns: mergedAntiPatterns }),
      ...(mergedObstacles.length > 0 && { relatedObstacles: mergedObstacles }),
      content: contentWithoutTitle,
      rawContent: fileContents
    }
  } catch {
    // File not found - this is expected for alternative title slugs
    // The caller will handle this by searching for alternative titles
    return null
  }
}

export function getAllPatterns(category: PatternCategory): PatternContent[] {
  const slugs = getPatternSlugs(category)
  return slugs
    .map(slug => getPatternBySlug(category, slug))
    .filter((pattern): pattern is PatternContent => pattern !== null)
}
