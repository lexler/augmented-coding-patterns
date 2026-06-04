import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MapTabs from '@/app/talk/MapTabs'

const tabs = [
  { id: 'v1', label: 'v1', title: 'First Talk', content: <div>first map</div> },
  { id: 'v2', label: 'v2', title: 'Second Talk', content: <div>second map</div> },
  { id: 'v3', label: 'v3', title: 'Third Talk', content: <div>third map</div> },
]

describe('MapTabs', () => {
  it('renders a tab for every entry', () => {
    render(<MapTabs tabs={tabs} />)

    expect(screen.getByRole('tab', { name: 'v1' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'v2' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'v3' })).toBeInTheDocument()
  })

  it('shows the first tab content by default', () => {
    render(<MapTabs tabs={tabs} />)

    expect(screen.getByText('first map')).toBeVisible()
    expect(screen.getByRole('tab', { name: 'v1' })).toHaveAttribute('aria-selected', 'true')
  })

  it('opens the given defaultTabId instead of the first tab', () => {
    render(<MapTabs tabs={tabs} defaultTabId="v3" />)

    expect(screen.getByText('third map')).toBeVisible()
    expect(screen.getByRole('tab', { name: 'v3' })).toHaveAttribute('aria-selected', 'true')
  })

  it('switches content when another tab is clicked', async () => {
    const user = userEvent.setup()
    render(<MapTabs tabs={tabs} />)

    await user.click(screen.getByRole('tab', { name: 'v2' }))

    expect(screen.getByText('second map')).toBeVisible()
    expect(screen.getByRole('tab', { name: 'v2' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'v1' })).toHaveAttribute('aria-selected', 'false')
  })

  it('shows only the active tab title as the single page heading', async () => {
    const user = userEvent.setup()
    render(<MapTabs tabs={tabs} />)

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('First Talk')

    await user.click(screen.getByRole('tab', { name: 'v3' }))

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Third Talk')
  })
})
