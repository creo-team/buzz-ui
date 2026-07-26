import { render, screen } from '@testing-library/react'
import React from 'react'
import { Button } from '../src/primitives/button'

describe('Button', () => {
	it('renders children', () => {
		render(<Button>Click</Button>)
		expect(screen.getByText('Click')).toBeInTheDocument()
	})

	it('applies subtle variant styling hook', () => {
		render(<Button variant="subtle">Subtle</Button>)
		const btn = screen.getByText('Subtle')
		expect(btn).toHaveClass('bz-button')
		expect(btn).toHaveAttribute('data-variant', 'subtle')
	})
})

