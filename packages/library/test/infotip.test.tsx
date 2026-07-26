import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { Infotip } from '../src/overlays/infotip'

describe('Infotip', () => {
	it('renders info button with proper aria-label', () => {
		render(<Infotip title="Heads up" description="Some helpful text" />)
		const button = screen.getByRole('button', { name: /Information: Heads up/i })
		expect(button).toBeInTheDocument()
	})

	it('shows the tooltip on keyboard focus', async () => {
		render(<Infotip title="Heads up" description="Some helpful text" />)
		const button = screen.getByRole('button', { name: /Information: Heads up/i })
		fireEvent.focus(button)
		await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument())
		expect(screen.getByText('Some helpful text')).toBeInTheDocument()
	})
})
