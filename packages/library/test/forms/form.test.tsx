import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import React from 'react'
import { Form, useFormField } from '../../src/forms/form'
import { TextInput } from '../../src/forms/input'
import { Checkbox } from '../../src/forms/checkbox'
import { Button } from '../../src/primitives/button'
import { describe, it, expect, vi } from 'vitest'

function SignUp({ onSubmit, onValidityChange }: { onSubmit?: any; onValidityChange?: any }) {
	return (
		<Form
			onSubmit={onSubmit}
			onValidityChange={onValidityChange}
			validate={{
				confirm: (value, values) => (value !== values.password ? 'Passwords do not match' : undefined),
			}}
		>
			<TextInput name="email" label="Email" type="email" required />
			<TextInput name="password" label="Password" type="password" required />
			<TextInput name="confirm" label="Confirm password" type="password" />
			<Button type="submit">Create account</Button>
		</Form>
	)
}

describe('Form — pre-submit inline validation', () => {
	it('submits values when every field is valid', () => {
		const onSubmit = vi.fn()
		render(<SignUp onSubmit={onSubmit} />)
		fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'a@b.co' } })
		fireEvent.change(screen.getByLabelText(/^Password/), { target: { value: 'hunter22' } })
		fireEvent.change(screen.getByLabelText(/Confirm/), { target: { value: 'hunter22' } })
		fireEvent.click(screen.getByRole('button', { name: 'Create account' }))

		expect(onSubmit).toHaveBeenCalledTimes(1)
		expect(onSubmit.mock.calls[0][0]).toEqual({
			email: 'a@b.co',
			password: 'hunter22',
			confirm: 'hunter22',
		})
	})

	it('blocks submission and renders errors inline at the fields', () => {
		const onSubmit = vi.fn()
		render(<SignUp onSubmit={onSubmit} />)
		fireEvent.click(screen.getByRole('button', { name: 'Create account' }))

		expect(onSubmit).not.toHaveBeenCalled()
		// Both required fields report inline, each inside its own field chrome.
		const alerts = screen.getAllByRole('alert')
		expect(alerts.length).toBeGreaterThanOrEqual(2)
		const email = screen.getByLabelText(/Email/)
		expect(email).toHaveAttribute('aria-invalid', 'true')
		expect(email).toHaveAttribute('data-tone', 'error')
		expect(email.getAttribute('aria-describedby')).toContain('-form-error')
	})

	it('focuses the first invalid control in DOM order', () => {
		render(<SignUp />)
		fireEvent.click(screen.getByRole('button', { name: 'Create account' }))
		expect(screen.getByLabelText(/Email/)).toHaveFocus()
	})

	it('never punishes typing before the first submit attempt', () => {
		render(<SignUp />)
		const email = screen.getByLabelText(/Email/)
		fireEvent.change(email, { target: { value: 'not-an-email' } })
		fireEvent.change(email, { target: { value: '' } })
		expect(screen.queryByRole('alert')).not.toBeInTheDocument()
	})

	it('re-validates on change after a failed attempt, clearing fixed fields', async () => {
		render(<SignUp />)
		fireEvent.click(screen.getByRole('button', { name: 'Create account' }))
		const email = screen.getByLabelText(/Email/)
		expect(email).toHaveAttribute('aria-invalid', 'true')

		fireEvent.change(email, { target: { value: 'a@b.co' } })
		await waitFor(() => expect(email).not.toHaveAttribute('aria-invalid'))
		// The password error is still there — only the fixed field cleared.
		expect(screen.getByLabelText(/^Password/)).toHaveAttribute('aria-invalid', 'true')
	})

	it('runs custom cross-field validators and keeps them honest on either side', async () => {
		render(<SignUp />)
		fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'a@b.co' } })
		fireEvent.change(screen.getByLabelText(/^Password/), { target: { value: 'hunter22' } })
		fireEvent.change(screen.getByLabelText(/Confirm/), { target: { value: 'different' } })
		fireEvent.click(screen.getByRole('button', { name: 'Create account' }))

		expect(screen.getByText('Passwords do not match')).toBeInTheDocument()

		// Fixing the *password* side must clear the error on confirm.
		fireEvent.change(screen.getByLabelText(/^Password/), { target: { value: 'different' } })
		await waitFor(() => expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument())
	})

	it('reports the error map through onValidityChange', () => {
		const onValidityChange = vi.fn()
		render(<SignUp onValidityChange={onValidityChange} />)
		fireEvent.click(screen.getByRole('button', { name: 'Create account' }))
		expect(onValidityChange).toHaveBeenCalled()
		const errors = onValidityChange.mock.calls.at(-1)![0]
		expect(Object.keys(errors)).toEqual(expect.arrayContaining(['email', 'password']))
	})

	it('surfaces errors for checkboxes in their own text area', () => {
		render(
			<Form onSubmit={vi.fn()}>
				<Checkbox name="tos" label="I accept the terms" required />
				<Button type="submit">Continue</Button>
			</Form>
		)
		fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
		expect(screen.getByRole('alert')).toBeInTheDocument()
		expect(screen.getByLabelText(/I accept the terms/)).toHaveAttribute('aria-invalid', 'true')
	})

	it('a prop-driven error wins over the form slot (no double message)', () => {
		render(
			<Form>
				<TextInput name="email" label="Email" required error="Server says no" />
				<Button type="submit">Send</Button>
			</Form>
		)
		fireEvent.click(screen.getByRole('button', { name: 'Send' }))
		const alerts = screen.getAllByRole('alert')
		expect(alerts).toHaveLength(1)
		expect(alerts[0]).toHaveTextContent('Server says no')
	})

	it('multi-value controls submit as arrays', () => {
		const onSubmit = vi.fn()
		render(
			<Form onSubmit={onSubmit}>
				<Checkbox name="topics" value="a11y" label="Accessibility" defaultChecked />
				<Checkbox name="topics" value="perf" label="Performance" defaultChecked />
				<Button type="submit">Save</Button>
			</Form>
		)
		fireEvent.click(screen.getByRole('button', { name: 'Save' }))
		expect(onSubmit.mock.calls[0][0]).toEqual({ topics: ['a11y', 'perf'] })
	})

	it('a native reset clears errors and re-arms reward-early', async () => {
		render(
			<Form>
				<TextInput name="email" label="Email" required />
				<Button type="submit">Send</Button>
				<Button type="reset">Reset</Button>
			</Form>
		)
		fireEvent.click(screen.getByRole('button', { name: 'Send' }))
		expect(screen.getByLabelText(/Email/)).toHaveAttribute('aria-invalid', 'true')

		fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
		await waitFor(() => expect(screen.getByLabelText(/Email/)).not.toHaveAttribute('aria-invalid'))
		// Back to pristine: typing must not re-trigger validation.
		fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'x' } })
		fireEvent.change(screen.getByLabelText(/Email/), { target: { value: '' } })
		expect(screen.queryByRole('alert')).not.toBeInTheDocument()
	})

	it('useFormField outside any Form reports no error and does not throw', () => {
		function Probe() {
			const { error } = useFormField('anything')
			return <span>{error ?? 'clean'}</span>
		}
		render(<Probe />)
		expect(screen.getByText('clean')).toBeInTheDocument()
	})
})
