import { render, screen } from '@testing-library/react'
import ContributorsPage from '@/app/contributors/page'
import { getContributorStats } from '@/lib/contributors'
import { ContributorStats } from '@/lib/contributors'
import { siteConfig } from '@/config/site'

jest.mock('@/lib/contributors')

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: { src: string; alt: string; width: number; height: number }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={props.src} alt={props.alt} width={props.width} height={props.height} />
  }
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => {
    return <a href={href} {...props}>{children}</a>
  }
}))

const mockGetContributorStats = getContributorStats as jest.MockedFunction<typeof getContributorStats>

describe('Contributors Page', () => {
  const mockContributors: ContributorStats[] = [
    {
      authorId: 'author1',
      name: 'Alice Smith',
      github: 'alice',
      avatarUrl: 'https://github.com/alice.png',
      total: 5,
      patterns: 3,
      antiPatterns: 1,
      obstacles: 1
    },
    {
      authorId: 'author2',
      name: 'Bob Jones',
      github: 'bob',
      url: 'https://example.com',
      avatarUrl: 'https://github.com/bob.png',
      total: 3,
      patterns: 2,
      antiPatterns: 0,
      obstacles: 1
    },
    {
      authorId: 'author3',
      name: 'Charlie Brown',
      github: 'charlie',
      avatarUrl: 'https://github.com/charlie.png',
      total: 1,
      patterns: 1,
      antiPatterns: 0,
      obstacles: 0
    }
  ]

  beforeEach(() => {
    mockGetContributorStats.mockReturnValue(mockContributors)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render page title "Contributors"', () => {
    render(<ContributorsPage />)
    const heading = screen.getByRole('heading', { name: /Contributors/i, level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it('should render description text', () => {
    render(<ContributorsPage />)
    const description = screen.getByText(/Thank you to all the contributors/i)
    expect(description).toBeInTheDocument()
  })

  it('should link to the contribution guide in a new tab', () => {
    render(<ContributorsPage />)
    const guideLink = screen.getByRole('link', { name: /contribution guide/i })
    expect(guideLink).toHaveAttribute('href', `${siteConfig.links.github}/blob/main/CONTRIBUTE.md`)
    expect(guideLink).toHaveAttribute('target', '_blank')
    expect(guideLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should render contributor cards with avatar, name, and counts', () => {
    render(<ContributorsPage />)

    expect(screen.getByText('Alice Smith')).toBeInTheDocument()
    expect(screen.getByAltText("Alice Smith's avatar")).toBeInTheDocument()
    expect(screen.getByText('5 contributions')).toBeInTheDocument()

    expect(screen.getByText('Bob Jones')).toBeInTheDocument()
    expect(screen.getByAltText("Bob Jones's avatar")).toBeInTheDocument()
    expect(screen.getByText('3 contributions')).toBeInTheDocument()

    expect(screen.getByText('Charlie Brown')).toBeInTheDocument()
    expect(screen.getByAltText("Charlie Brown's avatar")).toBeInTheDocument()
    expect(screen.getByText('1 contribution')).toBeInTheDocument()
  })

  it('should display avatar images with correct src and alt attributes', () => {
    render(<ContributorsPage />)

    const aliceAvatar = screen.getByAltText("Alice Smith's avatar")
    expect(aliceAvatar).toHaveAttribute('src', 'https://github.com/alice.png')
    expect(aliceAvatar).toHaveAttribute('width', '32')
    expect(aliceAvatar).toHaveAttribute('height', '32')

    const bobAvatar = screen.getByAltText("Bob Jones's avatar")
    expect(bobAvatar).toHaveAttribute('src', 'https://github.com/bob.png')
  })

  it('should link to github url when no custom url is provided', () => {
    render(<ContributorsPage />)

    const aliceLink = screen.getByRole('link', { name: 'Alice Smith' })
    expect(aliceLink).toHaveAttribute('href', 'https://github.com/alice')
  })

  it('should link to custom url when provided', () => {
    render(<ContributorsPage />)

    const bobLink = screen.getByRole('link', { name: 'Bob Jones' })
    expect(bobLink).toHaveAttribute('href', 'https://example.com')
  })

  it('should have proper external link attributes on all contributor links', () => {
    render(<ContributorsPage />)

    const links = screen.getAllByRole('link')
    const contributorLinks = links.filter(link =>
      link.textContent === 'Alice Smith' ||
      link.textContent === 'Bob Jones' ||
      link.textContent === 'Charlie Brown'
    )

    contributorLinks.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('should show correct contribution breakdown for multiple categories', () => {
    render(<ContributorsPage />)

    expect(screen.getByText('3 patterns, 1 anti-pattern, 1 obstacle')).toBeInTheDocument()
  })

  it('should show correct contribution breakdown for patterns only', () => {
    render(<ContributorsPage />)

    expect(screen.getByText('1 pattern')).toBeInTheDocument()
  })

  it('should show correct contribution breakdown for mixed contributions', () => {
    render(<ContributorsPage />)

    expect(screen.getByText('2 patterns, 1 obstacle')).toBeInTheDocument()
  })

  it('should pluralize patterns correctly', () => {
    render(<ContributorsPage />)

    expect(screen.getByText(/3 patterns/)).toBeInTheDocument()
    expect(screen.getByText(/2 patterns/)).toBeInTheDocument()
    expect(screen.getByText(/1 pattern/)).toBeInTheDocument()
  })

  it('should pluralize anti-patterns correctly', () => {
    render(<ContributorsPage />)

    expect(screen.getByText(/1 anti-pattern/)).toBeInTheDocument()
  })

  it('should pluralize obstacles correctly', () => {
    render(<ContributorsPage />)

    const obstacles = screen.getAllByText(/1 obstacle/)
    expect(obstacles.length).toBeGreaterThan(0)
  })

  it('should pluralize contributions correctly in badge', () => {
    render(<ContributorsPage />)

    expect(screen.getByText('5 contributions')).toBeInTheDocument()
    expect(screen.getByText('3 contributions')).toBeInTheDocument()
    expect(screen.getByText('1 contribution')).toBeInTheDocument()
  })

  it('should render all contributors in grid', () => {
    render(<ContributorsPage />)

    const contributorCards = screen.getAllByRole('article')
    expect(contributorCards).toHaveLength(3)
  })

  it('should use semantic HTML with article elements for contributor cards', () => {
    render(<ContributorsPage />)

    const articles = document.querySelectorAll('article')
    expect(articles.length).toBe(3)
  })

  it('should use semantic HTML with header element', () => {
    render(<ContributorsPage />)

    const header = document.querySelector('header')
    expect(header).toBeInTheDocument()
  })

  it('should handle contributor with no contributions showing in any category', () => {
    const contributorWithZero: ContributorStats = {
      authorId: 'author4',
      name: 'Dana White',
      github: 'dana',
      avatarUrl: 'https://github.com/dana.png',
      total: 0,
      patterns: 0,
      antiPatterns: 0,
      obstacles: 0
    }

    mockGetContributorStats.mockReturnValue([contributorWithZero])

    render(<ContributorsPage />)

    expect(screen.getByText('Dana White')).toBeInTheDocument()
    expect(screen.getByText('0 contributions')).toBeInTheDocument()
  })

  it('should handle empty contributors list', () => {
    mockGetContributorStats.mockReturnValue([])

    render(<ContributorsPage />)

    const heading = screen.getByRole('heading', { name: /Contributors/i, level: 1 })
    expect(heading).toBeInTheDocument()

    const articles = document.querySelectorAll('article')
    expect(articles.length).toBe(0)
  })

  it('should only show breakdown for categories with contributions greater than zero', () => {
    const contributorWithPatternOnly: ContributorStats = {
      authorId: 'author5',
      name: 'Eve Green',
      github: 'eve',
      avatarUrl: 'https://github.com/eve.png',
      total: 2,
      patterns: 2,
      antiPatterns: 0,
      obstacles: 0
    }

    mockGetContributorStats.mockReturnValue([contributorWithPatternOnly])

    render(<ContributorsPage />)

    const breakdowns = document.querySelectorAll('.breakdown')
    expect(breakdowns).toHaveLength(1)
    expect(breakdowns[0]).toHaveTextContent('2 patterns')
    expect(breakdowns[0]).not.toHaveTextContent('anti-pattern')
    expect(breakdowns[0]).not.toHaveTextContent('obstacle')
  })

  it('should render contributor cards with correct key attribute', () => {
    render(<ContributorsPage />)

    const articles = document.querySelectorAll('article')
    expect(articles).toHaveLength(3)
  })

  it('should make total contributions badge clickable with link to contributor detail page', () => {
    render(<ContributorsPage />)

    const aliceBadge = screen.getByRole('link', { name: /5 contributions/i })
    expect(aliceBadge).toHaveAttribute('href', '/contributors/author1/')

    const bobBadge = screen.getByRole('link', { name: /3 contributions/i })
    expect(bobBadge).toHaveAttribute('href', '/contributors/author2/')

    const charlieBadge = screen.getByRole('link', { name: /1 contribution/i })
    expect(charlieBadge).toHaveAttribute('href', '/contributors/author3/')
  })

  it('should have proper styling for clickable badge', () => {
    render(<ContributorsPage />)

    const aliceBadge = screen.getByRole('link', { name: /5 contributions/i })
    expect(aliceBadge).toHaveClass('totalBadge')
  })
})
