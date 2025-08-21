import { fireEvent, render, screen, waitFor } from './setup'
import React from 'react'
import { CopyButton } from '../src/utils/copy'

Object.assign(navigator, {
	clipboard: {
		writeText: vi.fn().mockResolvedValue(undefined),
	},
})

describe('CopyButton', () => {
	it('copies to clipboard', async () => {
		render(<CopyButton value="hello" />)
		fireEvent.click(screen.getByRole('button'))
		await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello'))
	})
})


