import { fireEvent, render, screen, waitFor } from './setup'
import React from 'react'
import { Tooltip } from '../src/overlays/tooltip'

describe('Tooltip', () => {
	it('shows content on hover', async () => {
		render(
			<Tooltip content="Hello" delayMs={0}>
				<button>Trigger</button>
			</Tooltip>
		)
		const trigger = screen.getByText('Trigger')
		fireEvent.mouseEnter(trigger)
		await waitFor(() => expect(screen.getByText('Hello')).toBeInTheDocument())
	})
})

