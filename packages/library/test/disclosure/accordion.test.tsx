import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { Accordion } from '../../src/disclosure/accordion'
import { describe, it, expect, vi } from 'vitest'

const items = [
	{ key: 'a', header: 'Section A', content: 'Content A' },
	{ key: 'b', header: 'Section B', content: 'Content B' },
	{ key: 'c', header: 'Section C', content: 'Content C', disabled: true },
]

describe('Accordion', () => {
	it('wires aria-expanded and aria-controls to a labelled region', () => {
		render(<Accordion items={items} defaultOpenKey="a" />)
		const trigger = screen.getByRole('button', { name: 'Section A' })
		expect(trigger).toHaveAttribute('aria-expanded', 'true')
		const region = screen.getByRole('region', { name: 'Section A' })
		expect(trigger.getAttribute('aria-controls')).toBe(region.id)
	})

	it('opens and closes uncontrolled (single-open)', () => {
		render(<Accordion items={items} />)
		fireEvent.click(screen.getByRole('button', { name: 'Section A' }))
		expect(screen.getByRole('button', { name: 'Section A' })).toHaveAttribute('aria-expanded', 'true')

		fireEvent.click(screen.getByRole('button', { name: 'Section B' }))
		expect(screen.getByRole('button', { name: 'Section B' })).toHaveAttribute('aria-expanded', 'true')
		expect(screen.getByRole('button', { name: 'Section A' })).toHaveAttribute('aria-expanded', 'false')

		// Clicking the open item closes it
		fireEvent.click(screen.getByRole('button', { name: 'Section B' }))
		expect(screen.getByRole('button', { name: 'Section B' })).toHaveAttribute('aria-expanded', 'false')
	})

	it('respects controlled openKey and reports changes', () => {
		const onChange = vi.fn()
		render(<Accordion items={items} openKey="a" onChange={onChange} />)
		fireEvent.click(screen.getByRole('button', { name: 'Section B' }))
		expect(onChange).toHaveBeenCalledWith('b')
		// Controlled: stays on 'a' until the parent updates
		expect(screen.getByRole('button', { name: 'Section A' })).toHaveAttribute('aria-expanded', 'true')
	})

	it('disables items', () => {
		render(<Accordion items={items} />)
		expect(screen.getByRole('button', { name: 'Section C' })).toBeDisabled()
	})
})
