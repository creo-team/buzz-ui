import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { Checkbox } from '../../src/forms/checkbox'
import { describe, it, expect, vi } from 'vitest'

describe('Checkbox', () => {
	it('renders a labelled native checkbox', () => {
		render(<Checkbox label="Accept terms" />)
		const box = screen.getByRole('checkbox', { name: 'Accept terms' })
		expect(box).not.toBeChecked()
		fireEvent.click(box)
		expect(box).toBeChecked()
	})

	it('links description and error via aria-describedby', () => {
		render(<Checkbox label="Accept" description="You must accept to continue" error="Required" />)
		const box = screen.getByRole('checkbox')
		expect(box).toHaveAccessibleDescription('You must accept to continue Required')
		expect(box).toHaveAttribute('aria-invalid', 'true')
	})

	it('syncs the DOM indeterminate property through the client island', async () => {
		render(<Checkbox label="Select all" indeterminate />)
		const box = screen.getByRole('checkbox') as HTMLInputElement
		await waitFor(() => expect(box.indeterminate).toBe(true))
	})

	it('clears indeterminate when the prop flips', async () => {
		const { rerender } = render(<Checkbox label="Select all" indeterminate />)
		const box = screen.getByRole('checkbox') as HTMLInputElement
		await waitFor(() => expect(box.indeterminate).toBe(true))
		rerender(<Checkbox label="Select all" indeterminate={false} />)
		await waitFor(() => expect(box.indeterminate).toBe(false))
	})

	it('forwards native props (name, defaultChecked, onChange)', () => {
		const onChange = vi.fn()
		render(
			<form data-testid="form">
				<Checkbox label="Opt in" name="optin" defaultChecked onChange={onChange} />
			</form>
		)
		const form = screen.getByTestId('form') as HTMLFormElement
		expect(new FormData(form).get('optin')).toBe('on')
		fireEvent.click(screen.getByRole('checkbox'))
		expect(onChange).toHaveBeenCalled()
	})
})
