import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { Slider } from '../../src/forms/slider'
import { describe, it, expect, vi } from 'vitest'

describe('Slider', () => {
	it('renders a native range input with label wiring', () => {
		render(<Slider label="Volume" min={0} max={100} defaultValue={30} />)
		const input = screen.getByRole('slider', { name: 'Volume' })
		expect(input).toHaveValue('30')
		expect(input).toHaveAttribute('min', '0')
		expect(input).toHaveAttribute('max', '100')
	})

	it('shows the formatted value beside the label', () => {
		render(<Slider label="Volume" defaultValue={30} formatValue={v => `${v}%`} />)
		expect(screen.getByText('30%')).toBeInTheDocument()
		expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '30%')
	})

	it('works uncontrolled and reports changes', () => {
		const onChange = vi.fn()
		render(<Slider label="Volume" defaultValue={30} onChange={onChange} />)
		const input = screen.getByRole('slider')
		fireEvent.change(input, { target: { value: '55' } })
		expect(onChange).toHaveBeenCalledWith(55)
		expect(input).toHaveValue('55')
		expect(screen.getByText('55')).toBeInTheDocument()
	})

	it('follows the controlled value exactly', () => {
		const onChange = vi.fn()
		const { rerender } = render(<Slider value={20} onChange={onChange} />)
		const input = screen.getByRole('slider')
		fireEvent.change(input, { target: { value: '80' } })
		expect(onChange).toHaveBeenCalledWith(80)
		// Still 20 until the parent updates the prop
		expect(input).toHaveValue('20')
		rerender(<Slider value={80} onChange={onChange} />)
		expect(input).toHaveValue('80')
	})

	it('fires onChangeEnd once per gesture, not on pointerup + blur', () => {
		const onChangeEnd = vi.fn()
		render(<Slider defaultValue={50} onChangeEnd={onChangeEnd} />)
		const input = screen.getByRole('slider')
		fireEvent.change(input, { target: { value: '51' } })
		fireEvent.keyUp(input, { key: 'ArrowRight' })
		fireEvent.blur(input)
		expect(onChangeEnd).toHaveBeenCalledTimes(1)
		expect(onChangeEnd).toHaveBeenCalledWith(51)
	})

	it('does not fire onChangeEnd without a change', () => {
		const onChangeEnd = vi.fn()
		render(<Slider defaultValue={50} onChangeEnd={onChangeEnd} />)
		fireEvent.blur(screen.getByRole('slider'))
		expect(onChangeEnd).not.toHaveBeenCalled()
	})

	it('clamps out-of-range values', () => {
		render(<Slider value={150} min={0} max={100} onChange={() => {}} />)
		expect(screen.getByRole('slider')).toHaveValue('100')
	})

	it('renders marks with active state', () => {
		render(
			<Slider
				defaultValue={50}
				marks={[
					{ value: 0, label: 'Min' },
					{ value: 50, label: 'Mid' },
					{ value: 100, label: 'Max' },
				]}
			/>
		)
		expect(screen.getByText('Min')).toBeInTheDocument()
		expect(screen.getByText('Mid')).toBeInTheDocument()
		expect(screen.getByText('Max')).toBeInTheDocument()
	})

	it('participates in forms via name', () => {
		render(
			<form data-testid="form">
				<Slider name="volume" defaultValue={42} />
			</form>
		)
		const form = screen.getByTestId('form') as HTMLFormElement
		expect(new FormData(form).get('volume')).toBe('42')
	})
})
