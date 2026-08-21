import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { PatternCategory, PatternContent, RelatedPattern } from './types'
import { getRelationshipsForBoth } from './relationships'
import { getVideoTitle } from './video-titles'

const PATTERNS_BASE_PATH = path.join(process.cwd(), '..', 'documents')

function getCategoryPath(category: PatternCategory): string {
  return path.join(PATTERNS_BASE_PATH, category)
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
  return extractEmojiFromTitle(withoutHash)
}

function readTitle(category: PatternCategory, slug: string): string {
  const fullPath = path.join(getCategoryPath(category), `${slug}.md`)

  try {
    const { content } = matter(fs.readFileSync(fullPath, 'utf-8'))
    const firstHeading = content.split('\n').find(line => line.trim().startsWith('#'))
    return firstHeading ? extractTitleAndEmoji(firstHeading).title : slugToTitleCase(slug)
  } catch {
    return slugToTitleCase(slug)
  }
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
    const relatedIn = (relatedCategory: PatternCategory): RelatedPattern[] => {
      const categoryPrefix = `${relatedCategory}/`
      const items = allRels.flatMap(r => {
        // If this pattern is the source, take the target; if target, take the source
        const isOutgoing = r.from === currentFullSlug
        const otherSlug = isOutgoing ? r.to : r.from
        if (!otherSlug.startsWith(categoryPrefix)) return []
        const relatedSlug = otherSlug.slice(categoryPrefix.length)
        return [{
          slug: relatedSlug,
          title: readTitle(relatedCategory, relatedSlug),
          type: r.type,
          direction: isOutgoing ? 'outgoing' as const : 'incoming' as const
        }]
      })

      // A bidirectional edge is stored once per direction, so keep the first entry per document
      return items.filter((item, index) =>
        items.findIndex(other => other.slug === item.slug) === index
      )
    }

    const relPatterns = relatedIn('patterns')
    const relAntiPatterns = relatedIn('anti-patterns')
    const relObstacles = relatedIn('obstacles')

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
      ...(relPatterns.length > 0 && { relatedPatterns: relPatterns }),
      ...(relAntiPatterns.length > 0 && { relatedAntiPatterns: relAntiPatterns }),
      ...(relObstacles.length > 0 && { relatedObstacles: relObstacles }),
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
