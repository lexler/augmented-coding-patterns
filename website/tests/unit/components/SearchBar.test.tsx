import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SearchBar from '@/app/components/SearchBar'
import { PatternContent } from '@/lib/types'
import { useRouter } from 'next/navigation'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('next/link', () => {
  return function Link({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }
})

describe('SearchBar', () => {
  const mockPush = jest.fn()
  const mockRouter = {
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }

  const mockPatterns: PatternContent[] = [
    {
      title: 'Active Partner',
      slug: 'active-partner',
      category: 'patterns',
      content: 'Pattern content',
      rawContent: 'Raw pattern content',
      emojiIndicator: '🤝',
    },
    {
      title: 'Test Driven Development',
      slug: 'test-driven-development',
      category: 'patterns',
      content: 'TDD content',
      rawContent: 'Raw TDD content',
      emojiIndicator: '✅',
    },
    {
      title: 'Copy Paste Coding',
      slug: 'copy-paste-coding',
      category: 'anti-patterns',
      content: 'Anti-pattern content',
      rawContent: 'Raw anti-pattern content',
      emojiIndicator: '📋',
    },
    {
      title: 'Context Window',
      slug: 'context-window',
      category: 'obstacles',
      content: 'Obstacle content',
      rawContent: 'Raw obstacle content',
      emojiIndicator: '📊',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  describe('Rendering Tests', () => {
    it('renders search input with correct placeholder', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      expect(searchInput).toBeInTheDocument()
      expect(searchInput).toHaveAttribute('placeholder', 'Search patterns...')
    })

    it('renders search input with correct aria-label', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      expect(searchInput).toHaveAttribute('aria-label', 'Search patterns')
    })

    it('renders search icon', () => {
      render(<SearchBar patterns={mockPatterns} />)

      expect(screen.getByText('🔍')).toBeInTheDocument()
    })

    it('initially shows no dropdown', () => {
      render(<SearchBar patterns={mockPatterns} />)

      expect(screen.queryByText('Obstacles')).not.toBeInTheDocument()
      expect(screen.queryByText('Anti-Patterns')).not.toBeInTheDocument()
      expect(screen.queryByText('Patterns')).not.toBeInTheDocument()
    })

    it('has search input with type="search"', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      expect(searchInput).toHaveAttribute('type', 'search')
    })

    it('has search input with autocomplete off', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      expect(searchInput).toHaveAttribute('autocomplete', 'off')
    })
  })

  describe('Search Functionality', () => {
    it('filters patterns by title (case-insensitive)', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'active' } })

      expect(screen.getByText('Active Partner')).toBeInTheDocument()
      expect(screen.queryByText('Test Driven Development')).not.toBeInTheDocument()
      expect(screen.queryByText('Copy Paste Coding')).not.toBeInTheDocument()
    })

    it('filters patterns case-insensitively with uppercase', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'ACTIVE' } })

      expect(screen.getByText('Active Partner')).toBeInTheDocument()
    })

    it('filters patterns case-insensitively with mixed case', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'AcTiVe' } })

      expect(screen.getByText('Active Partner')).toBeInTheDocument()
    })

    it('shows results grouped by category', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'co' } })

      expect(screen.getByText('Anti-Patterns')).toBeInTheDocument()
      expect(screen.getByText('Copy Paste Coding')).toBeInTheDocument()
      expect(screen.getByText('Obstacles')).toBeInTheDocument()
      expect(screen.getByText('Context Window')).toBeInTheDocument()
    })

    it('shows all categories when results exist in multiple categories', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'e' } })

      expect(screen.getByText('Patterns')).toBeInTheDocument()
      expect(screen.getByText('Active Partner')).toBeInTheDocument()
      expect(screen.getByText('Test Driven Development')).toBeInTheDocument()
      expect(screen.getByText('Anti-Patterns')).toBeInTheDocument()
      expect(screen.getByText('Copy Paste Coding')).toBeInTheDocument()
    })

    it('shows "No results found" when search returns nothing', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'xyz123notfound' } })

      expect(screen.getByText('No results found')).toBeInTheDocument()
    })

    it('shows correct pattern emoji and title in results', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'active' } })

      expect(screen.getByText('🤝')).toBeInTheDocument()
      expect(screen.getByText('Active Partner')).toBeInTheDocument()
    })

    it('displays all pattern emojis in search results', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'e' } })

      expect(screen.getByText('🤝')).toBeInTheDocument()
      expect(screen.getByText('✅')).toBeInTheDocument()
      expect(screen.getByText('📋')).toBeInTheDocument()
    })

    it('displays category icons in results', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'context' } })

      const categoryIcons = screen.getAllByText('⛰️')
      expect(categoryIcons.length).toBeGreaterThan(0)
    })

    it('filters by partial matches', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'part' } })

      expect(screen.getByText('Active Partner')).toBeInTheDocument()
    })

    it('does not show dropdown when search is empty', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: '' } })

      expect(screen.queryByText('No results found')).not.toBeInTheDocument()
    })

    it('does not show dropdown when search is only whitespace', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: '   ' } })

      expect(screen.queryByText('No results found')).not.toBeInTheDocument()
    })
  })

  describe('Interaction Tests', () => {
    it('opens dropdown when user types', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      expect(screen.queryByText('Active Partner')).not.toBeInTheDocument()

      fireEvent.change(searchInput, { target: { value: 'active' } })

      expect(screen.getByText('Active Partner')).toBeInTheDocument()
    })

    it('closes dropdown on Escape key', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'active' } })

      expect(screen.getByText('Active Partner')).toBeInTheDocument()

      fireEvent.keyDown(searchInput, { key: 'Escape' })

      expect(screen.queryByText('Active Partner')).not.toBeInTheDocument()
    })

    it('clears search input on Escape key', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox') as HTMLInputElement
      fireEvent.change(searchInput, { target: { value: 'active' } })

      expect(searchInput.value).toBe('active')

      fireEvent.keyDown(searchInput, { key: 'Escape' })

      expect(searchInput.value).toBe('')
    })

    it('closes dropdown when clicking outside', async () => {
      render(
        <div>
          <SearchBar patterns={mockPatterns} />
          <button data-testid="outside-button">Outside</button>
        </div>
      )

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'active' } })

      expect(screen.getByText('Active Partner')).toBeInTheDocument()

      const outsideButton = screen.getByTestId('outside-button')
      fireEvent.mouseDown(outsideButton)

      await waitFor(() => {
        expect(screen.queryByText('Active Partner')).not.toBeInTheDocument()
      })
    })

    it('keeps dropdown open when clicking inside search area', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'active' } })

      expect(screen.getByText('Active Partner')).toBeInTheDocument()

      fireEvent.mouseDown(searchInput)

      expect(screen.getByText('Active Partner')).toBeInTheDocument()
    })

    it('navigates to pattern when clicking a result', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'active' } })

      const resultLink = screen.getByRole('option', { name: /Active Partner/i })
      fireEvent.click(resultLink)

      expect(resultLink).toHaveAttribute('href', '/patterns/active-partner/')
    })

    it('clears search input after selecting a result', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox') as HTMLInputElement
      fireEvent.change(searchInput, { target: { value: 'active' } })

      expect(searchInput.value).toBe('active')

      const resultLink = screen.getByRole('option', { name: /Active Partner/i })
      fireEvent.click(resultLink)

      expect(searchInput.value).toBe('')
    })

    it('closes dropdown after selecting a result', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'active' } })

      const resultLink = screen.getByRole('option', { name: /Active Partner/i })
      fireEvent.click(resultLink)

      expect(screen.queryByText('Active Partner')).not.toBeInTheDocument()
    })

    it('generates correct URLs for different categories', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'co' } })

      const antiPatternLink = screen.getByRole('option', { name: /Copy Paste Coding/i })
      expect(antiPatternLink).toHaveAttribute('href', '/anti-patterns/copy-paste-coding/')

      const obstacleLink = screen.getByRole('option', { name: /Context Window/i })
      expect(obstacleLink).toHaveAttribute('href', '/obstacles/context-window/')
    })
  })

  describe('Keyboard Navigation', () => {
    it('arrow down selects first result', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'e' } })

      fireEvent.keyDown(searchInput, { key: 'ArrowDown' })

      const links = screen.getAllByRole('option')
      expect(links[0]).toHaveAttribute('aria-selected', 'true')
    })

    it('arrow down selects next result', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'e' } })

      fireEvent.keyDown(searchInput, { key: 'ArrowDown' })
      fireEvent.keyDown(searchInput, { key: 'ArrowDown' })

      const links = screen.getAllByRole('option')
      expect(links[1]).toHaveAttribute('aria-selected', 'true')
    })

    it('arrow up selects previous result', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'e' } })

      fireEvent.keyDown(searchInput, { key: 'ArrowDown' })
      fireEvent.keyDown(searchInput, { key: 'ArrowDown' })
      fireEvent.keyDown(searchInput, { key: 'ArrowUp' })

      const links = screen.getAllByRole('option')
      expect(links[0]).toHaveAttribute('aria-selected', 'true')
    })

    it('arrow up at first result deselects all', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'active' } })

      fireEvent.keyDown(searchInput, { key: 'ArrowDown' })
      fireEvent.keyDown(searchInput, { key: 'ArrowUp' })

      const links = screen.getAllByRole('option')
      expect(links[0]).toHaveAttribute('aria-selected', 'false')
    })

    it('enter key navigates to selected result', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'e' } })

      // First arrow down selects first result (Context Window from obstacles category)
      fireEvent.keyDown(searchInput, { key: 'ArrowDown' })
      fireEvent.keyDown(searchInput, { key: 'Enter' })

      expect(mockPush).toHaveBeenCalledWith('/obstacles/context-window/')
    })

    it('enter key without selection does nothing', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'active' } })

      fireEvent.keyDown(searchInput, { key: 'Enter' })

      expect(mockPush).not.toHaveBeenCalled()
    })

    it('enter key clears search after navigation', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox') as HTMLInputElement
      fireEvent.change(searchInput, { target: { value: 'active' } })

      fireEvent.keyDown(searchInput, { key: 'ArrowDown' })
      fireEvent.keyDown(searchInput, { key: 'Enter' })

      expect(searchInput.value).toBe('')
    })

    it('enter key closes dropdown after navigation', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'active' } })

      fireEvent.keyDown(searchInput, { key: 'ArrowDown' })
      fireEvent.keyDown(searchInput, { key: 'Enter' })

      expect(screen.queryByText('Active Partner')).not.toBeInTheDocument()
    })

    it('does not wrap around at end of results list', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'active' } })

      fireEvent.keyDown(searchInput, { key: 'ArrowDown' })
      fireEvent.keyDown(searchInput, { key: 'ArrowDown' })

      const links = screen.getAllByRole('option')
      expect(links[0]).toHaveAttribute('aria-selected', 'true')
    })

    it('navigates through multiple results correctly', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'co' } })

      fireEvent.keyDown(searchInput, { key: 'ArrowDown' })

      const links = screen.getAllByRole('option')
      expect(links[0]).toHaveAttribute('aria-selected', 'true')

      fireEvent.keyDown(searchInput, { key: 'ArrowDown' })
      expect(links[1]).toHaveAttribute('aria-selected', 'true')
    })

    it('keyboard navigation works without causing page scroll', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'active' } })

      // Arrow keys navigate results instead of scrolling the page
      fireEvent.keyDown(searchInput, { key: 'ArrowDown' })
      const links = screen.getAllByRole('option')
      expect(links[0]).toHaveAttribute('aria-selected', 'true')

      fireEvent.keyDown(searchInput, { key: 'ArrowUp' })
      expect(links[0]).toHaveAttribute('aria-selected', 'false')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty patterns array', () => {
      render(<SearchBar patterns={[]} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'test' } })

      expect(screen.getByText('No results found')).toBeInTheDocument()
    })

    it('handles patterns without emoji indicators', () => {
      const patternsWithoutEmojis: PatternContent[] = [
        {
          title: 'No Emoji Pattern',
          slug: 'no-emoji-pattern',
          category: 'patterns',
          content: 'Content',
          rawContent: 'Raw content',
        },
      ]

      render(<SearchBar patterns={patternsWithoutEmojis} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'emoji' } })

      expect(screen.getByText('No Emoji Pattern')).toBeInTheDocument()
    })

    it('maintains category order in results', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'e' } })

      const categoryHeaders = screen.queryAllByText(/Obstacles|Anti-Patterns|Patterns/)
      const headingsText = categoryHeaders.map(h => h.textContent)

      const obstaclesIndex = headingsText.findIndex(t => t === 'Obstacles')
      const antiPatternsIndex = headingsText.findIndex(t => t === 'Anti-Patterns')
      const patternsIndex = headingsText.findIndex(t => t === 'Patterns')

      if (obstaclesIndex !== -1 && antiPatternsIndex !== -1) {
        expect(obstaclesIndex).toBeLessThan(antiPatternsIndex)
      }
      if (antiPatternsIndex !== -1 && patternsIndex !== -1) {
        expect(antiPatternsIndex).toBeLessThan(patternsIndex)
      }
    })

    it('does not show category header if no results in that category', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'active' } })

      expect(screen.queryByText('Anti-Patterns')).not.toBeInTheDocument()
      expect(screen.queryByText('Obstacles')).not.toBeInTheDocument()
    })

    it('handles special characters in search', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: '()[]{}' } })

      expect(screen.getByText('No results found')).toBeInTheDocument()
    })

    it('resets selected index when search query changes', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'e' } })

      fireEvent.keyDown(searchInput, { key: 'ArrowDown' })
      fireEvent.keyDown(searchInput, { key: 'ArrowDown' })

      const links = screen.getAllByRole('option')
      expect(links[1]).toHaveAttribute('aria-selected', 'true')

      fireEvent.change(searchInput, { target: { value: 'active' } })

      const newLinks = screen.getAllByRole('option')
      expect(newLinks[0]).toHaveAttribute('aria-selected', 'false')
    })

    it('does not match with trailing spaces that break the search term', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'active  ' } })

      // The component searches for 'active  ' (with trailing spaces) which won't match 'Active Partner'
      expect(screen.getByText('No results found')).toBeInTheDocument()
    })

    it('does not match with leading spaces that break the search term', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: '  active' } })

      // The component searches for '  active' (with leading spaces) which won't match 'Active Partner'
      expect(screen.getByText('No results found')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('presents the input as a combobox', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      expect(searchInput).toBeInTheDocument()
    })

    it('has accessible label', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByLabelText('Search patterns')
      expect(searchInput).toBeInTheDocument()
    })

    it('maintains focus on input during keyboard navigation', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      searchInput.focus()
      fireEvent.change(searchInput, { target: { value: 'active' } })

      expect(document.activeElement).toBe(searchInput)

      fireEvent.keyDown(searchInput, { key: 'ArrowDown' })

      expect(document.activeElement).toBe(searchInput)
    })

    it('results are rendered as links for accessibility', () => {
      render(<SearchBar patterns={mockPatterns} />)

      const searchInput = screen.getByRole('combobox')
      fireEvent.change(searchInput, { target: { value: 'active' } })

      const resultLink = screen.getByRole('option', { name: /Active Partner/i })
      expect(resultLink).toBeInTheDocument()
      expect(resultLink.tagName).toBe('A')
    })
  })
})
