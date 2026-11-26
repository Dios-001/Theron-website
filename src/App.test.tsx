import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'
import { validate } from './components/Contact'

describe('Theron site', () => {
  it('renders the hero headline and both calls to action', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Your Cameras See Everything. Theron Understands It.')
    expect(screen.getAllByRole('button', { name: 'Request a Demo' }).length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'Explore Our Solutions' })).toBeInTheDocument()
  })

  it('shows the four solutions', () => {
    render(<App />)
    for (const name of ['Animal Detection', 'Instruction and Rule Violation Detection', 'PPE Detection and Compliance', 'Safety Violation Detection']) {
      expect(screen.getByRole('heading', { level: 3, name })).toBeInTheDocument()
    }
  })

  it('opens and closes the mobile menu', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    const menu = screen.getByRole('navigation', { name: 'Mobile' })
    expect(within(menu).getByRole('link', { name: 'Solutions' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Close menu' }))
    await waitFor(() => expect(screen.queryByRole('navigation', { name: 'Mobile' })).toBeNull())
  })

  it('validates the contact form and says it is a demo', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByText(/Demo mode/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Request a Consultation' }))
    expect(await screen.findByText('Enter your full name.')).toBeInTheDocument()
    expect(screen.getByText('Enter your work email.')).toBeInTheDocument()
  })

  it('validates email format', () => {
    const base = { fullName: 'A', company: 'B', email: 'nope', industry: 'x', solution: 'y', message: '' }
    expect(validate(base).email).toMatch(/Enter an email/)
    expect(validate({ ...base, email: 'a@b.co' }).email).toBeUndefined()
  })

  it('filters dashboard events with search and shows an empty state', async () => {
    const user = userEvent.setup()
    render(<App />)
    const search = await screen.findByLabelText('Search events, cameras, severity')
    await user.type(search, 'zzzz-no-match')
    expect(await screen.findByText('No events match these filters.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect((await screen.findAllByRole('row')).length).toBeGreaterThan(2)
  })

  it('labels the dashboard as sample data', async () => {
    render(<App />)
    expect(screen.getByText('Interactive Demo — Sample Data')).toBeInTheDocument()
    expect(await screen.findByText(/simulated sample data, no live cameras/)).toBeInTheDocument()
  })
})
