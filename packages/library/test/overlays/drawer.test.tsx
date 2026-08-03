import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Drawer } from '../../src/overlays/drawer'
import { Sheet } from '../../src/overlays/sheet'
import { describe, it, expect, vi } from 'vitest'

describe('Drawer', () => {
	it('renders a labelled dialog with title and description', async () => {
		render(
			<Drawer open onOpenChange={() => {}} title="Filters" description="Refine the results">
				<p>Body</p>
			</Drawer>
		)
		await waitFor(() => {
			const dialog = screen.getByRole('dialog', { name: 'Filters' })
			expect(dialog).toBeInTheDocument()
			expect(dialog).toHaveAttribute('aria-modal', 'true')
		})
		expect(screen.getByText('Refine the results')).toBeInTheDocument()
	})

	it('closes on Escape and via the close button', async () => {
		const onOpenChange = vi.fn()
		render(
			<Drawer open onOpenChange={onOpenChange} title="Filters">
				<p>Body</p>
			</Drawer>
		)
		await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())
		const user = userEvent.setup()
		await user.keyboard('{Escape}')
		expect(onOpenChange).toHaveBeenCalledWith(false)

		await user.click(screen.getByLabelText('Close drawer'))
		expect(onOpenChange).toHaveBeenCalledTimes(2)
	})

	it('applies side and size styling hooks', async () => {
		render(
			<Drawer open onOpenChange={() => {}} side="left" size="lg" title="Nav">
				<p>Body</p>
			</Drawer>
		)
		await waitFor(() => {
			const dialog = screen.getByRole('dialog')
			expect(dialog).toHaveAttribute('data-side', 'left')
			expect(dialog).toHaveAttribute('data-size', 'lg')
		})
	})

	it('does not render when closed', () => {
		render(
			<Drawer open={false} onOpenChange={() => {}} title="Filters">
				<p>Body</p>
			</Drawer>
		)
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
	})
})

describe('Sheet (deprecated alias)', () => {
	it('renders through Drawer and closes via onClose', async () => {
		const onClose = vi.fn()
		render(
			<Sheet open onClose={onClose} header="Legacy sheet">
				<p>Sheet body</p>
			</Sheet>
		)
		await waitFor(() => expect(screen.getByRole('dialog', { name: 'Legacy sheet' })).toBeInTheDocument())
		const user = userEvent.setup()
		await user.keyboard('{Escape}')
		expect(onClose).toHaveBeenCalled()
	})
})
