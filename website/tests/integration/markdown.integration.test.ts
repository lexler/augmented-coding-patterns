import { getPatternSlugs, getAllPatterns } from '@/lib/markdown'
import { existingPattern } from '../support/existing-pattern'

describe('Markdown utilities - Integration tests', () => {
  describe('getPatternSlugs', () => {
    it('should return actual pattern slugs from filesystem', () => {
      const slugs = getPatternSlugs('patterns')

      expect(slugs.length).toBeGreaterThan(0)
      expect(slugs).toContain('active-partner')
      expect(slugs).toContain('chain-of-small-steps')
      expect(slugs.every(slug => typeof slug === 'string')).toBe(true)
      expect(slugs.every(slug => !slug.endsWith('.md'))).toBe(true)
    })

    it('should return actual anti-pattern slugs from filesystem', () => {
      const slugs = getPatternSlugs('anti-patterns')

      expect(slugs.length).toBeGreaterThan(0)
      expect(slugs).toContain('answer-injection')
      expect(slugs.every(slug => typeof slug === 'string')).toBe(true)
    })

    it('should return actual obstacle slugs from filesystem', () => {
      const slugs = getPatternSlugs('obstacles')

      expect(slugs.length).toBeGreaterThan(0)
      expect(slugs).toContain('black-box-ai')
      expect(slugs.every(slug => typeof slug === 'string')).toBe(true)
    })
  })

  describe('getPatternBySlug', () => {
    it('should correctly parse Active Partner pattern', () => {
      const pattern = existingPattern('patterns', 'active-partner')

      expect(pattern.title).toBe('Active Partner')
      expect(pattern.category).toBe('patterns')
      expect(pattern.slug).toBe('active-partner')
      expect(pattern.content).toContain('AI defaults to silent compliance')
      expect(pattern.content).toContain('## Problem')
      expect(pattern.content).toContain('## Pattern')
    })

    it('should correctly parse Answer Injection anti-pattern', () => {
      const pattern = existingPattern('anti-patterns', 'answer-injection')

      expect(pattern.title).toBe('Answer Injection')
      expect(pattern.category).toBe('anti-patterns')
      expect(pattern.slug).toBe('answer-injection')
      expect(pattern.content).toContain('The way you ask a question can dramatically limit')
    })

    it('should correctly parse Black Box AI obstacle', () => {
      const pattern = existingPattern('obstacles', 'black-box-ai')

      expect(pattern.title).toBe('Black Box AI')
      expect(pattern.category).toBe('obstacles')
      expect(pattern.slug).toBe('black-box-ai')
      expect(pattern.content).toContain('AI\'s reasoning is hidden')
    })
  })

  describe('getAllPatterns', () => {
    it('should return all patterns with correct structure', () => {
      const patterns = getAllPatterns('patterns')

      expect(patterns.length).toBeGreaterThan(0)
      expect(patterns.every(p => p.title)).toBe(true)
      expect(patterns.every(p => p.slug)).toBe(true)
      expect(patterns.every(p => p.category === 'patterns')).toBe(true)
      expect(patterns.every(p => p.content)).toBe(true)
      expect(patterns.every(p => p.rawContent)).toBe(true)
    })

    it('should return all anti-patterns with correct structure', () => {
      const patterns = getAllPatterns('anti-patterns')

      expect(patterns.length).toBeGreaterThan(0)
      expect(patterns.every(p => p.category === 'anti-patterns')).toBe(true)
    })

    it('should return all obstacles with correct structure', () => {
      const patterns = getAllPatterns('obstacles')

      expect(patterns.length).toBeGreaterThan(0)
      expect(patterns.every(p => p.category === 'obstacles')).toBe(true)
    })
  })
})
