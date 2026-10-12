import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from '@/app/components/SearchBar'
import { PatternContent } from '@/lib/types'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

const pattern = (title: string, slug: string, category: PatternContent['category']): PatternContent => ({
  title,
  slug,
  category,
  content: '',
  rawContent: '',
})

const searchablePatterns = [
  pattern('Active Partner', 'active-partner', 'patterns'),
  pattern('Active Listening', 'active-listening', 'patterns'),
  pattern('Active Distraction', 'active-distraction', 'anti-patterns'),
]

const searchBox = () => screen.getByRole('combobox', { name: 'Search patterns' })
const resultsList = () => screen.getByRole('listbox', { name: 'Search results' })

describe('SearchBar accessibility', () => {
  beforeEach(() => {
    jest.mocked(Element.prototype.scrollIntoView).mockClear()
    render(<SearchBar patterns={searchablePatterns} />)
  })

  it('sits in a search landmark', () => {
    expect(within(screen.getByRole('search')).getByRole('combobox')).toBe(searchBox())
  })

  it('announces that the results list is collapsed before the reader types', () => {
    expect(searchBox()).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('announces the results list it controls once the reader types', async () => {
    await userEvent.type(searchBox(), 'active')

    expect(searchBox()).toHaveAttribute('aria-expanded', 'true')
    expect(searchBox()).toHaveAttribute('aria-controls', resultsList().id)
  })

  it('offers each match as an option, grouped by category', async () => {
    await userEvent.type(searchBox(), 'active')

    const patternsGroup = within(resultsList()).getByRole('group', { name: 'Patterns' })
    const antiPatternsGroup = within(resultsList()).getByRole('group', { name: 'Anti-Patterns' })
    expect(within(patternsGroup).getAllByRole('option')).toHaveLength(2)
    expect(within(patternsGroup).getByRole('option', { name: 'Active Partner' })).toBeInTheDocument()
    expect(within(patternsGroup).getByRole('option', { name: 'Active Listening' })).toBeInTheDocument()
    expect(within(antiPatternsGroup).getByRole('option', { name: 'Active Distraction' })).toBeInTheDocument()
  })

  it('marks no option as selected until the reader moves with the arrow keys', async () => {
    await userEvent.type(searchBox(), 'active')

    const options = within(resultsList()).getAllByRole('option')
    expect(options.every(option => option.getAttribute('aria-selected') === 'false')).toBe(true)
    expect(searchBox()).not.toHaveAttribute('aria-activedescendant')
  })

  it('marks the option the reader moved to as selected and active', async () => {
    await userEvent.type(searchBox(), 'active')
    await userEvent.keyboard('{ArrowDown}{ArrowDown}')

    const selected = within(resultsList()).getByRole('option', { selected: true })
    expect(selected).toHaveAccessibleName('Active Partner')
    expect(searchBox()).toHaveAttribute('aria-activedescendant', selected.id)
  })

  it('announces when nothing matches', async () => {
    await userEvent.type(searchBox(), 'nothing like this')

    expect(screen.getByRole('status')).toHaveTextContent('No results found')
  })

  it('keeps the results out of the Tab order, so focus stays in the search box', async () => {
    await userEvent.type(searchBox(), 'active')

    const options = within(resultsList()).getAllByRole('option')
    expect(options.every(option => option.getAttribute('tabindex') === '-1')).toBe(true)
  })

  it('closes the results when focus leaves the search box', async () => {
    await userEvent.type(searchBox(), 'active')
    await userEvent.tab()

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('reopens the matches on Arrow Down when the reader comes back to the search box', async () => {
    await userEvent.type(searchBox(), 'active')
    await userEvent.tab()
    await userEvent.tab({ shift: true })
    await userEvent.keyboard('{ArrowDown}')

    expect(searchBox()).toHaveAttribute('aria-expanded', 'true')
    expect(within(resultsList()).getByRole('option', { selected: true })).toHaveAccessibleName('Active Distraction')
  })

  it('keeps focus in the search box when the reader presses Escape', async () => {
    await userEvent.type(searchBox(), 'active')
    await userEvent.keyboard('{Escape}')

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(searchBox()).toHaveFocus()
  })

  it('keeps focus in the search box when Escape clears a search with no matches', async () => {
    await userEvent.type(searchBox(), 'nothing like this')
    await userEvent.keyboard('{Escape}')

    expect(searchBox()).toHaveValue('')
    expect(searchBox()).toHaveFocus()
  })

  it('clears the highlight when the reader moves the text cursor left or right', async () => {
    await userEvent.type(searchBox(), 'active')
    await userEvent.keyboard('{ArrowDown}{ArrowLeft}')

    expect(within(resultsList()).queryByRole('option', { selected: true })).not.toBeInTheDocument()
    expect(searchBox()).not.toHaveAttribute('aria-activedescendant')
  })

  it('scrolls the highlighted result into view', async () => {
    await userEvent.type(searchBox(), 'active')
    await userEvent.keyboard('{ArrowDown}')

    const highlighted = within(resultsList()).getByRole('option', { selected: true })
    const scrollIntoView = jest.mocked(Element.prototype.scrollIntoView)
    expect(scrollIntoView.mock.contexts).toContain(highlighted)
    expect(scrollIntoView).toHaveBeenLastCalledWith({ block: 'nearest' })
  })
})
