import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { TextInput, Input } from '../../src/forms/input'
import { Textarea } from '../../src/forms/textarea'
import { Select } from '../../src/forms/select'
import { RadioGroup } from '../../src/forms/radio-group'
import { Menu } from '../../src/navigation/menu'
import { describe, it, expect, vi } from 'vitest'

describe('TextInput', () => {
	it('associates label, help text and native props', () => {
		render(<TextInput label="Email" helpText="We never share it" name="email" type="email" />)
		const input = screen.getByRole('textbox', { name: 'Email' })
		expect(input).toHaveAttribute('type', 'email')
		expect(input).toHaveAccessibleDescription('We never share it')
	})

	it('marks invalid state and swaps help for the error', () => {
		render(<TextInput label="Email" helpText="Help" error="Required" />)
		const input = screen.getByRole('textbox', { name: 'Email' })
		expect(input).toHaveAttribute('aria-invalid', 'true')
		expect(input).toHaveAccessibleDescription('Required')
		expect(screen.queryByText('Help')).not.toBeInTheDocument()
		expect(screen.getByRole('alert')).toHaveTextContent('Required')
	})

	it('renders adornments with styling hooks', () => {
		render(<TextInput label="Price" startAdornment="$" endAdornment="USD" />)
		expect(screen.getByText('$')).toBeInTheDocument()
		expect(screen.getByText('USD')).toBeInTheDocument()
	})

	it('exports Input as an alias', () => {
		expect(Input).toBe(TextInput)
	})
})

describe('Textarea', () => {
	it('wires label and error', () => {
		render(<Textarea label="Bio" error="Too long" />)
		const area = screen.getByRole('textbox', { name: 'Bio' })
		expect(area).toHaveAttribute('aria-invalid', 'true')
		expect(area).toHaveAccessibleDescription('Too long')
	})

	it('sets the auto-resize styling hook', () => {
		render(<Textarea label="Notes" autoResize />)
		expect(screen.getByRole('textbox')).toHaveAttribute('data-auto-resize')
	})
})

describe('Select', () => {
	it('renders a labelled native select with options', () => {
		render(
			<Select label="Country" defaultValue="se">
				<option value="us">United States</option>
				<option value="se">Sweden</option>
			</Select>
		)
		const select = screen.getByRole('combobox', { name: 'Country' })
		expect(select).toHaveValue('se')
		fireEvent.change(select, { target: { value: 'us' } })
		expect(select).toHaveValue('us')
	})
})

describe('RadioGroup', () => {
	const options = [
		{ value: 'a', label: 'Option A', description: 'First choice' },
		{ value: 'b', label: 'Option B' },
	]

	it('renders fieldset semantics with associated descriptions', () => {
		render(<RadioGroup label="Choose" name="choice" options={options} defaultValue="a" />)
		expect(screen.getByRole('group', { name: 'Choose' })).toBeInTheDocument()
		const optionA = screen.getByRole('radio', { name: 'Option A' })
		expect(optionA).toBeChecked()
		expect(optionA).toHaveAccessibleDescription('First choice')
	})

	it('reports controlled changes', () => {
		const onChange = vi.fn()
		render(<RadioGroup label="Choose" name="choice" options={options} value="a" onChange={onChange} />)
		fireEvent.click(screen.getByRole('radio', { name: 'Option B' }))
		expect(onChange).toHaveBeenCalledWith('b')
	})
})

describe('Menu', () => {
	it('opens a keyboard-navigable menu and selects items', async () => {
		const onSelect = vi.fn()
		render(
			<Menu
				button="Options"
				items={[
					{ key: 'one', label: 'First', onSelect },
					{ key: 'two', label: 'Second' },
				]}
			/>
		)
		fireEvent.click(screen.getByText('Options'))
		await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument())
		expect(screen.getAllByRole('menuitem')).toHaveLength(2)
		fireEvent.click(screen.getByText('First'))
		expect(onSelect).toHaveBeenCalled()
		await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
	})
})
