import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { Modal } from '../src/overlays/modal'
import { Tooltip } from '../src/overlays/tooltip'

describe('Tooltip', () => {
	it('shows content on hover', async () => {
		render(
			<Tooltip content="Hello" delayMs={0}>
				<button>Trigger</button>
			</Tooltip>
		)
		const trigger = screen.getByText('Trigger')
		fireEvent.pointerEnter(trigger, { pointerType: 'mouse' })
		await waitFor(() => expect(screen.getByText('Hello')).toBeInTheDocument())
	})

	it('closes only itself on Escape inside an open Modal; a second Escape closes the Modal', async () => {
		function Harness() {
			const [open, setOpen] = React.useState(true)
			return (
				<Modal open={open} onOpenChange={setOpen} header="Details">
					<Tooltip content="Full time">
						<button type="button">Trigger</button>
					</Tooltip>
				</Modal>
			)
		}
		render(<Harness />)
		const trigger = screen.getByRole('button', { name: 'Trigger' })
		fireEvent.focus(trigger)
		await waitFor(() => expect(screen.getByRole('tooltip')).toHaveAttribute('data-state', 'open'))

		fireEvent.keyDown(trigger, { key: 'Escape' })
		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument())
		expect(screen.getByRole('dialog')).toBeInTheDocument()

		fireEvent.keyDown(trigger, { key: 'Escape' })
		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
	})

	it('opens on a tap, ignores compatibility mouse events, and closes on an outside tap', async () => {
		render(
			<>
				<Tooltip content="Tapped" delayMs={0}>
					<button type="button">Trigger</button>
				</Tooltip>
				<button type="button">Elsewhere</button>
			</>
		)
		const trigger = screen.getByRole('button', { name: 'Trigger' })

		fireEvent.mouseEnter(trigger)
		fireEvent.pointerEnter(trigger, { pointerType: 'touch' })
		await act(async () => {
			await new Promise(resolve => setTimeout(resolve, 10))
		})
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()

		fireEvent.pointerDown(trigger, { pointerType: 'touch' })
		fireEvent.focus(trigger)
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
		fireEvent.click(trigger)
		await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent('Tapped'))

		fireEvent.pointerDown(trigger, { pointerType: 'touch' })
		fireEvent.click(trigger)
		expect(screen.getByRole('tooltip')).toHaveAttribute('data-state', 'open')

		fireEvent.pointerDown(screen.getByRole('button', { name: 'Elsewhere' }), { pointerType: 'touch' })
		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument())
	})

	it('leaves the trigger’s aria-describedby untouched when describeTrigger is false', async () => {
		render(
			<>
				<Tooltip content="Bubble" describeTrigger={false}>
					<button type="button" aria-describedby="stable-description">
						Trigger
					</button>
				</Tooltip>
				<span id="stable-description">Stable</span>
			</>
		)
		const trigger = screen.getByRole('button', { name: 'Trigger' })
		fireEvent.focus(trigger)
		await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument())
		expect(trigger).toHaveAttribute('aria-describedby', 'stable-description')
	})

	it('wires its id into aria-describedby by default', async () => {
		render(
			<Tooltip content="Bubble">
				<button type="button">Trigger</button>
			</Tooltip>
		)
		const trigger = screen.getByRole('button', { name: 'Trigger' })
		fireEvent.focus(trigger)
		const tooltip = await screen.findByRole('tooltip')
		expect(trigger).toHaveAttribute('aria-describedby', tooltip.id)
	})

	it('requests changes through onOpenChange in controlled mode', async () => {
		const onOpenChange = vi.fn()
		render(
			<Tooltip content="Controlled" open={false} onOpenChange={onOpenChange} delayMs={0}>
				<button type="button">Trigger</button>
			</Tooltip>
		)
		const trigger = screen.getByRole('button', { name: 'Trigger' })
		fireEvent.pointerEnter(trigger, { pointerType: 'mouse' })
		await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(true))
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
		fireEvent.focus(trigger)
		expect(onOpenChange).toHaveBeenCalledTimes(2)
	})
})
