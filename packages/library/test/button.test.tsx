import { render, screen } from '@testing-library/react'
import React from 'react'
import { Button } from '../src/primitives/button'

describe('Button', () => {
	it('renders children', () => {
		render(<Button>Click</Button>)
		expect(screen.getByText('Click')).toBeInTheDocument()
	})

	it('applies subtle variant class', () => {
		render(<Button variant="subtle">Subtle</Button>)
		const btn = screen.getByText('Subtle')
		// Check that the button has the correct variant styling
		expect(btn).toHaveClass('bg-[var(--c-surface-2)]')
	})
})

