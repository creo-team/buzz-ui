import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import React from 'react'
import { toast, Toaster, useToast } from '../../src/overlays/toast'
import { describe, it, expect, afterEach } from 'vitest'

afterEach(() => {
	act(() => {
		toast.dismiss()
	})
})

describe('toast', () => {
	it('renders a toast through the Toaster', async () => {
		render(<Toaster />)
		act(() => {
			toast('Saved successfully')
		})
		await waitFor(() => expect(screen.getByText('Saved successfully')).toBeInTheDocument())
	})

	it('renders variant icon and description', async () => {
		render(<Toaster />)
		act(() => {
			toast.success('Profile updated', { description: 'Changes are live.' })
		})
		await waitFor(() => expect(screen.getByText('Profile updated')).toBeInTheDocument())
		expect(screen.getByText('Changes are live.')).toBeInTheDocument()
	})

	it('dismisses by id', async () => {
		render(<Toaster />)
		let id = ''
		act(() => {
			id = toast('Going away', { duration: Infinity })
		})
		await waitFor(() => expect(screen.getByText('Going away')).toBeInTheDocument())
		act(() => {
			toast.dismiss(id)
		})
		await waitFor(() => expect(screen.queryByText('Going away')).not.toBeInTheDocument())
	})

	it('shows a close button for persistent toasts and dismisses on click', async () => {
		render(<Toaster />)
		act(() => {
			toast('Sticky note', { duration: Infinity })
		})
		await waitFor(() => expect(screen.getByText('Sticky note')).toBeInTheDocument())
		fireEvent.click(screen.getByLabelText('Dismiss notification'))
		await waitFor(() => expect(screen.queryByText('Sticky note')).not.toBeInTheDocument())
	})

	it('tracks promises through loading → success', async () => {
		render(<Toaster />)
		let resolvePromise: (v: string) => void = () => {}
		const pending = new Promise<string>(resolve => {
			resolvePromise = resolve
		})
		act(() => {
			toast.promise(pending, {
				loading: 'Saving…',
				success: value => `Saved ${value}`,
				error: 'Failed',
			})
		})
		await waitFor(() => expect(screen.getByText('Saving…')).toBeInTheDocument())
		await act(async () => {
			resolvePromise('draft')
			await pending
		})
		await waitFor(() => expect(screen.getByText('Saved draft')).toBeInTheDocument())
	})

	it('supports the legacy useToast push API', async () => {
		function Legacy() {
			const { push } = useToast()
			return (
				<button type="button" onClick={() => push('From legacy push')}>
					push
				</button>
			)
		}
		render(
			<>
				<Legacy />
				<Toaster />
			</>
		)
		fireEvent.click(screen.getByText('push'))
		await waitFor(() => expect(screen.getByText('From legacy push')).toBeInTheDocument())
	})
})
