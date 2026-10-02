import { render, screen, within } from '@testing-library/react'
import RootLayout from '@/app/layout'
import { siteConfig } from '@/config/site'

const getNavLinkTexts = () => {
  const nav = screen.getByRole('navigation')
  const links = within(nav).getAllByRole('link')
  return links.map(link => link.textContent?.trim() ?? '')
}

describe('RootLayout', () => {
  const mockChildren = <div>Test Content</div>
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation((message) => {
      if (typeof message === 'string' && message.includes('cannot be a child of')) {
        return
      }
      console.warn(message)
    })

    render(<RootLayout>{mockChildren}</RootLayout>)
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  describe('Header', () => {
    it('renders header with site name as logo', () => {
      const logo = screen.getByRole('link', { name: siteConfig.name })
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveAttribute('href', '/')
    })

    it('renders navigation with all category links', () => {
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()

      const homeLink = screen.getByRole('link', { name: 'Home' })
      expect(homeLink).toBeInTheDocument()
      expect(homeLink).toHaveAttribute('href', '/')

      const obstaclesLink = screen.getByRole('link', { name: 'Obstacles' })
      expect(obstaclesLink).toBeInTheDocument()
      expect(obstaclesLink).toHaveAttribute('href', '/obstacles')

      const antiPatternsLink = screen.getByRole('link', { name: 'Anti-Patterns' })
      expect(antiPatternsLink).toBeInTheDocument()
      expect(antiPatternsLink).toHaveAttribute('href', '/anti-patterns')

      const patternsLink = screen.getByRole('link', { name: 'Patterns' })
      expect(patternsLink).toBeInTheDocument()
      expect(patternsLink).toHaveAttribute('href', '/patterns')
    })

    it('renders Complete Catalog link between Home and Obstacles', () => {
      const navLinks = getNavLinkTexts()
      expect(navLinks).toEqual([
        'Home',
        'Complete Catalog',
        'Obstacles',
        'Anti-Patterns',
        'Patterns',
        'Talk',
        'Contributors',
      ])
    })

    it('has proper semantic HTML structure with header element', () => {
      const header = document.querySelector('header')
      expect(header).toBeInTheDocument()
    })
  })

  describe('Main Content', () => {
    it('renders children within main element', () => {
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
      expect(main).toHaveTextContent('Test Content')
    })

    it('has proper semantic HTML structure with main element', () => {
      const main = document.querySelector('main')
      expect(main).toBeInTheDocument()
    })
  })

  describe('Footer', () => {
    it('renders footer with site tagline', () => {
      const footerText = screen.getByText('Patterns for building software with AI')
      expect(footerText).toBeInTheDocument()
    })

    it('renders GitHub link with proper attributes', () => {
      const githubLink = screen.getByRole('link', { name: 'GitHub' })
      expect(githubLink).toBeInTheDocument()
      expect(githubLink).toHaveAttribute('href', siteConfig.links.github)
      expect(githubLink).toHaveAttribute('target', '_blank')
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('links the contribution guide', () => {
      const contributeLink = screen.getByRole('link', { name: 'Contribute' })
      expect(contributeLink).toHaveAttribute('href', `${siteConfig.repository.url}/blob/main/CONTRIBUTE.md`)
      expect(contributeLink).toHaveAttribute('target', '_blank')
      expect(contributeLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('labels the licenses for content and code', () => {
      const footer = screen.getByRole('contentinfo')
      expect(footer).toHaveTextContent('License: content CC BY 4.0, code MIT')
    })

    it('links the content license', () => {
      const contentLicense = screen.getByRole('link', { name: 'CC BY 4.0' })
      expect(contentLicense).toHaveAttribute('href', 'https://creativecommons.org/licenses/by/4.0/')
      expect(contentLicense).toHaveAttribute('rel', 'license noopener noreferrer')
    })

    it('links the code license', () => {
      const codeLicense = screen.getByRole('link', { name: 'MIT' })
      expect(codeLicense).toHaveAttribute('href', `${siteConfig.repository.url}/blob/main/LICENSE-CODE`)
      expect(codeLicense).toHaveAttribute('rel', 'license noopener noreferrer')
    })

    it('has proper semantic HTML structure with footer element', () => {
      const footer = document.querySelector('footer')
      expect(footer).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('sets proper language attribute on html element', () => {
      const html = document.querySelector('html')
      expect(html).toHaveAttribute('lang', 'en')
    })

    it('renders all navigation links as proper anchor elements', () => {
      const navLinks = screen.getAllByRole('link')
      expect(navLinks.length).toBeGreaterThan(0)
      navLinks.forEach(link => {
        expect(link.tagName).toBe('A')
      })
    })
  })
})
