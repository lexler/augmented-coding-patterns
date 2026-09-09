import { renderHook, act } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { createElement } from 'react'
import { useTheme } from '@/app/hooks/useTheme'

function setDocumentTheme(theme: 'light' | 'dark') {
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(theme)
}

function ThemeProbe() {
  return createElement('span', null, useTheme().theme)
}

describe('useTheme', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('light', 'dark')
    window.localStorage.clear()
  })

  it('reads light theme from the document when the pre-hydration script chose light', () => {
    setDocumentTheme('light')

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('light')
  })

  it('reads dark theme from the document when the pre-hydration script chose dark', () => {
    setDocumentTheme('dark')

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('dark')
  })

  it('falls back to light when the document has no theme class', () => {
    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('light')
  })

  it('renders light on the server so the markup matches the first client render', () => {
    setDocumentTheme('dark')

    const markup = renderToString(createElement(ThemeProbe))

    expect(markup).toContain('light')
  })

  it('toggleTheme switches from light to dark', async () => {
    setDocumentTheme('light')
    const { result } = renderHook(() => useTheme())

    await act(async () => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('dark')
  })

  it('toggleTheme switches from dark to light', async () => {
    setDocumentTheme('dark')
    const { result } = renderHook(() => useTheme())

    await act(async () => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('light')
  })

  it('toggleTheme remembers the choice in localStorage', async () => {
    setDocumentTheme('light')
    const { result } = renderHook(() => useTheme())

    await act(async () => {
      result.current.toggleTheme()
    })

    expect(window.localStorage.getItem('theme')).toBe('dark')
  })

  it('toggleTheme replaces the theme class on the HTML element', async () => {
    setDocumentTheme('light')
    const { result } = renderHook(() => useTheme())

    await act(async () => {
      result.current.toggleTheme()
    })

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.classList.contains('light')).toBe(false)
  })

  it('follows theme class changes made outside the hook', async () => {
    setDocumentTheme('light')
    const { result } = renderHook(() => useTheme())

    await act(async () => {
      setDocumentTheme('dark')
    })

    expect(result.current.theme).toBe('dark')
  })
})
