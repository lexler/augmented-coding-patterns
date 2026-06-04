import { render, screen } from '@testing-library/react'
import StaticMap from '@/app/talk/StaticMap'

describe('StaticMap', () => {
  it('renders light and dark variants of the versioned diagram', () => {
    render(<StaticMap version="v3" alt="v3 map" />)

    const srcs = screen
      .getAllByAltText('v3 map')
      .map(img => img.getAttribute('src'))

    expect(srcs).toContain('/maps/diagram_v3.png')
    expect(srcs).toContain('/maps/diagram_v3_black.png')
  })
})
