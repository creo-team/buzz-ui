import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { Tabs, TabPanel } from '../src/navigation/tabs'
import { describe, it, expect, vi } from 'vitest'

const items = [
	{ key: 'one', label: 'One' },
	{ key: 'two', label: 'Two' },
	{ key: 'three', label: 'Three', disabled: true },
	{ key: 'four', label: 'Four' },
]

describe('Tabs keyboard interaction', () => {
	it('uses a roving tabindex', () => {
		render(<Tabs items={items} value="two" onChange={() => {}} />)
		expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute('tabindex', '-1')
		expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('tabindex', '0')
	})

	it('moves selection with arrow keys, skipping disabled tabs', () => {
		const onChange = vi.fn()
		render(<Tabs items={items} value="two" onChange={onChange} />)
		fireEvent.keyDown(screen.getByRole('tab', { name: 'Two' }), { key: 'ArrowRight' })
		// 'three' is disabled → lands on 'four'
		expect(onChange).toHaveBeenCalledWith('four')
	})

	it('wraps from the last enabled tab to the first', () => {
		const onChange = vi.fn()
		render(<Tabs items={items} value="four" onChange={onChange} />)
		fireEvent.keyDown(screen.getByRole('tab', { name: 'Four' }), { key: 'ArrowRight' })
		expect(onChange).toHaveBeenCalledWith('one')
	})

	it('supports Home and End', () => {
		const onChange = vi.fn()
		render(<Tabs items={items} value="two" onChange={onChange} />)
		fireEvent.keyDown(screen.getByRole('tab', { name: 'Two' }), { key: 'End' })
		expect(onChange).toHaveBeenCalledWith('four')
		fireEvent.keyDown(screen.getByRole('tab', { name: 'Two' }), { key: 'Home' })
		expect(onChange).toHaveBeenCalledWith('one')
	})

	it('works uncontrolled with defaultValue', () => {
		render(<Tabs items={items} defaultValue="two" />)
		expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'true')
		fireEvent.click(screen.getByRole('tab', { name: 'One' }))
		expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute('aria-selected', 'true')
	})

	it('wires panels to tabs when nested', () => {
		render(
			<Tabs items={items} defaultValue="one">
				<TabPanel value="one">First panel</TabPanel>
				<TabPanel value="two">Second panel</TabPanel>
			</Tabs>
		)
		const tab = screen.getByRole('tab', { name: 'One' })
		const panel = screen.getByRole('tabpanel')
		expect(panel).toHaveTextContent('First panel')
		expect(tab.getAttribute('aria-controls')).toBe(panel.id)
		expect(panel.getAttribute('aria-labelledby')).toBe(tab.id)
	})
})
