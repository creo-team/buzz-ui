import { render, screen } from '@testing-library/react'
import React from 'react'
import { Fab } from '../../src/primitives/fab'
import { describe, it, expect } from 'vitest'

describe('Fab', () => {
	it('renders a button with the bz-fab class and Button defaults', () => {
		render(<Fab aria-label="Add">+</Fab>)
		const button = screen.getByRole('button', { name: 'Add' })
		expect(button).toHaveClass('bz-fab')
		expect(button).toHaveClass('bz-button')
		expect(button).toHaveAttribute('data-variant', 'bold')
	})

	it('defaults to bottom-right and exposes it as data-position', () => {
		render(<Fab aria-label="Add">+</Fab>)
		expect(screen.getByRole('button')).toHaveAttribute('data-position', 'bottom-right')
	})

	it('accepts a custom position', () => {
		render(
			<Fab aria-label="Add" position="top-left">
				+
			</Fab>
		)
		expect(screen.getByRole('button')).toHaveAttribute('data-position', 'top-left')
	})

	it('applies the offset as a CSS custom property', () => {
		render(
			<Fab aria-label="Add" offset={40}>
				+
			</Fab>
		)
		expect(screen.getByRole('button')).toHaveStyle('--bz-fab-offset: 40px')
	})

	it('passes through Button props like variant, size and iconOnly', () => {
		render(
			<Fab aria-label="Add" variant="success" size="lg" iconOnly>
				+
			</Fab>
		)
		const button = screen.getByRole('button')
		expect(button).toHaveAttribute('data-variant', 'success')
		expect(button).toHaveAttribute('data-size', 'lg')
		expect(button).toHaveAttribute('data-icon-only')
	})

	it('supports asChild to render a link styled as a Fab', () => {
		render(
			<Fab asChild position="bottom-left">
				<a href="/new">New</a>
			</Fab>
		)
		const link = screen.getByRole('link', { name: 'New' })
		expect(link).toHaveClass('bz-fab')
		expect(link).toHaveAttribute('data-position', 'bottom-left')
		expect(screen.queryByRole('button')).not.toBeInTheDocument()
	})

	it('forwards a ref to the underlying button element', () => {
		const ref = React.createRef<HTMLButtonElement>()
		render(
			<Fab ref={ref} aria-label="Add">
				+
			</Fab>
		)
		expect(ref.current).toBeInstanceOf(HTMLButtonElement)
	})
})
