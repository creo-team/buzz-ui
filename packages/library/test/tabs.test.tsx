import React from 'react'
import { render, screen, fireEvent } from './setup'
import { vi } from 'vitest'
import { Tabs, TabPanel } from '../src/navigation/tabs'

describe('Tabs', () => {
	const items = [
		{ key: 'tab1', label: 'Tab 1' },
		{ key: 'tab2', label: 'Tab 2' },
		{ key: 'tab3', label: 'Tab 3', disabled: true }
	]

	it('renders all tab items', () => {
		render(<Tabs items={items} value="tab1" onChange={() => {}} />)
		
		expect(screen.getByText('Tab 1')).toBeInTheDocument()
		expect(screen.getByText('Tab 2')).toBeInTheDocument()
		expect(screen.getByText('Tab 3')).toBeInTheDocument()
	})

	it('marks selected tab with aria-selected', () => {
		render(<Tabs items={items} value="tab2" onChange={() => {}} />)
		
		const tab2Button = screen.getByRole('tab', { name: 'Tab 2' })
		expect(tab2Button).toHaveAttribute('aria-selected', 'true')
		
		const tab1Button = screen.getByRole('tab', { name: 'Tab 1' })
		expect(tab1Button).toHaveAttribute('aria-selected', 'false')
	})

	it('calls onChange when tab is clicked', () => {
		const handleChange = vi.fn()
		render(<Tabs items={items} value="tab1" onChange={handleChange} />)
		
		fireEvent.click(screen.getByText('Tab 2'))
		expect(handleChange).toHaveBeenCalledWith('tab2')
	})

	it('does not call onChange for disabled tabs', () => {
		const handleChange = vi.fn()
		render(<Tabs items={items} value="tab1" onChange={handleChange} />)
		
		fireEvent.click(screen.getByText('Tab 3'))
		expect(handleChange).not.toHaveBeenCalled()
	})

	it('renders with icons and badges', () => {
		const itemsWithExtras = [
			{ key: 'tab1', label: 'Home', icon: <span data-testid="home-icon">🏠</span> },
			{ key: 'tab2', label: 'Users', badge: 5 },
			{ key: 'tab3', label: 'Settings', icon: <span data-testid="settings-icon">⚙️</span>, badge: 'New' }
		]
		
		render(<Tabs items={itemsWithExtras} value="tab1" onChange={() => {}} />)
		
		expect(screen.getByTestId('home-icon')).toBeInTheDocument()
		expect(screen.getByTestId('settings-icon')).toBeInTheDocument()
		expect(screen.getByText('5')).toBeInTheDocument()
		expect(screen.getByText('New')).toBeInTheDocument()
	})

	it('applies different variant styles', () => {
		const { rerender } = render(
			<Tabs items={items} value="tab1" onChange={() => {}} variant="pills" />
		)
		expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveClass('rounded-xl')
		
		rerender(<Tabs items={items} value="tab1" onChange={() => {}} variant="underline" />)
		expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveClass('border-b-2')
	})

	it('applies size classes correctly', () => {
		const { rerender } = render(
			<Tabs items={items} value="tab1" onChange={() => {}} size="sm" />
		)
		expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveClass('text-xs')
		
		rerender(<Tabs items={items} value="tab1" onChange={() => {}} size="lg" />)
		expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveClass('text-base')
	})

	it('stretches to full width when fullWidth is true', () => {
		render(<Tabs items={items} value="tab1" onChange={() => {}} fullWidth />)
		
		const container = screen.getByRole('tablist')
		expect(container).toHaveClass('flex', 'w-full')
	})
})

describe('TabPanel', () => {
	it('renders content when value matches selectedValue', () => {
		render(
			<TabPanel value="tab1" selectedValue="tab1">
				<div>Tab 1 Content</div>
			</TabPanel>
		)
		
		expect(screen.getByText('Tab 1 Content')).toBeInTheDocument()
	})

	it('does not render content when value does not match selectedValue', () => {
		render(
			<TabPanel value="tab1" selectedValue="tab2">
				<div>Tab 1 Content</div>
			</TabPanel>
		)
		
		expect(screen.queryByText('Tab 1 Content')).not.toBeInTheDocument()
	})

	it('applies animation classes', () => {
		render(
			<TabPanel value="tab1" selectedValue="tab1">
				<div>Content</div>
			</TabPanel>
		)
		
		const panel = screen.getByRole('tabpanel')
		expect(panel).toHaveClass('animate-in', 'fade-in-0', 'slide-in-from-bottom-1')
	})

	it('applies custom className', () => {
		render(
			<TabPanel value="tab1" selectedValue="tab1" className="custom-class">
				<div>Content</div>
			</TabPanel>
		)
		
		const panel = screen.getByRole('tabpanel')
		expect(panel).toHaveClass('custom-class')
	})
})
