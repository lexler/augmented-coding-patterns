import * as fs from 'fs'
import * as path from 'path'
import { getPatternSlugs, getPatternBySlug, getAllPatterns, slugToTitleCase, titleToSlug } from '@/lib/markdown'
import * as relationships from '@/lib/relationships'

jest.mock('fs')
jest.mock('path')
jest.mock('@/lib/relationships')

const mockedFs = fs as jest.Mocked<typeof fs>
const mockedPath = path as jest.Mocked<typeof path>
const mockedRelationships = relationships as jest.Mocked<typeof relationships>

describe('Markdown utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Default: no centralized relationships (backward compatibility mode)
    mockedRelationships.getRelationshipsForBoth.mockReturnValue([])
  })

  describe('getPatternSlugs', () => {
    it('should return array of slugs for patterns category', () => {
      mockedPath.join.mockReturnValue('/fake/path/documents/patterns')
      mockedFs.readdirSync.mockReturnValue([
        'active-partner.md',
        'chain-of-small-steps.md',
        'check-alignment.md',
      ] as fs.Dirent[])

      const slugs = getPatternSlugs('patterns')

      expect(slugs).toEqual([
        'active-partner',
        'chain-of-small-steps',
        'check-alignment',
      ])
      expect(mockedFs.readdirSync).toHaveBeenCalledWith('/fake/path/documents/patterns')
    })

    it('should return array of slugs for anti-patterns category', () => {
      mockedPath.join.mockReturnValue('/fake/path/documents/anti-patterns')
      mockedFs.readdirSync.mockReturnValue([
        'answer-injection.md',
        'distracted-agent.md',
      ] as fs.Dirent[])

      const slugs = getPatternSlugs('anti-patterns')

      expect(slugs).toEqual([
        'answer-injection',
        'distracted-agent',
      ])
      expect(mockedFs.readdirSync).toHaveBeenCalledWith('/fake/path/documents/anti-patterns')
    })

    it('should return array of slugs for obstacles category', () => {
      mockedPath.join.mockReturnValue('/fake/path/documents/obstacles')
      mockedFs.readdirSync.mockReturnValue([
        'black-box-ai.md',
        'context-rot.md',
      ] as fs.Dirent[])

      const slugs = getPatternSlugs('obstacles')

      expect(slugs).toEqual([
        'black-box-ai',
        'context-rot',
      ])
      expect(mockedFs.readdirSync).toHaveBeenCalledWith('/fake/path/documents/obstacles')
    })

    it('should filter out non-markdown files', () => {
      mockedPath.join.mockReturnValue('/fake/path/documents/patterns')
      mockedFs.readdirSync.mockReturnValue([
        'active-partner.md',
        '.DS_Store',
        'README.txt',
        'check-alignment.md',
      ] as fs.Dirent[])

      const slugs = getPatternSlugs('patterns')

      expect(slugs).toEqual([
        'active-partner',
        'check-alignment',
      ])
    })
  })

  describe('getPatternBySlug', () => {
    it('should correctly parse a pattern with all sections', () => {
      const mockMarkdown = `# Active Partner

## Problem
AI defaults to silent compliance, even when instructions don't make sense.

## Pattern
Explicitly grant permission and encourage AI to:
- Push back on unclear instructions
- Challenge assumptions that seem wrong`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.title).toBe('Active Partner')
      expect(pattern.category).toBe('patterns')
      expect(pattern.slug).toBe('active-partner')
      expect(pattern.content).toContain('AI defaults to silent compliance')
      expect(mockedFs.readFileSync).toHaveBeenCalledWith(
        '/fake/path/documents/patterns/active-partner.md',
        'utf-8'
      )
    })

    it('should correctly parse an anti-pattern', () => {
      const mockMarkdown = `# Answer Injection (Anti-pattern)

## Problem
Putting solutions in your questions, limiting AI to your preconceived approach.`

      mockedPath.join.mockReturnValue('/fake/path/documents/anti-patterns/answer-injection.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('anti-patterns', 'answer-injection')

      expect(pattern).toBeDefined()
      expect(pattern.title).toBe('Answer Injection')
      expect(pattern.category).toBe('anti-patterns')
      expect(pattern.slug).toBe('answer-injection')
      expect(pattern.emojiIndicator).toBeUndefined()
    })

    it('should correctly parse an obstacle', () => {
      const mockMarkdown = `# Black Box AI (Obstacle)

## Description
AI reasoning is hidden. You only see inputs and outputs.`

      mockedPath.join.mockReturnValue('/fake/path/documents/obstacles/black-box-ai.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('obstacles', 'black-box-ai')

      expect(pattern).toBeDefined()
      expect(pattern.title).toBe('Black Box AI')
      expect(pattern.category).toBe('obstacles')
      expect(pattern.slug).toBe('black-box-ai')
    })

    it('should extract emoji indicator from title if present', () => {
      const mockMarkdown = `# 🎯 Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern.title).toBe('Active Partner')
      expect(pattern.emojiIndicator).toBe('🎯')
    })

    it('should extract authors from frontmatter', () => {
      const mockMarkdown = `---
authors: [lexler]
---
# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.authors).toEqual(['lexler'])
    })

    it('should extract related_patterns from frontmatter and map to relatedPatterns', () => {
      const mockMarkdown = `---
related_patterns:
  - chain-of-small-steps
  - check-alignment
---
# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.relatedPatterns).toEqual([
        { slug: 'chain-of-small-steps', type: 'related', direction: 'outgoing' },
        { slug: 'check-alignment', type: 'related', direction: 'outgoing' }
      ])
    })

    it('should extract related_anti_patterns from frontmatter and map to relatedAntiPatterns', () => {
      const mockMarkdown = `---
related_anti_patterns:
  - answer-injection
  - distracted-agent
---
# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.relatedAntiPatterns).toEqual([
        { slug: 'answer-injection', type: 'related', direction: 'outgoing' },
        { slug: 'distracted-agent', type: 'related', direction: 'outgoing' }
      ])
    })

    it('should extract related_obstacles from frontmatter and map to relatedObstacles', () => {
      const mockMarkdown = `---
related_obstacles:
  - black-box-ai
  - context-rot
---
# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.relatedObstacles).toEqual([
        { slug: 'black-box-ai', type: 'related', direction: 'outgoing' },
        { slug: 'context-rot', type: 'related', direction: 'outgoing' }
      ])
    })

    it('should work with files without frontmatter', () => {
      const mockMarkdown = `# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.title).toBe('Active Partner')
      expect(pattern.relatedPatterns).toBeUndefined()
      expect(pattern.relatedAntiPatterns).toBeUndefined()
      expect(pattern.relatedObstacles).toBeUndefined()
    })

    it('should work with files with only some relationship fields', () => {
      const mockMarkdown = `---
related_patterns:
  - chain-of-small-steps
---
# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.relatedPatterns).toEqual([{ slug: 'chain-of-small-steps', type: 'related', direction: 'outgoing' }])
      expect(pattern.relatedAntiPatterns).toBeUndefined()
      expect(pattern.relatedObstacles).toBeUndefined()
    })

    it('should handle all three relationship types together', () => {
      const mockMarkdown = `---
related_patterns:
  - chain-of-small-steps
related_anti_patterns:
  - answer-injection
related_obstacles:
  - black-box-ai
---
# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.relatedPatterns).toEqual([{ slug: 'chain-of-small-steps', type: 'related', direction: 'outgoing' }])
      expect(pattern.relatedAntiPatterns).toEqual([{ slug: 'answer-injection', type: 'related', direction: 'outgoing' }])
      expect(pattern.relatedObstacles).toEqual([{ slug: 'black-box-ai', type: 'related', direction: 'outgoing' }])
    })

    it('should handle authors combined with relationship fields', () => {
      const mockMarkdown = `---
authors: [lexler, johndoe]
related_patterns:
  - chain-of-small-steps
related_anti_patterns:
  - answer-injection
---
# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.authors).toEqual(['lexler', 'johndoe'])
      expect(pattern.relatedPatterns).toEqual([{ slug: 'chain-of-small-steps', type: 'related', direction: 'outgoing' }])
      expect(pattern.relatedAntiPatterns).toEqual([{ slug: 'answer-injection', type: 'related', direction: 'outgoing' }])
    })

    it('should extract alternative_titles from frontmatter', () => {
      const mockMarkdown = `---
alternative_titles:
  - "Show Me, I'll Repeat"
  - "Repeat After Me"
---
# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.alternativeTitles).toEqual(["Show Me, I'll Repeat", "Repeat After Me"])
    })

    it('should handle pattern without alternative_titles', () => {
      const mockMarkdown = `---
authors: [lexler]
---
# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.alternativeTitles).toBeUndefined()
    })

    it('should extract synonyms from frontmatter', () => {
      const mockMarkdown = `---
synonyms:
  - Dementia
  - Memory Loss
---
# Context Rot (Obstacle)

## Description
Context degrades as the conversation grows.`

      mockedPath.join.mockReturnValue('/fake/path/documents/obstacles/context-rot.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('obstacles', 'context-rot')

      expect(pattern).toBeDefined()
      expect(pattern.synonyms).toEqual(['Dementia', 'Memory Loss'])
    })

    it('should handle pattern without synonyms', () => {
      const mockMarkdown = `---
authors: [lexler]
---
# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.synonyms).toBeUndefined()
    })

    it('should handle synonyms with single item', () => {
      const mockMarkdown = `---
synonyms:
  - Dementia
---
# Context Rot (Obstacle)

## Description
Context degrades as the conversation grows.`

      mockedPath.join.mockReturnValue('/fake/path/documents/obstacles/context-rot.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('obstacles', 'context-rot')

      expect(pattern).toBeDefined()
      expect(pattern.synonyms).toEqual(['Dementia'])
    })

    it('should handle alternative_titles with single item', () => {
      const mockMarkdown = `---
alternative_titles:
  - "Old Name"
---
# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.alternativeTitles).toEqual(["Old Name"])
    })

    it('should extract video from frontmatter', () => {
      const mockMarkdown = `---
video: https://www.youtube.com/watch?v=abc123&t=412
---
# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.video).toBe('https://www.youtube.com/watch?v=abc123&t=412')
    })

    it('should handle pattern without video', () => {
      const mockMarkdown = `---
authors: [lexler]
---
# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.video).toBeUndefined()
    })
  })

  describe('getAllPatterns', () => {
    it('should return all patterns for a category', () => {
      mockedPath.join
        .mockReturnValueOnce('/fake/path/documents/patterns')
        .mockReturnValueOnce('/fake/path/documents/patterns/pattern-one.md')
        .mockReturnValueOnce('/fake/path/documents/patterns/pattern-two.md')

      mockedFs.readdirSync.mockReturnValue([
        'pattern-one.md',
        'pattern-two.md',
      ] as fs.Dirent[])

      mockedFs.readFileSync
        .mockReturnValueOnce('# Pattern One\n\n## Problem\nFirst problem.')
        .mockReturnValueOnce('# Pattern Two\n\n## Pattern\nSecond pattern.')

      const patterns = getAllPatterns('patterns')

      expect(patterns).toHaveLength(2)
      expect(patterns[0].slug).toBe('pattern-one')
      expect(patterns[0].title).toBe('Pattern One')
      expect(patterns[1].slug).toBe('pattern-two')
      expect(patterns[1].title).toBe('Pattern Two')
    })

    it('should handle empty directory', () => {
      mockedPath.join.mockReturnValue('/fake/path/documents/patterns')
      mockedFs.readdirSync.mockReturnValue([] as fs.Dirent[])

      const patterns = getAllPatterns('patterns')

      expect(patterns).toHaveLength(0)
    })

    it('should skip non-markdown files', () => {
      mockedPath.join
        .mockReturnValueOnce('/fake/path/documents/patterns')
        .mockReturnValueOnce('/fake/path/documents/patterns/pattern-one.md')

      mockedFs.readdirSync.mockReturnValue([
        'pattern-one.md',
        '.DS_Store',
        'README.txt',
      ] as fs.Dirent[])

      mockedFs.readFileSync.mockReturnValue('# Pattern One\n\n## Problem\nFirst problem.')

      const patterns = getAllPatterns('patterns')

      expect(patterns).toHaveLength(1)
      expect(patterns[0].slug).toBe('pattern-one')
    })
  })

  describe('Centralized Relationships Integration', () => {
    it('should merge centralized relationships with empty frontmatter', () => {
      const mockMarkdown = `# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      // Mock centralized relationships
      mockedRelationships.getRelationshipsForBoth.mockReturnValue([
        { from: 'patterns/active-partner', to: 'patterns/chain-of-small-steps', type: 'related', bidirectional: false },
        { from: 'patterns/active-partner', to: 'obstacles/black-box-ai', type: 'solves', bidirectional: false },
      ])

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.relatedPatterns).toEqual([
        { slug: 'chain-of-small-steps', type: 'related', direction: 'outgoing' }
      ])
      expect(pattern.relatedObstacles).toEqual([
        { slug: 'black-box-ai', type: 'solves', direction: 'outgoing' }
      ])
    })

    it('should merge centralized relationships with frontmatter relationships', () => {
      const mockMarkdown = `---
related_patterns:
  - show-me
---
# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      // Mock centralized relationships
      mockedRelationships.getRelationshipsForBoth.mockReturnValue([
        { from: 'patterns/active-partner', to: 'patterns/chain-of-small-steps', type: 'related', bidirectional: false },
      ])

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.relatedPatterns).toHaveLength(2)
      expect(pattern.relatedPatterns).toContainEqual({ slug: 'chain-of-small-steps', type: 'related', direction: 'outgoing' })
      expect(pattern.relatedPatterns).toContainEqual({ slug: 'show-me', type: 'related', direction: 'outgoing' })
    })

    it('should deduplicate relationships by slug, preferring centralized type', () => {
      const mockMarkdown = `---
related_patterns:
  - chain-of-small-steps
---
# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      // Mock centralized relationships with different type
      mockedRelationships.getRelationshipsForBoth.mockReturnValue([
        { from: 'patterns/active-partner', to: 'patterns/chain-of-small-steps', type: 'uses', bidirectional: false },
      ])

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.relatedPatterns).toHaveLength(1)
      expect(pattern.relatedPatterns).toEqual([
        { slug: 'chain-of-small-steps', type: 'uses', direction: 'outgoing' }
      ])
    })

    it('should preserve type information from centralized relationships', () => {
      const mockMarkdown = `# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      // Mock centralized relationships with various types
      mockedRelationships.getRelationshipsForBoth.mockReturnValue([
        { from: 'patterns/active-partner', to: 'patterns/chain-of-small-steps', type: 'uses', bidirectional: false },
        { from: 'patterns/active-partner', to: 'patterns/show-me', type: 'similar', bidirectional: false },
        { from: 'patterns/active-partner', to: 'obstacles/black-box-ai', type: 'solves', bidirectional: false },
      ])

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.relatedPatterns).toEqual([
        { slug: 'chain-of-small-steps', type: 'uses', direction: 'outgoing' },
        { slug: 'show-me', type: 'similar', direction: 'outgoing' }
      ])
      expect(pattern.relatedObstacles).toEqual([
        { slug: 'black-box-ai', type: 'solves', direction: 'outgoing' }
      ])
    })

    it('should correctly categorize relationships by target category', () => {
      const mockMarkdown = `# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      // Mock relationships to all three categories
      mockedRelationships.getRelationshipsForBoth.mockReturnValue([
        { from: 'patterns/active-partner', to: 'patterns/chain-of-small-steps', type: 'related', bidirectional: false },
        { from: 'patterns/active-partner', to: 'anti-patterns/answer-injection', type: 'alternative', bidirectional: false },
        { from: 'patterns/active-partner', to: 'obstacles/black-box-ai', type: 'solves', bidirectional: false },
      ])

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.relatedPatterns).toHaveLength(1)
      expect(pattern.relatedPatterns![0]).toMatchObject({ slug: 'chain-of-small-steps', type: 'related', direction: 'outgoing' })
      expect(pattern.relatedAntiPatterns).toHaveLength(1)
      expect(pattern.relatedAntiPatterns![0]).toMatchObject({ slug: 'answer-injection', type: 'alternative', direction: 'outgoing' })
      expect(pattern.relatedObstacles).toHaveLength(1)
      expect(pattern.relatedObstacles![0]).toMatchObject({ slug: 'black-box-ai', type: 'solves', direction: 'outgoing' })
    })

    it('should handle centralized relationships when no frontmatter exists', () => {
      const mockMarkdown = `# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      // Mock centralized relationships
      mockedRelationships.getRelationshipsForBoth.mockReturnValue([
        { from: 'patterns/active-partner', to: 'patterns/chain-of-small-steps', type: 'related', bidirectional: false },
      ])

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.relatedPatterns).toEqual([{ slug: 'chain-of-small-steps', type: 'related', direction: 'outgoing' }])
      expect(pattern.relatedAntiPatterns).toBeUndefined()
      expect(pattern.relatedObstacles).toBeUndefined()
    })

    it('should handle frontmatter relationships when no centralized relationships exist', () => {
      const mockMarkdown = `---
related_patterns:
  - chain-of-small-steps
related_anti_patterns:
  - answer-injection
---
# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      // No centralized relationships
      mockedRelationships.getRelationshipsForBoth.mockReturnValue([])

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.relatedPatterns).toEqual([{ slug: 'chain-of-small-steps', type: 'related', direction: 'outgoing' }])
      expect(pattern.relatedAntiPatterns).toEqual([{ slug: 'answer-injection', type: 'related', direction: 'outgoing' }])
    })

    it('should handle complex merging scenario with multiple duplicates', () => {
      const mockMarkdown = `---
related_patterns:
  - chain-of-small-steps
  - show-me
  - check-alignment
---
# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      // Centralized has some duplicates with different types and some unique
      mockedRelationships.getRelationshipsForBoth.mockReturnValue([
        { from: 'patterns/active-partner', to: 'patterns/chain-of-small-steps', type: 'uses', bidirectional: false },
        { from: 'patterns/active-partner', to: 'patterns/show-me', type: 'similar', bidirectional: false },
        { from: 'patterns/active-partner', to: 'patterns/happy-to-delete', type: 'related', bidirectional: false },
      ])

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()
      expect(pattern.relatedPatterns).toHaveLength(4)

      // Centralized types should override frontmatter
      expect(pattern.relatedPatterns).toContainEqual({ slug: 'chain-of-small-steps', type: 'uses', direction: 'outgoing' })
      expect(pattern.relatedPatterns).toContainEqual({ slug: 'show-me', type: 'similar', direction: 'outgoing' })

      // Frontmatter-only should keep default 'related' type
      expect(pattern.relatedPatterns).toContainEqual({ slug: 'check-alignment', type: 'related', direction: 'outgoing' })

      // Centralized-only should be included
      expect(pattern.relatedPatterns).toContainEqual({ slug: 'happy-to-delete', type: 'related', direction: 'outgoing' })
    })

    it('should strip category prefix from centralized relationship slugs', () => {
      const mockMarkdown = `# Active Partner

## Problem
AI defaults to silent compliance.`

      mockedPath.join.mockReturnValue('/fake/path/documents/patterns/active-partner.md')
      mockedFs.readFileSync.mockReturnValue(mockMarkdown)

      // Mock centralized relationships with full slugs including category
      mockedRelationships.getRelationshipsForBoth.mockReturnValue([
        { from: 'patterns/active-partner', to: 'patterns/chain-of-small-steps', type: 'related', bidirectional: false },
        { from: 'patterns/active-partner', to: 'anti-patterns/answer-injection', type: 'alternative', bidirectional: false },
        { from: 'patterns/active-partner', to: 'obstacles/black-box-ai', type: 'solves', bidirectional: false },
      ])

      const pattern = getPatternBySlug('patterns', 'active-partner')

      expect(pattern).toBeDefined()

      // Slugs should not include category prefix
      expect(pattern.relatedPatterns![0].slug).toBe('chain-of-small-steps')
      expect(pattern.relatedAntiPatterns![0].slug).toBe('answer-injection')
      expect(pattern.relatedObstacles![0].slug).toBe('black-box-ai')

      // Should not contain the slash
      expect(pattern.relatedPatterns![0].slug).not.toContain('/')
      expect(pattern.relatedAntiPatterns![0].slug).not.toContain('/')
      expect(pattern.relatedObstacles![0].slug).not.toContain('/')
    })
  })

  describe('slugToTitleCase', () => {
    it('should convert slug to title case', () => {
      expect(slugToTitleCase('show-me-i-will-repeat')).toBe('Show Me I Will Repeat')
    })

    it('should handle single word slug', () => {
      expect(slugToTitleCase('pattern')).toBe('Pattern')
    })

    it('should handle slug with two words', () => {
      expect(slugToTitleCase('active-partner')).toBe('Active Partner')
    })

    it('should handle slug with multiple hyphens', () => {
      expect(slugToTitleCase('chain-of-small-steps')).toBe('Chain Of Small Steps')
    })

    it('should handle empty string', () => {
      expect(slugToTitleCase('')).toBe('')
    })

    it('should handle slug with underscores (edge case)', () => {
      expect(slugToTitleCase('some_name')).toBe('Some_name')
    })

    it('should preserve capitalization of subsequent letters in word', () => {
      expect(slugToTitleCase('api-integration')).toBe('Api Integration')
    })
  })

  describe('titleToSlug', () => {
    it('should convert title to slug', () => {
      expect(titleToSlug("Show Me, I'll Repeat")).toBe('show-me-ill-repeat')
    })

    it('should handle title with forward slash', () => {
      expect(titleToSlug("Show Me, I'll Repeat/Automate")).toBe('show-me-ill-repeatautomate')
    })

    it('should handle title with multiple spaces', () => {
      expect(titleToSlug("Active  Partner")).toBe('active-partner')
    })

    it('should handle title with special characters', () => {
      expect(titleToSlug("What's Your Plan?")).toBe('whats-your-plan')
    })

    it('should handle title with punctuation', () => {
      expect(titleToSlug("Step 1: Begin, Step 2: Continue")).toBe('step-1-begin-step-2-continue')
    })

    it('should handle single word title', () => {
      expect(titleToSlug("Pattern")).toBe('pattern')
    })

    it('should handle empty string', () => {
      expect(titleToSlug('')).toBe('')
    })

    it('should handle title with trailing/leading spaces', () => {
      expect(titleToSlug('  Active Partner  ')).toBe('active-partner')
    })

    it('should collapse multiple hyphens', () => {
      expect(titleToSlug('Show---Me')).toBe('show-me')
    })

    it('should remove parentheses and brackets', () => {
      expect(titleToSlug('Pattern (Anti-pattern)')).toBe('pattern-anti-pattern')
    })
  })
})
