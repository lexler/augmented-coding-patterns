'use client'

import { useState, useEffect, useRef, useId } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PatternContent, PatternCategory } from '@/lib/types'
import { getCategoryConfig } from '@/app/lib/category-config'
import styles from './SearchBar.module.css'

interface SearchBarProps {
  patterns: PatternContent[]
  onSelect?: (pattern: PatternContent) => void
}

interface GroupedResults {
  obstacles: PatternContent[]
  'anti-patterns': PatternContent[]
  patterns: PatternContent[]
}

const resultOptionId = (resultsListId: string, index: number) => `${resultsListId}-option-${index}`

export default function SearchBar({ patterns, onSelect }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [filteredPatterns, setFilteredPatterns] = useState<GroupedResults>({
    obstacles: [],
    'anti-patterns': [],
    patterns: []
  })

  const resultsListId = useId()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const categoryOrder: PatternCategory[] = ['obstacles', 'anti-patterns', 'patterns']

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPatterns({
        obstacles: [],
        'anti-patterns': [],
        patterns: []
      })
      setIsOpen(false)
      setSelectedIndex(-1)
      return
    }

    const query = searchQuery.toLowerCase()
    const results: GroupedResults = {
      obstacles: [],
      'anti-patterns': [],
      patterns: []
    }

    patterns.forEach(pattern => {
      if (pattern.title.toLowerCase().includes(query)) {
        results[pattern.category].push(pattern)
      }
    })

    setFilteredPatterns(results)
    setIsOpen(true)
    setSelectedIndex(-1)
  }, [searchQuery, patterns])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const flattenedResults = categoryOrder.flatMap(category =>
    filteredPatterns[category].map(pattern => ({
      pattern,
      category
    }))
  )

  const totalResults = flattenedResults.length

  useEffect(() => {
    if (selectedIndex < 0) return
    document.getElementById(resultOptionId(resultsListId, selectedIndex))?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex, resultsListId])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || totalResults === 0) {
      if (event.key === 'Escape') {
        setSearchQuery('')
      }
      return
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setSelectedIndex(prev => (prev < totalResults - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        event.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        event.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < totalResults) {
          const selectedResult = flattenedResults[selectedIndex]
          if (onSelect) {
            onSelect(selectedResult.pattern)
            setSearchQuery('')
            setIsOpen(false)
            inputRef.current?.blur()
          } else {
            const url = `/${selectedResult.category}/${selectedResult.pattern.slug}/`
            router.push(url)
            setSearchQuery('')
            setIsOpen(false)
            inputRef.current?.blur()
          }
        }
        break
      case 'Escape':
        event.preventDefault()
        setIsOpen(false)
        setSearchQuery('')
        break
      case 'ArrowLeft':
      case 'ArrowRight':
        setSelectedIndex(-1)
        break
    }
  }

  const handleResultClick = () => {
    setSearchQuery('')
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const hasResults = totalResults > 0
  const showsResults = isOpen && searchQuery.trim() !== ''
  const listsResults = showsResults && hasResults
  const activeOptionId = listsResults && selectedIndex >= 0 ? resultOptionId(resultsListId, selectedIndex) : undefined

  return (
    <div className={styles.searchContainer} ref={searchRef} role="search">
      <div className={styles.searchInputWrapper}>
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-label="Search patterns"
          aria-autocomplete="list"
          aria-expanded={listsResults}
          aria-controls={resultsListId}
          aria-activedescendant={activeOptionId}
          className={styles.searchInput}
          placeholder="Search patterns..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setIsOpen(false)}
          autoComplete="off"
        />
        <span className={styles.searchIcon} aria-hidden="true">🔍</span>
      </div>

      {showsResults && (
        <div className={styles.dropdown}>
          {hasResults ? (
            <div className={styles.resultsList} role="listbox" id={resultsListId} aria-label="Search results">
              {categoryOrder.map(category => {
                const categoryResults = filteredPatterns[category]
                if (categoryResults.length === 0) return null

                const categoryConfig = getCategoryConfig(category)
                const startIndex = flattenedResults.findIndex(
                  item => item.category === category
                )

                return (
                  <div key={category} className={styles.categoryGroup} role="group" aria-labelledby={`${resultsListId}-${category}`}>
                    <div className={styles.categoryLabel} id={`${resultsListId}-${category}`}>
                      <span className={styles.categoryIcon} aria-hidden="true">
                        {categoryConfig.icon}
                      </span>
                      <span>{categoryConfig.labelPlural}</span>
                    </div>
                    <div className={styles.categoryResults}>
                      {categoryResults.map((pattern, index) => {
                        const absoluteIndex = startIndex + index
                        const isSelected = absoluteIndex === selectedIndex

                        const handleClick = (e: React.MouseEvent) => {
                          if (onSelect) {
                            e.preventDefault()
                            onSelect(pattern)
                            handleResultClick()
                          } else {
                            handleResultClick()
                          }
                        }

                        return (
                          <Link
                            key={pattern.slug}
                            href={`/${category}/${pattern.slug}/`}
                            className={`${styles.resultItem} ${
                              isSelected ? styles.resultItemSelected : ''
                            }`}
                            onClick={handleClick}
                            onMouseDown={event => event.preventDefault()}
                            tabIndex={-1}
                            role="option"
                            id={resultOptionId(resultsListId, absoluteIndex)}
                            aria-selected={isSelected}
                          >
                            <span className={styles.resultCategoryIcon} aria-hidden="true">
                              {categoryConfig.icon}
                            </span>
                            {pattern.emojiIndicator && (
                              <span className={styles.resultEmoji} aria-hidden="true">
                                {pattern.emojiIndicator}
                              </span>
                            )}
                            <span className={styles.resultTitle}>
                              {pattern.title}
                            </span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className={styles.noResults} role="status">No results found</div>
          )}
        </div>
      )}
    </div>
  )
}
