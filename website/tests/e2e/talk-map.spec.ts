import { test, expect } from './fixtures'
import mapIndexV4 from '../../public/maps/map-index-v4.json'

const visibleNode = (selector: string) => `.interactive-node${selector}:visible`

const [habitHooksNumber] = Object.entries(mapIndexV4).find(([, entry]) => entry.slug === 'habit-hooks') ?? []

test.describe('Talk map', () => {
  test('opens on the v4 map', async ({ page }) => {
    await page.goto('/talk/')

    await expect(page.getByRole('tab', { name: 'v4' })).toHaveAttribute('aria-selected', 'true')
  })

  test('a numbered node on the v4 map opens its pattern', async ({ page }) => {
    await page.goto('/talk/')

    await page.locator(visibleNode(`[data-number="${habitHooksNumber}"]`)).getByText(String(habitHooksNumber), { exact: true }).click()

    await expect(page.getByRole('heading', { level: 1, name: 'Habit Hooks' })).toBeVisible()
  })

  test('an obstacle on the v4 map opens by its name', async ({ page }) => {
    await page.goto('/talk/')

    await page.locator(visibleNode('[data-label="Selective Hearing"]')).click()

    await expect(page.getByRole('heading', { level: 1, name: 'Selective Hearing' })).toBeVisible()
  })
})
