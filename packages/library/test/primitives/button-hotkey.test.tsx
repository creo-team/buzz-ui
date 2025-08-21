import { render, screen } from '../setup'
import { Button } from '../../src/primitives/button'
import { vi } from 'vitest'

describe('Button with hotkey', () => {
	it('should trigger onClick when hotkey is pressed', () => {
		const mockClick = vi.fn()
		
		render(
			<Button 
				hotkey={{ key: 'ctrl+k', action: mockClick }}
				onClick={mockClick}
			>
				Click me
			</Button>
		)
		
		global.triggerHotkey('ctrl+k')
		expect(mockClick).toHaveBeenCalledTimes(1)
	})

	it('should not trigger when button is disabled', () => {
		const mockClick = vi.fn()
		
		render(
			<Button 
				hotkey={{ key: 'ctrl+k', action: mockClick }}
				onClick={mockClick}
				disabled
			>
				Click me
			</Button>
		)
		
		global.triggerHotkey('ctrl+k')
		expect(mockClick).not.toHaveBeenCalled()
	})

	it('should not trigger when button is loading', () => {
		const mockClick = vi.fn()
		
		render(
			<Button 
				hotkey={{ key: 'ctrl+k', action: mockClick }}
				onClick={mockClick}
				loading
			>
				Click me
			</Button>
		)
		
		global.triggerHotkey('ctrl+k')
		expect(mockClick).not.toHaveBeenCalled()
	})

	it('should add hotkey hint to title attribute', () => {
		render(
			<Button 
				hotkey={{ key: 'ctrl+k', action: vi.fn() }}
				onClick={vi.fn()}
			>
				Click me
			</Button>
		)
		
		const button = screen.getByRole('button')
		expect(button).toHaveAttribute('title', 'Press Ctrl+K')
	})

	it('should not override existing title', () => {
		render(
			<Button 
				hotkey={{ key: 'ctrl+k', action: vi.fn() }}
				onClick={vi.fn()}
				title="Custom title"
			>
				Click me
			</Button>
		)
		
		const button = screen.getByRole('button')
		expect(button).toHaveAttribute('title', 'Custom title')
	})

	it('should show hotkey hint in title even without onClick', () => {
		render(
			<Button 
				hotkey={{ key: 'ctrl+k', action: vi.fn() }}
			>
				Click me
			</Button>
		)
		
		const button = screen.getByRole('button')
		expect(button).toHaveAttribute('title', 'Press Ctrl+K')
	})

	it('should work with HotkeyConfig object', () => {
		const mockClick = vi.fn()
		
		render(
			<Button 
				hotkey={{ key: 'enter', action: mockClick }}
				onClick={mockClick}
			>
				Click me
			</Button>
		)
		
		global.triggerHotkey('enter')
		expect(mockClick).toHaveBeenCalledTimes(1)
	})
})
