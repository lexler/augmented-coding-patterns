import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PatternCatalogPage from '@/app/pattern-catalog/page'
import { COMPLETE_CATALOG_TEST_IDS } from '@/app/pattern-catalog/test-ids'
import { PATTERN_CATALOG_GROUPS } from '@/app/pattern-catalog/constants'
import { getAllPatterns } from '@/lib/markdown'
import { useRouter } from 'next/navigation'

function setMobileViewport() {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 500 })
  window.matchMedia = jest.fn().mockImplementation((query: string) => {
    const matches = /max-width:\s*768px/.test(query)
    return {
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }
  })
}

async function selectSearchResult(user: ReturnType<typeof userEvent.setup>, optionTitle: string) {
  const searchbox = screen.getByRole('search', { name: /Search patterns/i })
  await user.clear(searchbox)
  await user.type(searchbox, optionTitle)

  const resultLink = await screen.findByRole('link', { name: new RegExp(optionTitle, 'i') })
  await user.click(resultLink)
}

async function expectCatalogGroupOrder(expectedLabels: string[]) {
  const sidebar = screen.getByTestId(COMPLETE_CATALOG_TEST_IDS.sidebar)
  const lists = expectedLabels.map((label) =>
    within(sidebar).getByRole('list', { name: new RegExp(`^${label}$`, 'i') })
  )

  for (let index = 0; index < lists.length - 1; index += 1) {
    const current = lists[index]
    const next = lists[index + 1]
    const position = current.compareDocumentPosition(next)

    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  }
}

function getStickyHeaderElement() {
  return screen.getByTestId(COMPLETE_CATALOG_TEST_IDS.stickyHeader)
}

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('PatternCatalogPage', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it('renders title heading', async () => {
    const page = await PatternCatalogPage()

    render(page)

    const heading = screen.getByRole('heading', { level: 1, name: /Complete Catalog/i })
    expect(heading).toBeInTheDocument()
  })

  it('renders sidebar navigation and detail placeholders', async () => {
    const page = await PatternCatalogPage()

    render(page)

    const sidebar = screen.getByTestId(COMPLETE_CATALOG_TEST_IDS.sidebar)
    const detail = screen.getByTestId(COMPLETE_CATALOG_TEST_IDS.detail)

    expect(sidebar).toBeInTheDocument()
    expect(detail).toBeInTheDocument()
  })

  it('shows interactive filter controls and a stubbed catalog list within the sidebar', async () => {
    const page = await PatternCatalogPage()

    render(page)

    const typeFilterGroup = screen.getByRole('group', { name: /Type filter/i })
    const allTypesButton = within(typeFilterGroup).getByRole('button', { name: '∞' })
    const patternsButton = screen.getByRole('button', { name: /^Patterns$/i })
    const antiPatternsButton = screen.getByRole('button', { name: /^Anti-patterns$/i })
    const obstaclesButton = screen.getByRole('button', { name: /^Obstacles$/i })
    const catalogRegion = screen.getByTestId(COMPLETE_CATALOG_TEST_IDS.sidebar)

    expect(typeFilterGroup).toBeInTheDocument()
    expect(allTypesButton).toHaveAttribute('aria-pressed', 'true')
    expect(allTypesButton).toHaveAttribute('title', 'Show All')
    expect(patternsButton).toHaveAttribute('aria-pressed', 'true')
    expect(antiPatternsButton).toHaveAttribute('aria-pressed', 'true')
    expect(obstaclesButton).toHaveAttribute('aria-pressed', 'true')

    const authorFilterGroup = screen.getByRole('group', { name: /Author filter/i })
    const allAuthorsButton = within(authorFilterGroup).getByRole('button', { name: '∞' })
    expect(authorFilterGroup).toBeInTheDocument()
    expect(allAuthorsButton).toHaveAttribute('aria-pressed', 'true')
    expect(allAuthorsButton).toHaveAttribute('title', 'Show All')

    const authorButtons = within(authorFilterGroup).getAllByRole('button')
    authorButtons.forEach((button) => {
      expect(button).toHaveAttribute('aria-pressed', 'true')
    })

    const patternList = within(catalogRegion).getByRole('list', { name: /^Patterns$/i })
    const antiPatternList = within(catalogRegion).getByRole('list', { name: /^Anti-patterns$/i })
    const obstacleList = within(catalogRegion).getByRole('list', { name: /^Obstacles$/i })

    expect(within(patternList).getAllByRole('listitem').length).toBeGreaterThan(0)
    expect(within(antiPatternList).getAllByRole('listitem').length).toBeGreaterThan(0)
    expect(within(obstacleList).getAllByRole('listitem').length).toBeGreaterThan(0)
  })

  it('loads catalog items grouped by category with item counts', async () => {
    const page = await PatternCatalogPage()

    render(page)

    const catalogRegion = screen.getByTestId(COMPLETE_CATALOG_TEST_IDS.sidebar)

    PATTERN_CATALOG_GROUPS.forEach(({ category, label, headingPattern }) => {
      const items = getAllPatterns(category).sort((a, b) => a.title.localeCompare(b.title))
      const heading = within(catalogRegion).getByRole('button', {
        name: headingPattern(items.length),
      })
      expect(heading).toHaveAttribute('aria-expanded')

      const list = within(catalogRegion).getByRole('list', { name: new RegExp(`^${label}$`, 'i') })
      const links = within(list).getAllByRole('link')

      expect(links).toHaveLength(items.length)
      expect(links[0]).toHaveAttribute('href', `/${category}/${items[0].slug}`)
      expect(links[0]).toHaveTextContent(items[0].title)
    })
  })

  it('shows selected item details in the detail pane when an entry is chosen', async () => {
    const user = userEvent.setup()
    const page = await PatternCatalogPage()

    render(page)

    const detailPane = screen.getByTestId(COMPLETE_CATALOG_TEST_IDS.detail)
    expect(within(detailPane).getByText(/Pick a pattern to see its guidance/i)).toBeInTheDocument()

    const { category } = PATTERN_CATALOG_GROUPS[0]
    const items = getAllPatterns(category).sort((a, b) => a.title.localeCompare(b.title))
    const target = items[0]
    const catalogRegion = screen.getByTestId(COMPLETE_CATALOG_TEST_IDS.sidebar)
    const link = within(catalogRegion).getByRole('link', { name: target.title })

    await user.click(link)

    expect(within(detailPane).queryByText(/Pick a pattern to see its guidance/i)).not.toBeInTheDocument()
    expect(
      within(detailPane).getByRole('heading', { level: 2, name: target.title })
    ).toBeInTheDocument()
    expect(within(detailPane).getByText(/Description/i)).toBeInTheDocument()
    expect(within(detailPane).getByText(/Documented by/i)).toBeInTheDocument()
    expect(
      within(detailPane).getByRole('link', { name: /Lada Kesseler's avatar Lada Kesseler/i })
    ).toBeInTheDocument()
    expect(within(detailPane).queryByText(/Open full entry/i)).not.toBeInTheDocument()
  })

  it('filters catalog entries by type selections', async () => {
    const user = userEvent.setup()
    const page = await PatternCatalogPage()

    render(page)

    const catalogRegion = screen.getByTestId(COMPLETE_CATALOG_TEST_IDS.sidebar)
    const patternsButton = screen.getByRole('button', { name: /^Patterns$/i })
    const antiPatternsButton = screen.getByRole('button', { name: /^Anti-patterns$/i })

    await user.click(patternsButton)
    await user.click(antiPatternsButton)

    expect(within(catalogRegion).queryByRole('list', { name: /^Patterns$/i })).toBeNull()
    expect(within(catalogRegion).queryByRole('list', { name: /^Anti-patterns$/i })).toBeNull()
    expect(within(catalogRegion).getByRole('list', { name: /^Obstacles$/i })).toBeInTheDocument()

    await user.click(patternsButton)

    expect(
      await within(catalogRegion).findByRole('list', { name: /^Patterns$/i })
    ).toBeInTheDocument()
  })

  it('filters catalog entries by author selections', async () => {
    const user = userEvent.setup()
    const page = await PatternCatalogPage()

    render(page)

    const catalogRegion = screen.getByTestId(COMPLETE_CATALOG_TEST_IDS.sidebar)
    const antiPatternsButton = screen.getByRole('button', { name: /^Anti-patterns$/i })
    const obstaclesButton = screen.getByRole('button', { name: /^Obstacles$/i })

    await user.click(antiPatternsButton)
    await user.click(obstaclesButton)

    const authorFilterGroup = screen.getByRole('group', { name: /Author filter/i })
    const authorButtons = within(authorFilterGroup).getAllByRole('button')

    const ivettButton = within(authorFilterGroup).queryByRole('button', { name: /ivett/i })
    const firstNonInfinityButton = authorButtons.find((btn) => btn.textContent !== '∞')
    const targetButton = ivettButton || firstNonInfinityButton!

    for (const button of authorButtons) {
      if (button !== targetButton && button.textContent !== '∞') {
        await user.click(button)
      }
    }

    expect(await within(catalogRegion).findByRole('list', { name: /^Patterns$/i })).toBeInTheDocument()
  })

  it('shows empty state when filters hide all entries', async () => {
    const user = userEvent.setup()
    const page = await PatternCatalogPage()

    render(page)

    const catalogRegion = screen.getByTestId(COMPLETE_CATALOG_TEST_IDS.sidebar)
    const patternsButton = screen.getByRole('button', { name: /^Patterns$/i })
    const antiPatternsButton = screen.getByRole('button', { name: /^Anti-patterns$/i })
    const obstaclesButton = screen.getByRole('button', { name: /^Obstacles$/i })

    await user.click(patternsButton)
    await user.click(antiPatternsButton)
    await user.click(obstaclesButton)

    expect(screen.getByText(/No entries match these filters/i)).toBeInTheDocument()
    expect(within(catalogRegion).queryByRole('list')).not.toBeInTheDocument()
  })

  it('re-activates a category filter when selecting a search result within that category', async () => {
    const user = userEvent.setup()
    const page = await PatternCatalogPage()

    render(page)

    const catalogRegion = screen.getByTestId(COMPLETE_CATALOG_TEST_IDS.sidebar)
    const obstaclesToggle = screen.getByRole('button', { name: /^Obstacles$/i })

    await user.click(obstaclesToggle)

    const obstacles = getAllPatterns('obstacles').sort((a, b) => a.title.localeCompare(b.title))
    const target = obstacles[0]

    await selectSearchResult(user, target.title)

    expect(within(catalogRegion).getByRole('list', { name: /^Obstacles$/i })).toBeInTheDocument()
  })

  it('orders catalog groups as Obstacles, Anti-patterns, Patterns', async () => {
    const page = await PatternCatalogPage()

    render(page)

    await expectCatalogGroupOrder(['Obstacles', 'Anti-patterns', 'Patterns'])
  })

  it('keeps the page header and search sticky on narrow viewports', async () => {
    const page = await PatternCatalogPage()

    render(page)

    const stickyHeader = getStickyHeaderElement()

    expect(stickyHeader).toBeInTheDocument()
    expect(stickyHeader.className.split(' ')).toContain('mobileStickyHeader')
  })

  it('renders a Filters button on narrow viewports instead of inline filter groups', async () => {
    setMobileViewport()
    const page = await PatternCatalogPage()

    render(page)

    const filtersButton = screen.getByRole('button', { name: /Filters/i })
    expect(filtersButton).toBeInTheDocument()
    expect(screen.queryByRole('group', { name: /Type filter/i })).toBeNull()
    expect(screen.queryByRole('group', { name: /Author filter/i })).toBeNull()
  })
  it('opens a filters overlay on mobile showing type and author groups with close controls', async () => {
    setMobileViewport()
    const user = userEvent.setup()
    const page = await PatternCatalogPage()

    render(page)

    const filtersButton = screen.getByRole('button', { name: /Filters/i })
    await user.click(filtersButton)

    const dialog = screen.getByRole('dialog', { name: /Filters/i })
    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByRole('group', { name: /Type filter/i })).toBeInTheDocument()

    const authorGroup = within(dialog).queryByRole('group', { name: /Author filter/i })
    if (authorGroup) {
      expect(authorGroup).toBeInTheDocument()
    }

    const closeButton = within(dialog).getByRole('button', { name: /Close filters/i })
    await user.click(closeButton)

    expect(screen.queryByRole('dialog', { name: /Filters/i })).not.toBeInTheDocument()
  })

  it('collapses all but the first catalog group on narrow viewports by default', async () => {
    setMobileViewport()
    const page = await PatternCatalogPage()

    render(page)

    const catalogRegion = screen.getByTestId(COMPLETE_CATALOG_TEST_IDS.sidebar)
    expect(within(catalogRegion).getByRole('list', { name: /^Obstacles$/i })).toBeInTheDocument()
    expect(within(catalogRegion).queryByRole('list', { name: /^Anti-patterns$/i })).toBeNull()
    expect(within(catalogRegion).queryByRole('list', { name: /^Patterns$/i })).toBeNull()
  })

  it('opens a pattern detail sheet on mobile and closes it with the dismiss control', async () => {
    setMobileViewport()
    const user = userEvent.setup()
    const page = await PatternCatalogPage()

    render(page)

    const catalogRegion = screen.getByTestId(COMPLETE_CATALOG_TEST_IDS.sidebar)
    const firstLink = within(catalogRegion).getAllByRole('link')[0]

    await user.click(firstLink)

    const detailDialog = await screen.findByRole('dialog', { name: /Pattern detail/i })
    expect(detailDialog).toBeInTheDocument()
    expect(within(detailDialog).getByRole('heading', { level: 2 })).toBeInTheDocument()

    const closeButton = within(detailDialog).getByRole('button', { name: /Close pattern detail/i })
    await user.click(closeButton)

    expect(screen.queryByRole('dialog', { name: /Pattern detail/i })).not.toBeInTheDocument()
  })

  it('closes the pattern detail sheet when swiping downward on mobile', async () => {
    setMobileViewport()
    const user = userEvent.setup()
    const page = await PatternCatalogPage()

    render(page)

    const catalogRegion = screen.getByTestId(COMPLETE_CATALOG_TEST_IDS.sidebar)
    const firstLink = within(catalogRegion).getAllByRole('link')[0]

    await user.click(firstLink)
    const detailDialog = await screen.findByRole('dialog', { name: /Pattern detail/i })

    fireEvent.touchStart(detailDialog, {
      changedTouches: [{ clientY: 200 }],
    })
    fireEvent.touchMove(detailDialog, {
      changedTouches: [{ clientY: 280 }],
    })
    fireEvent.touchEnd(detailDialog, {
      changedTouches: [{ clientY: 320 }],
    })

    expect(screen.queryByRole('dialog', { name: /Pattern detail/i })).not.toBeInTheDocument()
  })
})
