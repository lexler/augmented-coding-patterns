import type { Page } from '@playwright/test'

export async function openHeaderMenuIfCollapsed(page: Page) {
  const menuButton = page.getByRole('button', { name: 'Menu' })
  if (await menuButton.isVisible()) {
    await menuButton.click()
  }
}

export async function followHeaderLink(page: Page, name: string) {
  await openHeaderMenuIfCollapsed(page)
  await page.getByRole('navigation').getByRole('link', { name, exact: true }).click()
}
