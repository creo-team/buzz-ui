import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import React from 'react'
import { Combobox, type ComboboxOption } from '../../src/forms/combobox'
import { describe, it, expect, vi } from 'vitest'

const FRUITS: ComboboxOption[] = [
	{ value: 'apple', label: 'Apple' },
	{ value: 'banana', label: 'Banana' },
	{ value: 'cherry', label: 'Cherry', disabled: true },
	{ value: 'date', label: 'Date' },
]

describe('Combobox', () => {
	it('renders a labelled combobox input, closed by default', () => {
		render(<Combobox options={FRUITS} label="Fruit" />)
		const input = screen.getByRole('combobox', { name: 'Fruit' })
		expect(input).toHaveAttribute('aria-expanded', 'false')
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
	})

	it('opens and lists every option on focus', async () => {
		render(<Combobox options={FRUITS} label="Fruit" />)
		fireEvent.focus(screen.getByRole('combobox'))
		await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument())
		expect(screen.getAllByRole('option')).toHaveLength(4)
		expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true')
	})

	it('filters options as the user types', async () => {
		render(<Combobox options={FRUITS} label="Fruit" />)
		const input = screen.getByRole('combobox')
		fireEvent.focus(input)
		await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument())

		fireEvent.change(input, { target: { value: 'an' } })
		await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(1))
		expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument()
	})

	it('shows the empty message when nothing matches', async () => {
		render(<Combobox options={FRUITS} label="Fruit" emptyMessage="Nothing here" />)
		const input = screen.getByRole('combobox')
		fireEvent.focus(input)
		fireEvent.change(input, { target: { value: 'zzz' } })
		await waitFor(() => expect(within(screen.getByRole('listbox')).getByText('Nothing here')).toBeInTheDocument())
		expect(screen.queryByRole('option')).not.toBeInTheDocument()
	})

	it('selects an option on click, commits the value and closes', async () => {
		const onChange = vi.fn()
		render(<Combobox options={FRUITS} label="Fruit" onChange={onChange} />)
		const input = screen.getByRole('combobox') as HTMLInputElement
		fireEvent.focus(input)
		await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument())

		fireEvent.click(screen.getByRole('option', { name: 'Banana' }))
		expect(onChange).toHaveBeenCalledWith('banana')
		expect(input.value).toBe('Banana')
		await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
	})

	it('does not select a disabled option', async () => {
		const onChange = vi.fn()
		render(<Combobox options={FRUITS} label="Fruit" onChange={onChange} />)
		fireEvent.focus(screen.getByRole('combobox'))
		await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument())
		fireEvent.click(screen.getByRole('option', { name: 'Cherry' }))
		expect(onChange).not.toHaveBeenCalled()
		expect(screen.getByRole('listbox')).toBeInTheDocument()
	})

	it('navigates with ArrowDown/ArrowUp and selects the active option with Enter', async () => {
		const onChange = vi.fn()
		render(<Combobox options={FRUITS} label="Fruit" onChange={onChange} />)
		const input = screen.getByRole('combobox')
		fireEvent.focus(input)
		await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument())

		// Apple -> Banana in one step (index 0 -> 1).
		fireEvent.keyDown(input, { key: 'ArrowDown' })
		expect(input).toHaveAttribute('aria-activedescendant', expect.stringContaining('banana'))

		// Banana -> Date: Cherry is disabled, so a second step skips over it
		// entirely rather than landing on an option Enter can't select.
		fireEvent.keyDown(input, { key: 'ArrowDown' })
		expect(input).toHaveAttribute('aria-activedescendant', expect.stringContaining('date'))

		fireEvent.keyDown(input, { key: 'Enter' })
		expect(onChange).toHaveBeenCalledWith('date')
	})

	it('closes on Escape and reverts the typed text without committing', async () => {
		render(<Combobox options={FRUITS} label="Fruit" defaultValue="apple" />)
		const input = screen.getByRole('combobox') as HTMLInputElement
		expect(input.value).toBe('Apple')

		fireEvent.focus(input)
		await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument())
		fireEvent.change(input, { target: { value: 'xyz' } })
		expect(input.value).toBe('xyz')

		fireEvent.keyDown(document, { key: 'Escape' })
		await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
		expect(input.value).toBe('Apple')
	})

	it('closes on outside press and reverts uncommitted text', async () => {
		render(<Combobox options={FRUITS} label="Fruit" />)
		const input = screen.getByRole('combobox') as HTMLInputElement
		fireEvent.focus(input)
		fireEvent.change(input, { target: { value: 'ban' } })
		await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument())

		fireEvent.mouseDown(document.body)
		await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
		expect(input.value).toBe('')
	})

	it('shows a clear button once a value is selected and clears on click', async () => {
		render(<Combobox options={FRUITS} label="Fruit" defaultValue="apple" />)
		expect(screen.getByLabelText('Clear selection')).toBeInTheDocument()

		fireEvent.click(screen.getByLabelText('Clear selection'))
		expect((screen.getByRole('combobox') as HTMLInputElement).value).toBe('')
		expect(screen.queryByLabelText('Clear selection')).not.toBeInTheDocument()
	})

	it('hides the clear button when clearable is false', () => {
		render(<Combobox options={FRUITS} label="Fruit" defaultValue="apple" clearable={false} />)
		expect(screen.queryByLabelText('Clear selection')).not.toBeInTheDocument()
	})

	it('is fully controlled via value/onChange', async () => {
		function Controlled() {
			const [value, setValue] = React.useState<string | null>('apple')
			return <Combobox options={FRUITS} label="Fruit" value={value} onChange={setValue} />
		}
		render(<Controlled />)
		const input = screen.getByRole('combobox') as HTMLInputElement
		expect(input.value).toBe('Apple')

		fireEvent.focus(input)
		await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument())
		fireEvent.click(screen.getByRole('option', { name: 'Date' }))
		await waitFor(() => expect(input.value).toBe('Date'))
	})

	it('does not open when disabled', () => {
		render(<Combobox options={FRUITS} label="Fruit" disabled />)
		fireEvent.focus(screen.getByRole('combobox'))
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
	})

	it('renders a hidden input for form submission when name is set', () => {
		const { container } = render(<Combobox options={FRUITS} label="Fruit" name="fruit" defaultValue="banana" />)
		const hidden = container.querySelector('input[type="hidden"][name="fruit"]') as HTMLInputElement
		expect(hidden).not.toBeNull()
		expect(hidden.value).toBe('banana')
	})

	it('honors a custom filter function', async () => {
		const startsWith = (option: ComboboxOption, query: string) => option.label.toLowerCase().startsWith(query.toLowerCase())
		render(<Combobox options={FRUITS} label="Fruit" filter={startsWith} />)
		const input = screen.getByRole('combobox')
		fireEvent.focus(input)
		// "an" matches Banana via substring but not via startsWith
		fireEvent.change(input, { target: { value: 'an' } })
		await waitFor(() => expect(within(screen.getByRole('listbox')).getByText('No results found.')).toBeInTheDocument())
	})
})
