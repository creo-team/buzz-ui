import { render, screen } from '@testing-library/react'
import React from 'react'
import { Infotip } from '../src/overlays/infotip'

describe('Infotip', () => {
	it('renders info button with proper aria-label', () => {
		render(<Infotip title="Heads up" description="Some helpful text" />)
		const button = screen.getByRole('button', { name: /Information: Heads up/i })
		expect(button).toBeInTheDocument()
		expect(button).toHaveAttribute('title', 'Some helpful text')
	})
})


