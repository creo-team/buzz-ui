import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { Switch } from '../../src/inputs/switch'
import { describe, it, expect, vi } from 'vitest'

describe('Switch', () => {
	it('renders the WAI-ARIA switch pattern with a label', () => {
		render(<Switch label="Notifications" defaultChecked />)
		const control = screen.getByRole('switch', { name: 'Notifications' })
		expect(control).toHaveAttribute('aria-checked', 'true')
	})

	it('toggles uncontrolled', () => {
		const onChange = vi.fn()
		render(<Switch label="Notifications" onChange={onChange} />)
		const control = screen.getByRole('switch')
		fireEvent.click(control)
		expect(onChange).toHaveBeenCalledWith(true)
		expect(control).toHaveAttribute('aria-checked', 'true')
		fireEvent.click(control)
		expect(control).toHaveAttribute('aria-checked', 'false')
	})

	it('follows controlled checked exactly', () => {
		const onChange = vi.fn()
		render(<Switch checked={false} onChange={onChange} />)
		const control = screen.getByRole('switch')
		fireEvent.click(control)
		expect(onChange).toHaveBeenCalledWith(true)
		expect(control).toHaveAttribute('aria-checked', 'false')
	})

	it('submits a hidden input value when named and checked', () => {
		render(
			<form data-testid="form">
				<Switch name="alerts" value="yes" defaultChecked label="Alerts" />
			</form>
		)
		const form = screen.getByTestId('form') as HTMLFormElement
		expect(new FormData(form).get('alerts')).toBe('yes')
	})

	it('omits the form value when unchecked', () => {
		render(
			<form data-testid="form">
				<Switch name="alerts" label="Alerts" />
			</form>
		)
		const form = screen.getByTestId('form') as HTMLFormElement
		expect(new FormData(form).get('alerts')).toBeNull()
	})

	it('links the description via aria-describedby', () => {
		render(<Switch label="Alerts" description="Email me on activity" />)
		expect(screen.getByRole('switch')).toHaveAccessibleDescription('Email me on activity')
	})
})
