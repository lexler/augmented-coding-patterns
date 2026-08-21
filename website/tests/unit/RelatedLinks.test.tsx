import { render, screen } from '@testing-library/react'
import RelatedLinks from '@/app/components/RelatedLinks'
import { RelatedPattern } from '@/lib/types'

// Helper function to convert string slugs to RelatedPattern objects
const titleFor = (slug: string): string =>
  slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

const toRelatedPatterns = (slugs: string[]): RelatedPattern[] =>
  slugs.map(slug => ({ slug, title: titleFor(slug), type: 'related' as const, direction: 'outgoing' as const }))

jest.mock('@/app/lib/category-config', () => ({
  getCategoryConfig: jest.fn((category: string) => {
    const configs: Record<string, { icon: string; labelPlural: string; styleClass: string }> = {
      'patterns': {
        icon: '🧩',
        labelPlural: 'Patterns',
        styleClass: 'patterns'
      },
      'anti-patterns': {
        icon: '⚠️',
        labelPlural: 'Anti-Patterns',
        styleClass: 'antiPatterns'
      },
      'obstacles': {
        icon: '⛰️',
        labelPlural: 'Obstacles',
        styleClass: 'obstacles'
      }
    }
    return configs[category]
  })
}))

describe('RelatedLinks Component', () => {
  it('renders nothing when no relationships provided', () => {
    const { container } = render(<RelatedLinks />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when all relationship arrays are empty', () => {
    const { container } = render(
      <RelatedLinks
        relatedPatterns={[]}
        relatedAntiPatterns={[]}
        relatedObstacles={[]}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders Related heading when relationships exist', () => {
    render(<RelatedLinks relatedPatterns={toRelatedPatterns(['test-pattern'])} />)
    const heading = screen.getByRole('heading', { name: 'Related', level: 2 })
    expect(heading).toBeInTheDocument()
  })

  it('correctly displays pattern links', () => {
    render(
      <RelatedLinks
        relatedPatterns={toRelatedPatterns(['active-partner', 'chain-of-small-steps'])}
      />
    )

    const patternsHeading = screen.getByRole('heading', { name: /Patterns/, level: 3 })
    expect(patternsHeading).toBeInTheDocument()

    const activePartnerLink = screen.getByRole('link', { name: 'Active Partner' })
    expect(activePartnerLink).toBeInTheDocument()
    expect(activePartnerLink).toHaveAttribute('href', '/patterns/active-partner')

    const chainLink = screen.getByRole('link', { name: 'Chain Of Small Steps' })
    expect(chainLink).toBeInTheDocument()
    expect(chainLink).toHaveAttribute('href', '/patterns/chain-of-small-steps')
  })

  it('correctly displays anti-pattern links', () => {
    render(
      <RelatedLinks
        relatedAntiPatterns={toRelatedPatterns(['answer-injection', 'distracted-agent'])}
      />
    )

    const antiPatternsHeading = screen.getByRole('heading', { name: /Anti-Patterns/, level: 3 })
    expect(antiPatternsHeading).toBeInTheDocument()

    const answerInjectionLink = screen.getByRole('link', { name: 'Answer Injection' })
    expect(answerInjectionLink).toBeInTheDocument()
    expect(answerInjectionLink).toHaveAttribute('href', '/anti-patterns/answer-injection')

    const distractedAgentLink = screen.getByRole('link', { name: 'Distracted Agent' })
    expect(distractedAgentLink).toBeInTheDocument()
    expect(distractedAgentLink).toHaveAttribute('href', '/anti-patterns/distracted-agent')
  })

  it('correctly displays obstacle links', () => {
    render(
      <RelatedLinks
        relatedObstacles={toRelatedPatterns(['black-box-ai', 'context-rot'])}
      />
    )

    const obstaclesHeading = screen.getByRole('heading', { name: /Obstacles/, level: 3 })
    expect(obstaclesHeading).toBeInTheDocument()

    const blackBoxLink = screen.getByRole('link', { name: 'Black Box Ai' })
    expect(blackBoxLink).toBeInTheDocument()
    expect(blackBoxLink).toHaveAttribute('href', '/obstacles/black-box-ai')

    const contextRotLink = screen.getByRole('link', { name: 'Context Rot' })
    expect(contextRotLink).toBeInTheDocument()
    expect(contextRotLink).toHaveAttribute('href', '/obstacles/context-rot')
  })

  it('links have correct href format', () => {
    render(
      <RelatedLinks
        relatedPatterns={toRelatedPatterns(['test-pattern'])}
        relatedAntiPatterns={toRelatedPatterns(['test-anti-pattern'])}
        relatedObstacles={toRelatedPatterns(['test-obstacle'])}
      />
    )

    const patternLink = screen.getByRole('link', { name: 'Test Pattern' })
    expect(patternLink).toHaveAttribute('href', '/patterns/test-pattern')

    const antiPatternLink = screen.getByRole('link', { name: 'Test Anti Pattern' })
    expect(antiPatternLink).toHaveAttribute('href', '/anti-patterns/test-anti-pattern')

    const obstacleLink = screen.getByRole('link', { name: 'Test Obstacle' })
    expect(obstacleLink).toHaveAttribute('href', '/obstacles/test-obstacle')
  })

  describe('Link labels', () => {
    it('renders the document title rather than deriving one from the slug', () => {
      const patterns: RelatedPattern[] = [
        { slug: 'pr-theatre', title: 'PR Theatre', type: 'related', direction: 'outgoing' }
      ]
      render(<RelatedLinks relatedAntiPatterns={patterns} />)
      expect(screen.getByRole('link', { name: 'PR Theatre' })).toBeInTheDocument()
    })
  })

  describe('Category sections visibility', () => {
    it('only shows patterns section when only patterns provided', () => {
      render(<RelatedLinks relatedPatterns={toRelatedPatterns(['test-pattern'])} />)

      expect(screen.getByRole('heading', { name: /🧩 Patterns/, level: 3 })).toBeInTheDocument()
      expect(screen.queryByRole('heading', { name: /⚠️ Anti-Patterns/, level: 3 })).not.toBeInTheDocument()
      expect(screen.queryByRole('heading', { name: /⛰️ Obstacles/, level: 3 })).not.toBeInTheDocument()
    })

    it('only shows anti-patterns section when only anti-patterns provided', () => {
      render(<RelatedLinks relatedAntiPatterns={toRelatedPatterns(['test-anti-pattern'])} />)

      expect(screen.queryByRole('heading', { name: /🧩 Patterns/, level: 3 })).not.toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /⚠️ Anti-Patterns/, level: 3 })).toBeInTheDocument()
      expect(screen.queryByRole('heading', { name: /⛰️ Obstacles/, level: 3 })).not.toBeInTheDocument()
    })

    it('only shows obstacles section when only obstacles provided', () => {
      render(<RelatedLinks relatedObstacles={toRelatedPatterns(['test-obstacle'])} />)

      expect(screen.queryByRole('heading', { name: /🧩 Patterns/, level: 3 })).not.toBeInTheDocument()
      expect(screen.queryByRole('heading', { name: /⚠️ Anti-Patterns/, level: 3 })).not.toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /⛰️ Obstacles/, level: 3 })).toBeInTheDocument()
    })

    it('shows all sections when all relationship types provided', () => {
      render(
        <RelatedLinks
          relatedPatterns={toRelatedPatterns(['test-pattern'])}
          relatedAntiPatterns={toRelatedPatterns(['test-anti-pattern'])}
          relatedObstacles={toRelatedPatterns(['test-obstacle'])}
        />
      )

      const headings = screen.getAllByRole('heading', { level: 3 })
      expect(headings).toHaveLength(3)
      expect(screen.getByRole('heading', { name: /🧩 Patterns/, level: 3 })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /⚠️ Anti-Patterns/, level: 3 })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /⛰️ Obstacles/, level: 3 })).toBeInTheDocument()
    })
  })

  describe('Category config usage', () => {
    it('displays correct icon for patterns', () => {
      render(<RelatedLinks relatedPatterns={toRelatedPatterns(['test-pattern'])} />)
      expect(screen.getByText('🧩')).toBeInTheDocument()
    })

    it('displays correct icon for anti-patterns', () => {
      render(<RelatedLinks relatedAntiPatterns={toRelatedPatterns(['test-anti-pattern'])} />)
      expect(screen.getByText('⚠️')).toBeInTheDocument()
    })

    it('displays correct icon for obstacles', () => {
      render(<RelatedLinks relatedObstacles={toRelatedPatterns(['test-obstacle'])} />)
      expect(screen.getByText('⛰️')).toBeInTheDocument()
    })

    it('uses correct category config labels', () => {
      render(
        <RelatedLinks
          relatedPatterns={toRelatedPatterns(['test-pattern'])}
          relatedAntiPatterns={toRelatedPatterns(['test-anti-pattern'])}
          relatedObstacles={toRelatedPatterns(['test-obstacle'])}
        />
      )

      expect(screen.getByText('Patterns')).toBeInTheDocument()
      expect(screen.getByText('Anti-Patterns')).toBeInTheDocument()
      expect(screen.getByText('Obstacles')).toBeInTheDocument()
    })
  })

  describe('Relationship direction and label display', () => {
    it('displays "Solves" for outgoing solves relationship', () => {
      const patterns: RelatedPattern[] = [
        { slug: 'black-box-ai', title: 'Black Box Ai', type: 'solves', direction: 'outgoing' }
      ]
      render(<RelatedLinks relatedObstacles={patterns} />)
      expect(screen.getByRole('heading', { name: 'Solves', level: 4 })).toBeInTheDocument()
    })

    it('displays "Solved by" for incoming solves relationship', () => {
      const patterns: RelatedPattern[] = [
        { slug: 'active-partner', title: 'Active Partner', type: 'solves', direction: 'incoming' }
      ]
      render(<RelatedLinks relatedPatterns={patterns} />)
      expect(screen.getByRole('heading', { name: 'Solved by', level: 4 })).toBeInTheDocument()
    })

    it('displays "Uses" for outgoing uses relationship', () => {
      const patterns: RelatedPattern[] = [
        { slug: 'chain-of-small-steps', title: 'Chain Of Small Steps', type: 'uses', direction: 'outgoing' }
      ]
      render(<RelatedLinks relatedPatterns={patterns} />)
      expect(screen.getByRole('heading', { name: 'Uses', level: 4 })).toBeInTheDocument()
    })

    it('displays "Used by" for incoming uses relationship', () => {
      const patterns: RelatedPattern[] = [
        { slug: 'active-partner', title: 'Active Partner', type: 'uses', direction: 'incoming' }
      ]
      render(<RelatedLinks relatedPatterns={patterns} />)
      expect(screen.getByRole('heading', { name: 'Used by', level: 4 })).toBeInTheDocument()
    })

    it('displays "Enables" for outgoing enables relationship', () => {
      const patterns: RelatedPattern[] = [
        { slug: 'active-partner', title: 'Active Partner', type: 'enables', direction: 'outgoing' }
      ]
      render(<RelatedLinks relatedPatterns={patterns} />)
      expect(screen.getByRole('heading', { name: 'Enables', level: 4 })).toBeInTheDocument()
    })

    it('displays "Enabled by" for incoming enables relationship', () => {
      const patterns: RelatedPattern[] = [
        { slug: 'chain-of-small-steps', title: 'Chain Of Small Steps', type: 'enables', direction: 'incoming' }
      ]
      render(<RelatedLinks relatedPatterns={patterns} />)
      expect(screen.getByRole('heading', { name: 'Enabled by', level: 4 })).toBeInTheDocument()
    })

    it('displays "Causes" for outgoing causes relationship', () => {
      const patterns: RelatedPattern[] = [
        { slug: 'context-rot', title: 'Context Rot', type: 'causes', direction: 'outgoing' }
      ]
      render(<RelatedLinks relatedAntiPatterns={patterns} />)
      expect(screen.getByRole('heading', { name: 'Causes', level: 4 })).toBeInTheDocument()
    })

    it('displays "Caused by" for incoming causes relationship', () => {
      const patterns: RelatedPattern[] = [
        { slug: 'answer-injection', title: 'Answer Injection', type: 'causes', direction: 'incoming' }
      ]
      render(<RelatedLinks relatedAntiPatterns={patterns} />)
      expect(screen.getByRole('heading', { name: 'Caused by', level: 4 })).toBeInTheDocument()
    })

    it('displays "Extends" for outgoing extends relationship', () => {
      const patterns: RelatedPattern[] = [
        { slug: 'text-native', title: 'Text Native', type: 'extends', direction: 'outgoing' }
      ]
      render(<RelatedLinks relatedPatterns={patterns} />)
      expect(screen.getByRole('heading', { name: 'Extends', level: 4 })).toBeInTheDocument()
    })

    it('displays "Extended by" for incoming extends relationship', () => {
      const patterns: RelatedPattern[] = [
        { slug: 'diagrams-as-code', title: 'Diagrams As Code', type: 'extends', direction: 'incoming' }
      ]
      render(<RelatedLinks relatedPatterns={patterns} />)
      expect(screen.getByRole('heading', { name: 'Extended by', level: 4 })).toBeInTheDocument()
    })

    it('displays same label for symmetric "similar" regardless of direction', () => {
      const outgoing: RelatedPattern[] = [
        { slug: 'pattern-one', title: 'Pattern One', type: 'similar', direction: 'outgoing' }
      ]
      const incoming: RelatedPattern[] = [
        { slug: 'pattern-two', title: 'Pattern Two', type: 'similar', direction: 'incoming' }
      ]

      const { rerender } = render(<RelatedLinks relatedPatterns={outgoing} />)
      expect(screen.getByRole('heading', { name: 'Similar to', level: 4 })).toBeInTheDocument()

      rerender(<RelatedLinks relatedPatterns={incoming} />)
      expect(screen.getByRole('heading', { name: 'Similar to', level: 4 })).toBeInTheDocument()
    })

    it('displays same label for symmetric "alternative" regardless of direction', () => {
      const outgoing: RelatedPattern[] = [
        { slug: 'pattern-one', title: 'Pattern One', type: 'alternative', direction: 'outgoing' }
      ]
      const incoming: RelatedPattern[] = [
        { slug: 'pattern-two', title: 'Pattern Two', type: 'alternative', direction: 'incoming' }
      ]

      const { rerender } = render(<RelatedLinks relatedAntiPatterns={outgoing} />)
      expect(screen.getByRole('heading', { name: 'Alternative to', level: 4 })).toBeInTheDocument()

      rerender(<RelatedLinks relatedAntiPatterns={incoming} />)
      expect(screen.getByRole('heading', { name: 'Alternative to', level: 4 })).toBeInTheDocument()
    })

    it('groups patterns by relationship type and direction', () => {
      const patterns: RelatedPattern[] = [
        { slug: 'pattern-one', title: 'Pattern One', type: 'related', direction: 'outgoing' },
        { slug: 'pattern-two', title: 'Pattern Two', type: 'solves', direction: 'outgoing' },
        { slug: 'pattern-three', title: 'Pattern Three', type: 'solves', direction: 'incoming' }
      ]

      render(<RelatedLinks relatedPatterns={patterns} />)

      // Should have separate headings for different type+direction combinations
      expect(screen.getByRole('heading', { name: 'Solves', level: 4 })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Solved by', level: 4 })).toBeInTheDocument()

      // Should display all three patterns
      expect(screen.getByRole('link', { name: 'Pattern One' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Pattern Two' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Pattern Three' })).toBeInTheDocument()
    })
  })

  describe('Semantic HTML', () => {
    it('uses aside element for container', () => {
      render(<RelatedLinks relatedPatterns={toRelatedPatterns(['test-pattern'])} />)
      const aside = document.querySelector('aside')
      expect(aside).toBeInTheDocument()
    })

    it('uses h2 for Related heading', () => {
      render(<RelatedLinks relatedPatterns={toRelatedPatterns(['test-pattern'])} />)
      const h2 = screen.getByRole('heading', { name: 'Related', level: 2 })
      expect(h2).toBeInTheDocument()
    })

    it('uses h3 for category headings', () => {
      render(<RelatedLinks relatedPatterns={toRelatedPatterns(['test-pattern'])} />)
      const h3 = screen.getByRole('heading', { name: /Patterns/, level: 3 })
      expect(h3).toBeInTheDocument()
    })

    it('uses ul element for links list', () => {
      render(<RelatedLinks relatedPatterns={toRelatedPatterns(['test-pattern'])} />)
      const ul = document.querySelector('ul')
      expect(ul).toBeInTheDocument()
    })

    it('uses li elements for list items', () => {
      render(<RelatedLinks relatedPatterns={toRelatedPatterns(['test-pattern-1', 'test-pattern-2'])} />)
      const listItems = document.querySelectorAll('li')
      expect(listItems).toHaveLength(2)
    })
  })
})
