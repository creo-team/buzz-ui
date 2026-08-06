import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { ShapeSwitcher } from '../../src/theme/shape-switcher'
import { describe, it, expect, beforeEach } from 'vitest'

// jsdom's real cookie jar doesn't clear via `document.cookie = ''`; redefine
// it as a plain overwritable string so each test starts clean.
Object.defineProperty(document, 'cookie', {
	writable: true,
	value: '',
})

describe('ShapeSwitcher', () => {
	beforeEach(() => {
		document.cookie = ''
		document.documentElement.removeAttribute('data-shape')
	})

	it('renders the three built-in presets as a labelled group', () => {
		render(<ShapeSwitcher initialShape="soft" />)
		expect(screen.getByRole('group', { name: 'Shape' })).toBeInTheDocument()
		expect(screen.getByLabelText('Switch to sharp corners')).toBeInTheDocument()
		expect(screen.getByLabelText('Switch to soft corners')).toBeInTheDocument()
		expect(screen.getByLabelText('Switch to round corners')).toBeInTheDocument()
	})

	it('marks the initial shape as active via aria-pressed', () => {
		render(<ShapeSwitcher initialShape="round" />)
		expect(screen.getByLabelText('Switch to round corners')).toHaveAttribute('aria-pressed', 'true')
		expect(screen.getByLabelText('Switch to sharp corners')).toHaveAttribute('aria-pressed', 'false')
	})

	it('applies data-shape to the document element and persists a cookie on click', () => {
		render(<ShapeSwitcher initialShape="soft" />)
		fireEvent.click(screen.getByLabelText('Switch to sharp corners'))
		expect(document.documentElement.getAttribute('data-shape')).toBe('sharp')
		expect(document.cookie).toContain('shape=sharp')
	})

	it('cycles to the next preset when clicking the already-active option', () => {
		render(<ShapeSwitcher initialShape="sharp" />)
		fireEvent.click(screen.getByLabelText('Switch to sharp corners'))
		// sharp -> soft is next in ALL_SHAPES order
		expect(document.documentElement.getAttribute('data-shape')).toBe('soft')
	})

	it('supports a restricted custom shape list', () => {
		render(
			<ShapeSwitcher
				initialShape="sharp"
				shapes={[
					{ value: 'sharp', label: 'Sharp' },
					{ value: 'round', label: 'Round' },
				]}
			/>
		)
		expect(screen.queryByLabelText('Switch to soft corners')).not.toBeInTheDocument()
		expect(screen.getByLabelText('Switch to round corners')).toBeInTheDocument()
	})
})
