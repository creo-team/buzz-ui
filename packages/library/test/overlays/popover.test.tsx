import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '../../src/overlays/popover'
import { describe, it, expect } from 'vitest'

function Example() {
	return (
		<Popover>
			<PopoverTrigger>Open popover</PopoverTrigger>
			<PopoverContent>
				<p>Popover body</p>
				<button type="button">Inside action</button>
			</PopoverContent>
		</Popover>
	)
}

describe('Popover', () => {
	it('opens from the trigger with dialog semantics and aria wiring', async () => {
		render(<Example />)
		const trigger = screen.getByRole('button', { name: 'Open popover' })
		expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
		expect(trigger).toHaveAttribute('aria-expanded', 'false')

		fireEvent.click(trigger)
		await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())
		expect(trigger).toHaveAttribute('aria-expanded', 'true')
		expect(trigger.getAttribute('aria-controls')).toBe(screen.getByRole('dialog').id)
	})

	it('closes on Escape and restores trigger focus', async () => {
		render(<Example />)
		const trigger = screen.getByRole('button', { name: 'Open popover' })
		fireEvent.click(trigger)
		await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())

		fireEvent.keyDown(document, { key: 'Escape' })
		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
		await waitFor(() => expect(document.activeElement).toBe(trigger))
	})

	it('closes on outside press but not on inside clicks', async () => {
		render(<Example />)
		fireEvent.click(screen.getByRole('button', { name: 'Open popover' }))
		await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())

		fireEvent.mouseDown(screen.getByText('Popover body'))
		expect(screen.getByRole('dialog')).toBeInTheDocument()

		fireEvent.mouseDown(document.body)
		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
	})

	it('supports asChild triggers', async () => {
		render(
			<Popover>
				<PopoverTrigger asChild>
					<a href="#config">Settings link</a>
				</PopoverTrigger>
				<PopoverContent>Panel</PopoverContent>
			</Popover>
		)
		const link = screen.getByRole('link', { name: 'Settings link' })
		fireEvent.click(link)
		await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())
	})
})
