import '@testing-library/jest-dom'
import React from 'react'

global.matchMedia = global.matchMedia || function(query: string) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }
}

jest.mock('react-markdown', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: string }) => {
      return React.createElement('div', null, children)
    },
  }
})

jest.mock('remark-gfm', () => {
  return {
    __esModule: true,
    default: () => {},
  }
})

jest.mock('@/app/components/RelationshipGraph', () => {
  return {
    __esModule: true,
    default: function RelationshipGraph() {
      return React.createElement('div', { 'data-testid': 'relationship-graph' }, 'RelationshipGraph')
    },
  }
})

jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (() => {
    const DynamicComponent = (component: unknown) => component
    DynamicComponent.preload = () => {}
    DynamicComponent.displayName = 'LoadableComponent'
    return DynamicComponent
  })(),
}))
