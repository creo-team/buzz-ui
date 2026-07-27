import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { Button } from '../../src/primitives/button'
import { describe, it, expect, vi } from 'vitest'

describe('Button asChild', () => {
	it('renders the child element instead of a button', () => {
		render(
			<Button asChild variant="outline">
				<a href="/docs">Docs</a>
			</Button>
		)
		const link = screen.getByRole('link', { name: 'Docs' })
		expect(link).toHaveAttribute('href', '/docs')
		expect(link).toHaveClass('bz-button')
		expect(link).toHaveAttribute('data-variant', 'outline')
		expect(screen.queryByRole('button')).not.toBeInTheDocument()
	})

	it('composes click handlers from both sides', () => {
		const fromButton = vi.fn()
		const fromChild = vi.fn()
		render(
			<Button asChild onClick={fromButton}>
				<a href="#x" onClick={fromChild}>
					Go
				</a>
			</Button>
		)
		fireEvent.click(screen.getByRole('link'))
		expect(fromButton).toHaveBeenCalledTimes(1)
		expect(fromChild).toHaveBeenCalledTimes(1)
	})

	it('merges class names', () => {
		render(
			<Button asChild className="from-button">
				<a href="#x" className="from-child">
					Go
				</a>
			</Button>
		)
		const link = screen.getByRole('link')
		expect(link).toHaveClass('from-button')
		expect(link).toHaveClass('from-child')
	})
})
