import { render, screen } from '@testing-library/react'
import StaticMap from '@/app/talk/StaticMap'

describe('StaticMap', () => {
  it('renders light and dark variants of the versioned diagram', () => {
    render(<StaticMap version="v2" alt="v2 map" />)

    const srcs = screen
      .getAllByAltText('v2 map')
      .map(img => img.getAttribute('src'))

    expect(srcs).toContain('/maps/diagram_v2.png')
    expect(srcs).toContain('/maps/diagram_v2_black.png')
  })
})
