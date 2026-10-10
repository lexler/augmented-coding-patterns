import type { Page } from '@playwright/test'
import { test, expect } from './fixtures'
import { followHeaderLink, openHeaderMenuIfCollapsed } from './header'

const headerDestinations = [
  { link: 'Home', url: '/', heading: 'Augmented Coding Patterns' },
  { link: 'Complete Catalog', url: '/pattern-catalog/', heading: 'Complete Catalog' },
  { link: 'Obstacles', url: '/obstacles/', heading: 'Obstacles' },
  { link: 'Anti-Patterns', url: '/anti-patterns/', heading: 'Anti-Patterns' },
  { link: 'Patterns', url: '/patterns/', heading: 'Patterns' },
  { link: 'Talk', url: '/talk/', heading: 'Patterns for Coding with AI' },
  { link: 'Contributors', url: '/contributors/', heading: 'Contributors' },
]

const screenWidths = [360, 390, 768, 1024, 1280, 1440]
const phoneHeldSideways = { width: 844, height: 390 }

async function pageScrollsSideways(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
}

test.describe('Header navigation', () => {
  for (const destination of headerDestinations) {
    test(`a reader reaches ${destination.link} from the header`, async ({ page }) => {
      await page.goto('/patterns/active-partner/')

      await followHeaderLink(page, destination.link)

      await expect(page).toHaveURL(destination.url)
      await expect(page.getByRole('heading', { level: 1 })).toContainText(destination.heading)
    })
  }

  test('a reader can switch the theme from the header', async ({ page }) => {
    await page.goto('/')
    const themeBefore = await page.locator('html').getAttribute('class')

    await openHeaderMenuIfCollapsed(page)
    await page.getByRole('button', { name: 'Toggle theme' }).click()

    await expect(page.locator('html')).not.toHaveAttribute('class', themeBefore ?? '')
  })

  test('the menu closes once the reader picks a page', async ({ page }) => {
    await page.goto('/')
    const menuButton = page.getByRole('button', { name: 'Menu' })
    test.skip(!(await menuButton.isVisible()), 'the header shows every link at this width')

    await followHeaderLink(page, 'Patterns')

    await expect(page).toHaveURL('/patterns/')
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Talk' })).toBeHidden()
  })
})

test.describe('Header on a wide screen', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('shows every page link without a menu button', async ({ page, isMobile }) => {
    test.skip(isMobile, 'phones never get the wide header')
    await page.goto('/')

    await expect(page.getByRole('button', { name: 'Menu' })).toBeHidden()
    for (const destination of headerDestinations) {
      await expect(page.getByRole('navigation').getByRole('link', { name: destination.link, exact: true })).toBeVisible()
    }
    await expect(page.getByRole('button', { name: 'Toggle theme' })).toBeVisible()
  })
})

test.describe('Header on a phone held sideways', () => {
  test('a reader reaches the last menu item', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'only phones are held sideways')
    await page.setViewportSize(phoneHeldSideways)
    await page.goto('/patterns/active-partner/')

    await openHeaderMenuIfCollapsed(page)
    await page.getByRole('button', { name: 'Toggle theme' }).click({ trial: true })
  })
})

test.describe('Page width', () => {
  test('the home page fits the screen without sideways scrolling', async ({ page }) => {
    await page.goto('/')

    expect(await pageScrollsSideways(page)).toBe(false)
  })

  test('the home page fits every common screen width', async ({ page, isMobile }) => {
    test.skip(isMobile, 'phones have one fixed width, covered by the test above')
    await page.goto('/')

    for (const width of screenWidths) {
      await page.setViewportSize({ width, height: 800 })
      expect(await pageScrollsSideways(page), `sideways scrolling at ${width}px`).toBe(false)
    }
  })
})
