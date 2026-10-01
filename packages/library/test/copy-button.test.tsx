import { fireEvent, render, screen, waitFor } from '@testing-library/react'
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

	it('passes the copied text to onCopied and says Copied', async () => {
		vi.mocked(navigator.clipboard.writeText).mockResolvedValueOnce(undefined)
		const onCopied = vi.fn()
		render(<CopyButton value="hello" onCopied={onCopied} />)
		const button = screen.getByRole('button', { name: 'Copy content' })
		fireEvent.click(button)
		await waitFor(() => expect(onCopied).toHaveBeenCalledWith('hello'))
		expect(button).toHaveAttribute('data-copy-status', 'copied')
		await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent('Copied'))
	})

	it('shows a failure with the value selected and reports it', async () => {
		const failure = new DOMException('Write permission denied.', 'NotAllowedError')
		vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(failure)
		const onCopyError = vi.fn()
		render(<CopyButton value="https://example.com/share" onCopyError={onCopyError} />)
		const button = screen.getByRole('button', { name: 'Copy content' })
		fireEvent.click(button)
		await waitFor(() => expect(button).toHaveAttribute('data-copy-status', 'failed'))
		expect(onCopyError).toHaveBeenCalledWith(failure)
		const tooltip = await screen.findByRole('tooltip')
		expect(tooltip).toHaveAttribute('data-state', 'open')
		expect(tooltip.querySelector('.bz-copy-fallback__text')).toHaveTextContent('https://example.com/share')
		await waitFor(() => expect(window.getSelection()?.toString()).toBe('https://example.com/share'))
	})

	it('names the action in a shared tooltip on hover, never a native title', async () => {
		render(<CopyButton value="hello" />)
		const button = screen.getByRole('button', { name: 'Copy content' })
		expect(button).not.toHaveAttribute('title')
		fireEvent.pointerEnter(button, { pointerType: 'mouse' })
		await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent('Copy content'))
	})
})
