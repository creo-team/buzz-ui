import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { Dropdown } from '../../src/overlays/dropdown'
import { describe, it, expect, vi } from 'vitest'

const makeItems = (onSelect: (key: string) => void) => [
	{ key: 'edit', label: 'Edit', onClick: () => onSelect('edit') },
	{ key: 'duplicate', label: 'Duplicate', onClick: () => onSelect('duplicate') },
	'separator' as const,
	{ key: 'delete', label: 'Delete', variant: 'destructive' as const, onClick: () => onSelect('delete') },
]

function renderMenu(onSelect = vi.fn()) {
	render(
		<Dropdown
			items={makeItems(onSelect)}
			trigger={<button type="button">Actions</button>}
		/>
	)
	return onSelect
}

describe('Dropdown menu', () => {
	it('exposes menu semantics', async () => {
		renderMenu()
		const trigger = screen.getByText('Actions')
		expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
		expect(trigger).toHaveAttribute('aria-expanded', 'false')

		fireEvent.click(trigger)
		await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument())
		expect(trigger).toHaveAttribute('aria-expanded', 'true')
		expect(screen.getAllByRole('menuitem')).toHaveLength(3)
		expect(screen.getByRole('separator')).toBeInTheDocument()
	})

	it('opens with ArrowDown and focuses the first item', async () => {
		renderMenu()
		fireEvent.keyDown(screen.getByText('Actions'), { key: 'ArrowDown' })
		await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument())
		await waitFor(() => expect(document.activeElement?.textContent).toBe('Edit'))
	})

	it('navigates with arrows, Home and End', async () => {
		renderMenu()
		fireEvent.keyDown(screen.getByText('Actions'), { key: 'ArrowDown' })
		await waitFor(() => expect(document.activeElement?.textContent).toBe('Edit'))

		fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' })
		expect(document.activeElement?.textContent).toBe('Duplicate')

		fireEvent.keyDown(screen.getByRole('menu'), { key: 'End' })
		expect(document.activeElement?.textContent).toBe('Delete')

		fireEvent.keyDown(screen.getByRole('menu'), { key: 'Home' })
		expect(document.activeElement?.textContent).toBe('Edit')

		// Wraps upward from the first item
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowUp' })
		expect(document.activeElement?.textContent).toBe('Delete')
	})

	it('activates an item and closes', async () => {
		const onSelect = renderMenu()
		fireEvent.click(screen.getByText('Actions'))
		await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument())
		fireEvent.click(screen.getByText('Duplicate'))
		expect(onSelect).toHaveBeenCalledWith('duplicate')
		await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
	})

	it('closes on Escape and returns focus to the trigger', async () => {
		renderMenu()
		const trigger = screen.getByText('Actions')
		fireEvent.click(trigger)
		await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument())
		fireEvent.keyDown(document, { key: 'Escape' })
		await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
		await waitFor(() => expect(document.activeElement).toBe(trigger))
	})

	it('supports typeahead', async () => {
		renderMenu()
		fireEvent.keyDown(screen.getByText('Actions'), { key: 'ArrowDown' })
		await waitFor(() => expect(document.activeElement?.textContent).toBe('Edit'))
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'd' })
		expect(document.activeElement?.textContent).toBe('Duplicate')
	})
})
