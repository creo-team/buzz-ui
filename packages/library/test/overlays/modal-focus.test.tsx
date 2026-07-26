import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Modal } from '../../src/overlays/modal'
import { describe, it, expect, vi } from 'vitest'

describe('Modal focus management', () => {
	it('labels the dialog with its header', async () => {
		render(
			<Modal isOpen onClose={() => {}} header="Settings">
				<p>Body</p>
			</Modal>
		)
		await waitFor(() => {
			expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument()
		})
		expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
	})

	it('moves focus into the dialog and restores it on close', async () => {
		function Harness() {
			const [open, setOpen] = React.useState(false)
			return (
				<>
					<button type="button" onClick={() => setOpen(true)}>
						Open
					</button>
					<Modal open={open} onClose={() => setOpen(false)} header="Dialog">
						<button type="button">Inside</button>
					</Modal>
				</>
			)
		}
		const user = userEvent.setup()
		render(<Harness />)
		const trigger = screen.getByText('Open')
		await user.click(trigger)

		await waitFor(() => {
			expect(document.activeElement?.textContent).toBe('Inside')
		})

		await user.keyboard('{Escape}')
		await waitFor(() => {
			expect(document.activeElement).toBe(trigger)
		})
	})

	it('closes on backdrop click but not on panel click', async () => {
		const onClose = vi.fn()
		render(
			<Modal isOpen onClose={onClose} header="Dialog">
				<p>Body</p>
			</Modal>
		)
		await waitFor(() => expect(screen.getByTestId('modal-panel')).toBeInTheDocument())
		const user = userEvent.setup()
		await user.click(screen.getByText('Body'))
		expect(onClose).not.toHaveBeenCalled()
		await user.click(screen.getByTestId('modal-backdrop'))
		expect(onClose).toHaveBeenCalledTimes(1)
	})

	it('ignores Escape when dismissible is false', async () => {
		const onClose = vi.fn()
		render(
			<Modal isOpen onClose={onClose} dismissible={false}>
				<p>Body</p>
			</Modal>
		)
		await waitFor(() => expect(screen.getByTestId('modal-panel')).toBeInTheDocument())
		const user = userEvent.setup()
		await user.keyboard('{Escape}')
		expect(onClose).not.toHaveBeenCalled()
	})
})
