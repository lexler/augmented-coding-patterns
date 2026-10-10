import { getPatternBySlug } from '@/lib/markdown'
import { PatternCategory, PatternContent } from '@/lib/types'

export function existingPattern(category: PatternCategory, slug: string): PatternContent {
  const pattern = getPatternBySlug(category, slug)
  if (pattern === null) {
    throw new Error(`Expected ${category}/${slug} to exist`)
  }
  return pattern
}
