import fs from 'fs'
import path from 'path'
import {
  Relationship,
  RelationshipGraph,
  RelationshipType,
  PatternCategory,
} from './types'

let cachedGraph: RelationshipGraph | null = null

function readRelationshipsFile(): string {
  const relationshipsPath = path.join(
    process.cwd(),
    '..',
    'documents',
    'relationships.mmd'
  )
  return fs.readFileSync(relationshipsPath, 'utf8')
}

function parseRelationshipType(typeString: string): RelationshipType {
  const validTypes: RelationshipType[] = [
    'related',
    'solves',
    'similar',
    'enables',
    'uses',
    'causes',
    'alternative',
    'extends',
  ]

  if (validTypes.includes(typeString as RelationshipType)) {
    return typeString as RelationshipType
  }

  throw new Error(
    `Invalid relationship type: "${typeString}". Valid types are: ${validTypes.join(', ')}`
  )
}

function parseRelationships(content: string): Relationship[] {
  const relationships: Relationship[] = []

  const lines = content.split('\n')

  // Regex patterns for unidirectional and bidirectional edges
  const unidirectionalPattern = /^\s*([a-zA-Z0-9/_-]+)\s+-->\s*\|([^|]+)\|\s*([a-zA-Z0-9/_-]+)\s*$/
  const bidirectionalPattern = /^\s*([a-zA-Z0-9/_-]+)\s+<-->\s*\|([^|]+)\|\s*([a-zA-Z0-9/_-]+)\s*$/

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Skip empty lines
    if (line === '') {
      continue
    }

    // Skip comments (lines starting with %%)
    if (line.startsWith('%%')) {
      continue
    }

    // Skip the graph declaration line
    if (line.startsWith('graph ')) {
      continue
    }

    // Try bidirectional pattern first
    const bidirectionalMatch = line.match(bidirectionalPattern)
    if (bidirectionalMatch) {
      const [, from, typeStr, to] = bidirectionalMatch
      const type = parseRelationshipType(typeStr.trim())

      // Create two relationships for bidirectional
      relationships.push({
        from: from.trim(),
        to: to.trim(),
        type,
        bidirectional: true,
      })
      relationships.push({
        from: to.trim(),
        to: from.trim(),
        type,
        bidirectional: true,
      })
      continue
    }

    // Try unidirectional pattern
    const unidirectionalMatch = line.match(unidirectionalPattern)
    if (unidirectionalMatch) {
      const [, from, typeStr, to] = unidirectionalMatch
      const type = parseRelationshipType(typeStr.trim())

      relationships.push({
        from: from.trim(),
        to: to.trim(),
        type,
        bidirectional: false,
      })
      continue
    }

    // If we reach here, the line didn't match any expected pattern
    throw new Error(
      `Malformed relationship line at line ${i + 1}: "${line}". Expected format: "A -->|type| B" or "A <-->|type| B"`
    )
  }

  return relationships
}

function buildRelationshipGraph(): RelationshipGraph {
  if (cachedGraph) {
    return cachedGraph
  }

  const content = readRelationshipsFile()
  const relationships = parseRelationships(content)

  cachedGraph = { relationships }
  return cachedGraph
}

function buildFullSlug(slug: string, category: PatternCategory): string {
  return `${category}/${slug}`
}

export function getAllRelationships(): RelationshipGraph {
  return buildRelationshipGraph()
}

export function getRelationshipsFor(
  slug: string,
  category: PatternCategory
): Relationship[] {
  const graph = buildRelationshipGraph()
  const fullSlug = buildFullSlug(slug, category)

  return graph.relationships.filter((rel) => rel.from === fullSlug)
}

export function getRelationshipsForBoth(
  slug: string,
  category: PatternCategory
): Relationship[] {
  const graph = buildRelationshipGraph()
  const fullSlug = buildFullSlug(slug, category)

  // Get relationships where this pattern is either the source OR the target
  return graph.relationships.filter(
    (rel) => rel.from === fullSlug || rel.to === fullSlug
  )
}

export function getRelatedPatterns(
  slug: string,
  category: PatternCategory
): string[] {
  const relationships = getRelationshipsFor(slug, category)
  return relationships.map((rel) => rel.to)
}

export function validateRelationships(
  validSlugs: Set<string>
): { valid: boolean; errors: string[] } {
  const graph = buildRelationshipGraph()
  const errors: string[] = []

  for (const rel of graph.relationships) {
    if (!validSlugs.has(rel.from)) {
      errors.push(`Invalid source slug: "${rel.from}"`)
    }
    if (!validSlugs.has(rel.to)) {
      errors.push(`Invalid target slug: "${rel.to}"`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Clears the cached relationship graph. Used for testing.
 */
export function clearRelationshipCache(): void {
  cachedGraph = null
}
