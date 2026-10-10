import { test as base, expect } from '@playwright/test'

export const test = base.extend<{ browserErrors: string[] }>({
  browserErrors: [
    async ({ page }, use) => {
      const errors: string[] = []
      page.on('pageerror', error => errors.push(error.message))
      page.on('console', message => {
        if (message.type() === 'error') errors.push(message.text())
      })
      await use(errors)
      expect(errors, 'the browser reported errors').toEqual([])
    },
    { auto: true },
  ],
})

export { expect }
