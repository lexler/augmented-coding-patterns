'use client'

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
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

type MenuButtonProps = {
  isOpen: boolean
  onToggle: () => void
  ref: RefObject<HTMLButtonElement | null>
}

function MenuButton({ isOpen, onToggle, ref }: MenuButtonProps) {
  return (
    <button
      ref={ref}
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
    </nav>
  )
}

function useCollapsibleMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const toggle = useCallback(() => setIsOpen(open => !open), [])
  const collapse = useCallback(() => setIsOpen(false), [])
  const collapseBackToMenuButton = useCallback(() => {
    collapse()
    menuButtonRef.current?.focus()
  }, [collapse])
  useCollapseOnEscape(isOpen, collapseBackToMenuButton)
  return { isOpen, menuButtonRef, toggle, collapse }
}

export default function SiteNavigation() {
  const menu = useCollapsibleMenu()

  return (
    <div className={styles.headerActions}>
      <NavigationPanel isOpen={menu.isOpen} onPick={menu.collapse} />
      <ThemeToggle />
      <MenuButton ref={menu.menuButtonRef} isOpen={menu.isOpen} onToggle={menu.toggle} />
    </div>
  )
}
