import { render, screen, fireEvent, waitFor, act, within } from '@testing-library/react'
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
		await waitFor(() =>
			expect(within(screen.getByRole('region', { name: 'Notifications' })).getByText('Saved successfully')).toBeInTheDocument()
		)
	})

	it('renders variant icon and description', async () => {
		render(<Toaster />)
		act(() => {
			toast.success('Profile updated', { description: 'Changes are live.' })
		})
		await waitFor(() =>
			expect(within(screen.getByRole('region', { name: 'Notifications' })).getByText('Profile updated')).toBeInTheDocument()
		)
		expect(within(screen.getByRole('region', { name: 'Notifications' })).getByText('Changes are live.')).toBeInTheDocument()
	})

	it('dismisses by id', async () => {
		render(<Toaster />)
		let id = ''
		act(() => {
			id = toast('Going away', { duration: Infinity })
		})
		await waitFor(() =>
			expect(within(screen.getByRole('region', { name: 'Notifications' })).getByText('Going away')).toBeInTheDocument()
		)
		act(() => {
			toast.dismiss(id)
		})
		await waitFor(() => expect(screen.queryByRole('region', { name: 'Notifications' })).not.toBeInTheDocument())
	})

	it('shows a close button for persistent toasts and dismisses on click', async () => {
		render(<Toaster />)
		act(() => {
			toast('Sticky note', { duration: Infinity })
		})
		await waitFor(() =>
			expect(within(screen.getByRole('region', { name: 'Notifications' })).getByText('Sticky note')).toBeInTheDocument()
		)
		fireEvent.click(screen.getByLabelText('Dismiss notification'))
		await waitFor(() => expect(screen.queryByRole('region', { name: 'Notifications' })).not.toBeInTheDocument())
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
		await waitFor(() =>
			expect(within(screen.getByRole('region', { name: 'Notifications' })).getByText('Saving…')).toBeInTheDocument()
		)
		await act(async () => {
			resolvePromise('draft')
			await pending
		})
		await waitFor(() =>
			expect(within(screen.getByRole('region', { name: 'Notifications' })).getByText('Saved draft')).toBeInTheDocument()
		)
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
		await waitFor(() =>
			expect(within(screen.getByRole('region', { name: 'Notifications' })).getByText('From legacy push')).toBeInTheDocument()
		)
	})
})
