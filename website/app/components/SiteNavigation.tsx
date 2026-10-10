'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import styles from '../layout.module.css'
import ThemeToggle from './ThemeToggle'

const NAVIGATION_ID = 'site-navigation'

const pages = [
  { href: '/', label: 'Home' },
  { href: '/pattern-catalog', label: 'Complete Catalog' },
  { href: '/obstacles', label: 'Obstacles' },
  { href: '/anti-patterns', label: 'Anti-Patterns' },
  { href: '/patterns', label: 'Patterns' },
  { href: '/talk', label: 'Talk' },
  { href: '/contributors', label: 'Contributors' },
]

function useCollapseOnEscape(isOpen: boolean, collapse: () => void) {
  useEffect(() => {
    if (!isOpen) return
    const collapseOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') collapse()
    }
    document.addEventListener('keydown', collapseOnEscape)
    return () => document.removeEventListener('keydown', collapseOnEscape)
  }, [isOpen, collapse])
}

function MenuButton({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className={styles.mobileMenuButton}
      aria-label="Menu"
      aria-expanded={isOpen}
      aria-controls={NAVIGATION_ID}
      onClick={onToggle}
    >
      ☰
    </button>
  )
}

function PageLinks({ onPick }: { onPick: () => void }) {
  return pages.map(page => (
    <Link key={page.href} href={page.href} className={styles.navLink} onClick={onPick}>
      {page.label}
    </Link>
  ))
}

function NavigationPanel({ isOpen, onPick }: { isOpen: boolean; onPick: () => void }) {
  return (
    <nav id={NAVIGATION_ID} className={`${styles.nav} ${isOpen ? styles.open : ''}`}>
      <PageLinks onPick={onPick} />
      <ThemeToggle />
    </nav>
  )
}

export default function SiteNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const collapse = useCallback(() => setIsOpen(false), [])
  useCollapseOnEscape(isOpen, collapse)

  return (
    <>
      <MenuButton isOpen={isOpen} onToggle={() => setIsOpen(open => !open)} />
      <NavigationPanel isOpen={isOpen} onPick={collapse} />
    </>
  )
}
