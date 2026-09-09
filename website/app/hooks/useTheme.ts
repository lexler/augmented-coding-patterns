import { useCallback, useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark'

const serverRenderedTheme: Theme = 'light'

function readThemeFromDocument(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function subscribeToDocumentTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}

function applyThemeToDOM(theme: Theme) {
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(theme)
}

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribeToDocumentTheme,
    readThemeFromDocument,
    () => serverRenderedTheme
  )

  const toggleTheme = useCallback(() => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light'
    applyThemeToDOM(newTheme)
    localStorage.setItem('theme', newTheme)
  }, [theme])

  return {
    theme,
    toggleTheme
  }
}
