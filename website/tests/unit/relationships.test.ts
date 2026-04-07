import config from '@/config/relationship-types.json'
import { RelationshipType } from '@/lib/types'

// Must be before any imports that use these modules
jest.mock('fs')
jest.mock('path')

describe('Relationship Parser', () => {
  let relationships: typeof import('@/lib/relationships')
  let mockedFs: jest.Mocked<typeof import('fs')>
  let mockedPath: jest.Mocked<typeof import('path')>

  beforeEach(async () => {
    jest.clearAllMocks()

    // Import mocked modules
    mockedFs = (await import('fs')) as jest.Mocked<typeof import('fs')>
    mockedPath = (await import('path')) as jest.Mocked<typeof import('path')>

    // Set up default mocks
    mockedPath.join = jest.fn().mockReturnValue('/fake/path/relationships.mmd')

    // Import relationships module
    relationships = await import('@/lib/relationships')

    // Clear the cache using the testing function
    relationships.clearRelationshipCache()
  })

  describe('parseRelationships - Basic Functionality', () => {
    it('should parse unidirectional relationship', () => {
      const content = `graph TD
patterns/active-partner -->|solves| obstacles/black-box-ai`

      mockedFs.readFileSync.mockReturnValue(content)

      const result = relationships.getRelationshipsFor('active-partner', 'patterns')

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        from: 'patterns/active-partner',
        to: 'obstacles/black-box-ai',
        type: 'solves',
        bidirectional: false,
      })
    })

    it('should parse bidirectional relationship', () => {
      const content = `graph TD
patterns/active-partner <-->|related| patterns/chain-of-small-steps`

      mockedFs.readFileSync.mockReturnValue(content)

      const result = relationships.getRelationshipsFor('active-partner', 'patterns')

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        from: 'patterns/active-partner',
        to: 'patterns/chain-of-small-steps',
        type: 'related',
        bidirectional: true,
      })
    })

    it('should create reverse relationship for bidirectional edges', () => {
      const content = `graph TD
patterns/active-partner <-->|related| patterns/chain-of-small-steps`

      mockedFs.readFileSync.mockReturnValue(content)

      const resultForActivePartner = relationships.getRelationshipsFor('active-partner', 'patterns')
      const resultForChain = relationships.getRelationshipsFor('chain-of-small-steps', 'patterns')

      expect(resultForActivePartner).toHaveLength(1)
      expect(resultForActivePartner[0].to).toBe('patterns/chain-of-small-steps')

      expect(resultForChain).toHaveLength(1)
      expect(resultForChain[0].to).toBe('patterns/active-partner')
    })
  })

  describe('parseRelationships - Multiple Relationships', () => {
    it('should parse multiple relationships', () => {
      const content = `graph TD
patterns/active-partner -->|solves| obstacles/black-box-ai
patterns/active-partner -->|related| patterns/chain-of-small-steps
patterns/chain-of-small-steps -->|uses| patterns/show-me`

      mockedFs.readFileSync.mockReturnValue(content)

      const result = relationships.getRelationshipsFor('active-partner', 'patterns')

      expect(result).toHaveLength(2)
      expect(result[0].to).toBe('obstacles/black-box-ai')
      expect(result[1].to).toBe('patterns/chain-of-small-steps')
    })

    it('should handle mix of unidirectional and bidirectional relationships', () => {
      const content = `graph TD
patterns/active-partner -->|solves| obstacles/black-box-ai
patterns/active-partner <-->|related| patterns/chain-of-small-steps`

      mockedFs.readFileSync.mockReturnValue(content)

      const result = relationships.getRelationshipsFor('active-partner', 'patterns')

      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({ bidirectional: false, type: 'solves' })
      expect(result[1]).toMatchObject({ bidirectional: true, type: 'related' })
    })
  })

  describe('parseRelationships - Comments and Empty Lines', () => {
    it('should skip empty lines', () => {
      const content = `graph TD

patterns/active-partner -->|solves| obstacles/black-box-ai

patterns/chain-of-small-steps -->|uses| patterns/show-me`

      mockedFs.readFileSync.mockReturnValue(content)

      const allRels = relationships.getAllRelationships()
      expect(allRels.relationships).toHaveLength(2)
    })

    it('should skip comment lines starting with %%', () => {
      const content = `graph TD
%% This is a comment
patterns/active-partner -->|solves| obstacles/black-box-ai
%% Another comment
patterns/chain-of-small-steps -->|uses| patterns/show-me`

      mockedFs.readFileSync.mockReturnValue(content)

      const allRels = relationships.getAllRelationships()
      expect(allRels.relationships).toHaveLength(2)
    })

    it('should skip graph declaration line', () => {
      const content = `graph TD
patterns/active-partner -->|solves| obstacles/black-box-ai`

      mockedFs.readFileSync.mockReturnValue(content)

      const allRels = relationships.getAllRelationships()
      expect(allRels.relationships).toHaveLength(1)
    })

    it('should handle file with only comments and empty lines', () => {
      const content = `graph TD
%% Comment 1

%% Comment 2`

      mockedFs.readFileSync.mockReturnValue(content)

      const allRels = relationships.getAllRelationships()
      expect(allRels.relationships).toHaveLength(0)
    })
  })

  describe('parseRelationships - Relationship Types', () => {
    const validTypes = config.validTypes as readonly RelationshipType[]

    validTypes.forEach(type => {
      it(`should parse ${type} relationship type`, () => {
        const content = `graph TD
patterns/active-partner -->|${type}| patterns/chain-of-small-steps`

        mockedFs.readFileSync.mockReturnValue(content)

        const result = relationships.getRelationshipsFor('active-partner', 'patterns')

        expect(result).toHaveLength(1)
        expect(result[0].type).toBe(type)
      })
    })

    it('should throw error for invalid relationship type', () => {
      const content = `graph TD
patterns/active-partner -->|invalid-type| patterns/chain-of-small-steps`

      mockedFs.readFileSync.mockReturnValue(content)

      expect(() => {
        relationships.getAllRelationships()
      }).toThrow(/Invalid relationship type/)
    })
  })

  describe('parseRelationships - Error Handling', () => {
    it('should throw error for malformed unidirectional syntax', () => {
      const content = `graph TD
patterns/active-partner -> |solves| obstacles/black-box-ai`

      mockedFs.readFileSync.mockReturnValue(content)

      expect(() => {
        relationships.getAllRelationships()
      }).toThrow(/Malformed relationship line/)
    })

    it('should throw error for malformed bidirectional syntax', () => {
      const content = `graph TD
patterns/active-partner <-> |related| patterns/chain-of-small-steps`

      mockedFs.readFileSync.mockReturnValue(content)

      expect(() => {
        relationships.getAllRelationships()
      }).toThrow(/Malformed relationship line/)
    })

    it('should throw error for line without arrow', () => {
      const content = `graph TD
patterns/active-partner patterns/chain-of-small-steps`

      mockedFs.readFileSync.mockReturnValue(content)

      expect(() => {
        relationships.getAllRelationships()
      }).toThrow(/Malformed relationship line/)
    })

    it('should throw error for line without type label', () => {
      const content = `graph TD
patterns/active-partner --> patterns/chain-of-small-steps`

      mockedFs.readFileSync.mockReturnValue(content)

      expect(() => {
        relationships.getAllRelationships()
      }).toThrow(/Malformed relationship line/)
    })
  })

  describe('parseRelationships - Whitespace Handling', () => {
    it('should handle leading whitespace', () => {
      const content = `graph TD
    patterns/active-partner -->|solves| obstacles/black-box-ai`

      mockedFs.readFileSync.mockReturnValue(content)

      const result = relationships.getRelationshipsFor('active-partner', 'patterns')

      expect(result).toHaveLength(1)
      expect(result[0].from).toBe('patterns/active-partner')
    })

    it('should handle trailing whitespace', () => {
      const content = `graph TD
patterns/active-partner -->|solves| obstacles/black-box-ai    `

      mockedFs.readFileSync.mockReturnValue(content)

      const result = relationships.getRelationshipsFor('active-partner', 'patterns')

      expect(result).toHaveLength(1)
      expect(result[0].to).toBe('obstacles/black-box-ai')
    })

    it('should handle whitespace in type label', () => {
      const content = `graph TD
patterns/active-partner -->| solves | obstacles/black-box-ai`

      mockedFs.readFileSync.mockReturnValue(content)

      const result = relationships.getRelationshipsFor('active-partner', 'patterns')

      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('solves')
    })
  })

  describe('getRelationshipsFor', () => {
    it('should return relationships for specific slug', () => {
      const content = `graph TD
patterns/active-partner -->|solves| obstacles/black-box-ai
patterns/chain-of-small-steps -->|uses| patterns/show-me`

      mockedFs.readFileSync.mockReturnValue(content)

      const result = relationships.getRelationshipsFor('active-partner', 'patterns')

      expect(result).toHaveLength(1)
      expect(result[0].from).toBe('patterns/active-partner')
    })

    it('should return empty array for slug with no relationships', () => {
      const content = `graph TD
patterns/active-partner -->|solves| obstacles/black-box-ai`

      mockedFs.readFileSync.mockReturnValue(content)

      const result = relationships.getRelationshipsFor('nonexistent', 'patterns')

      expect(result).toHaveLength(0)
    })

    it('should build full slug correctly with category', () => {
      const content = `graph TD
patterns/active-partner -->|solves| obstacles/black-box-ai
anti-patterns/answer-injection -->|causes| obstacles/confusion`

      mockedFs.readFileSync.mockReturnValue(content)

      const patternResult = relationships.getRelationshipsFor('active-partner', 'patterns')
      const antiPatternResult = relationships.getRelationshipsFor('answer-injection', 'anti-patterns')

      expect(patternResult).toHaveLength(1)
      expect(antiPatternResult).toHaveLength(1)
    })
  })

  describe('getRelationshipsForBoth', () => {
    it('should return relationships where pattern is the source', () => {
      const content = `graph TD
patterns/active-partner -->|solves| obstacles/black-box-ai
patterns/chain-of-small-steps -->|uses| patterns/show-me`

      mockedFs.readFileSync.mockReturnValue(content)

      const result = relationships.getRelationshipsForBoth('active-partner', 'patterns')

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        from: 'patterns/active-partner',
        to: 'obstacles/black-box-ai',
        type: 'solves',
        bidirectional: false,
      })
    })

    it('should return relationships where pattern is the target', () => {
      const content = `graph TD
patterns/active-partner -->|uses| patterns/chain-of-small-steps
patterns/show-me -->|related| patterns/active-partner`

      mockedFs.readFileSync.mockReturnValue(content)

      const result = relationships.getRelationshipsForBoth('active-partner', 'patterns')

      expect(result).toHaveLength(2)
      expect(result[0].from).toBe('patterns/active-partner')
      expect(result[1].to).toBe('patterns/active-partner')
    })

    it('should return both when pattern appears in multiple relationships', () => {
      const content = `graph TD
patterns/active-partner -->|solves| obstacles/black-box-ai
patterns/chain-of-small-steps -->|uses| patterns/active-partner
patterns/active-partner -->|related| patterns/show-me`

      mockedFs.readFileSync.mockReturnValue(content)

      const result = relationships.getRelationshipsForBoth('active-partner', 'patterns')

      expect(result).toHaveLength(3)
      // Two where active-partner is source
      expect(result.filter(r => r.from === 'patterns/active-partner')).toHaveLength(2)
      // One where active-partner is target
      expect(result.filter(r => r.to === 'patterns/active-partner')).toHaveLength(1)
    })

    it('should handle bidirectional relationships correctly', () => {
      const content = `graph TD
patterns/active-partner <-->|related| patterns/chain-of-small-steps`

      mockedFs.readFileSync.mockReturnValue(content)

      const result = relationships.getRelationshipsForBoth('active-partner', 'patterns')

      // Bidirectional relationships create two entries (one in each direction)
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        from: 'patterns/active-partner',
        to: 'patterns/chain-of-small-steps',
        type: 'related',
        bidirectional: true,
      })
      expect(result[1]).toEqual({
        from: 'patterns/chain-of-small-steps',
        to: 'patterns/active-partner',
        type: 'related',
        bidirectional: true,
      })
    })

    it('should return empty array for pattern with no relationships', () => {
      const content = `graph TD
patterns/chain-of-small-steps -->|uses| patterns/show-me`

      mockedFs.readFileSync.mockReturnValue(content)

      const result = relationships.getRelationshipsForBoth('active-partner', 'patterns')

      expect(result).toHaveLength(0)
    })

    it('should build full slug correctly with category', () => {
      const content = `graph TD
patterns/active-partner -->|solves| obstacles/black-box-ai
obstacles/context-rot -->|causes| patterns/active-partner`

      mockedFs.readFileSync.mockReturnValue(content)

      const result = relationships.getRelationshipsForBoth('active-partner', 'patterns')

      expect(result).toHaveLength(2)
      expect(result[0].from).toBe('patterns/active-partner')
      expect(result[1].to).toBe('patterns/active-partner')
    })
  })

  describe('getAllRelationships', () => {
    it('should return all relationships in the graph', () => {
      const content = `graph TD
patterns/active-partner -->|solves| obstacles/black-box-ai
patterns/chain-of-small-steps -->|uses| patterns/show-me
anti-patterns/answer-injection -->|causes| obstacles/confusion`

      mockedFs.readFileSync.mockReturnValue(content)

      const result = relationships.getAllRelationships()

      expect(result.relationships).toHaveLength(3)
    })

    it('should cache the relationship graph', () => {
      const content = `graph TD
patterns/active-partner -->|solves| obstacles/black-box-ai`

      mockedFs.readFileSync.mockReturnValue(content)

      // First call
      relationships.getAllRelationships()
      // Second call
      relationships.getAllRelationships()

      // File should only be read once due to caching
      expect(mockedFs.readFileSync).toHaveBeenCalledTimes(1)
    })
  })

  describe('validateRelationships', () => {
    it('should return valid for all valid slugs', () => {
      const content = `graph TD
patterns/active-partner -->|solves| obstacles/black-box-ai
patterns/chain-of-small-steps -->|uses| patterns/show-me`

      mockedFs.readFileSync.mockReturnValue(content)

      const validSlugs = new Set([
        'patterns/active-partner',
        'patterns/chain-of-small-steps',
        'patterns/show-me',
        'obstacles/black-box-ai',
      ])

      const result = relationships.validateRelationships(validSlugs)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect invalid source slug', () => {
      const content = `graph TD
patterns/nonexistent -->|solves| obstacles/black-box-ai`

      mockedFs.readFileSync.mockReturnValue(content)

      const validSlugs = new Set([
        'patterns/active-partner',
        'obstacles/black-box-ai',
      ])

      const result = relationships.validateRelationships(validSlugs)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Invalid source slug: "patterns/nonexistent"')
    })

    it('should detect invalid target slug', () => {
      const content = `graph TD
patterns/active-partner -->|solves| obstacles/nonexistent`

      mockedFs.readFileSync.mockReturnValue(content)

      const validSlugs = new Set([
        'patterns/active-partner',
        'obstacles/black-box-ai',
      ])

      const result = relationships.validateRelationships(validSlugs)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Invalid target slug: "obstacles/nonexistent"')
    })

    it('should detect multiple invalid slugs', () => {
      const content = `graph TD
patterns/nonexistent1 -->|solves| obstacles/nonexistent2
patterns/nonexistent3 -->|uses| patterns/active-partner`

      mockedFs.readFileSync.mockReturnValue(content)

      const validSlugs = new Set([
        'patterns/active-partner',
      ])

      const result = relationships.validateRelationships(validSlugs)

      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(1)
    })
  })

  describe('Cross-category Relationships', () => {
    it('should handle pattern to obstacle relationship', () => {
      const content = `graph TD
patterns/active-partner -->|solves| obstacles/black-box-ai`

      mockedFs.readFileSync.mockReturnValue(content)

      const result = relationships.getRelationshipsFor('active-partner', 'patterns')

      expect(result).toHaveLength(1)
      expect(result[0].from).toBe('patterns/active-partner')
      expect(result[0].to).toBe('obstacles/black-box-ai')
    })

    it('should handle pattern to anti-pattern relationship', () => {
      const content = `graph TD
patterns/active-partner -->|alternative| anti-patterns/answer-injection`

      mockedFs.readFileSync.mockReturnValue(content)

      const result = relationships.getRelationshipsFor('active-partner', 'patterns')

      expect(result).toHaveLength(1)
      expect(result[0].to).toBe('anti-patterns/answer-injection')
    })

    it('should handle anti-pattern to obstacle relationship', () => {
      const content = `graph TD
anti-patterns/answer-injection -->|causes| obstacles/confusion`

      mockedFs.readFileSync.mockReturnValue(content)

      const result = relationships.getRelationshipsFor('answer-injection', 'anti-patterns')

      expect(result).toHaveLength(1)
      expect(result[0].from).toBe('anti-patterns/answer-injection')
      expect(result[0].to).toBe('obstacles/confusion')
    })
  })

  describe('Complex Relationship Networks', () => {
    it('should handle pattern with multiple outgoing relationships to different categories', () => {
      const content = `graph TD
patterns/active-partner -->|solves| obstacles/black-box-ai
patterns/active-partner -->|related| patterns/chain-of-small-steps
patterns/active-partner -->|alternative| anti-patterns/answer-injection`

      mockedFs.readFileSync.mockReturnValue(content)

      const result = relationships.getRelationshipsFor('active-partner', 'patterns')

      expect(result).toHaveLength(3)
      expect(result.some(r => r.to.startsWith('obstacles/'))).toBe(true)
      expect(result.some(r => r.to.startsWith('patterns/'))).toBe(true)
      expect(result.some(r => r.to.startsWith('anti-patterns/'))).toBe(true)
    })

    it('should handle bidirectional relationship with different relationship types', () => {
      const content = `graph TD
patterns/active-partner <-->|related| patterns/chain-of-small-steps
patterns/active-partner -->|uses| patterns/show-me
patterns/chain-of-small-steps -->|uses| patterns/show-me`

      mockedFs.readFileSync.mockReturnValue(content)

      const activePartnerRels = relationships.getRelationshipsFor('active-partner', 'patterns')
      const chainRels = relationships.getRelationshipsFor('chain-of-small-steps', 'patterns')

      expect(activePartnerRels).toHaveLength(2)
      expect(chainRels).toHaveLength(2)
    })
  })
})
