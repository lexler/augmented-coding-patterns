import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SiteNavigation from '@/app/components/SiteNavigation'

const menuButton = () => screen.getByRole('button', { name: 'Menu' })

describe('SiteNavigation', () => {
  beforeEach(() => {
    render(<SiteNavigation />)
  })

  it('starts with the menu collapsed', () => {
    expect(menuButton()).toHaveAttribute('aria-expanded', 'false')
  })

  it('controls the site navigation', () => {
    const navigation = screen.getByRole('navigation')

    expect(menuButton()).toHaveAttribute('aria-controls', navigation.id)
  })

  it('expands when the reader opens the menu', async () => {
    await userEvent.click(menuButton())

    expect(menuButton()).toHaveAttribute('aria-expanded', 'true')
  })

  it('collapses when the reader opens it a second time', async () => {
    await userEvent.click(menuButton())
    await userEvent.click(menuButton())

    expect(menuButton()).toHaveAttribute('aria-expanded', 'false')
  })

  it('collapses once the reader picks a page', async () => {
    await userEvent.click(menuButton())
    document.addEventListener('click', event => event.preventDefault(), { once: true })
    await userEvent.click(screen.getByRole('link', { name: 'Talk' }))

    expect(menuButton()).toHaveAttribute('aria-expanded', 'false')
  })

  it('collapses when the reader presses Escape', async () => {
    await userEvent.click(menuButton())
    await userEvent.keyboard('{Escape}')

    expect(menuButton()).toHaveAttribute('aria-expanded', 'false')
  })

  it('offers every page and the theme toggle', () => {
    const navigation = screen.getByRole('navigation')
    const linkNames = Array.from(navigation.querySelectorAll('a')).map(link => link.textContent)

    expect(linkNames).toEqual([
      'Home',
      'Complete Catalog',
      'Obstacles',
      'Anti-Patterns',
      'Patterns',
      'Talk',
      'Contributors',
    ])
    expect(screen.getByRole('button', { name: 'Toggle theme' })).toBeInTheDocument()
  })
})
