import { render, screen } from '@testing-library/react'
import { MarkdownImage } from '@/app/components/markdownComponents'

let mockBasePath = ''

jest.mock('@/lib/config', () => ({
  get basePath() {
    return mockBasePath
  },
}))

describe('MarkdownImage', () => {
  afterEach(() => {
    mockBasePath = ''
  })

  it('prefixes a document image with the deployment base path', () => {
    mockBasePath = '/augmented-coding-patterns'

    render(<MarkdownImage src="/images/example.svg" alt="An example figure" />)

    expect(screen.getByAltText('An example figure')).toHaveAttribute(
      'src',
      '/augmented-coding-patterns/images/example.svg',
    )
  })

  it('leaves the path alone for a root deployment', () => {
    render(<MarkdownImage src="/images/example.svg" alt="An example figure" />)

    expect(screen.getByAltText('An example figure')).toHaveAttribute('src', '/images/example.svg')
  })

  it('leaves an external image untouched', () => {
    mockBasePath = '/augmented-coding-patterns'

    render(<MarkdownImage src="https://example.com/figure.svg" alt="An external figure" />)

    expect(screen.getByAltText('An external figure')).toHaveAttribute(
      'src',
      'https://example.com/figure.svg',
    )
  })

  it('renders nothing without a source', () => {
    const { container } = render(<MarkdownImage alt="Missing" />)

    expect(container).toBeEmptyDOMElement()
  })
})
