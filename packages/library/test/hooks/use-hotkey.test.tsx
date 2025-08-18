import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useHotkey, formatHotkey } from '../../src/hooks/use-hotkey'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

// Test component that uses the hotkey hook
function TestComponent({ hotkey, onAction }: { hotkey: any, onAction: () => void }) {
	useHotkey(hotkey)
	return <div data-testid="test-component">Test Component</div>
}

describe('useHotkey', () => {
	const mockAction = vi.fn()
	
	beforeEach(() => {
		mockAction.mockClear()
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	it('should trigger action when hotkey is pressed', async () => {
		const user = userEvent.setup()
		
		render(
			<TestComponent 
				hotkey={{ key: 'ctrl+k', action: mockAction }} 
				onAction={mockAction}
			/>
		)

		await user.keyboard('{Control>}k{/Control}')
		expect(mockAction).toHaveBeenCalledTimes(1)
	})

	it('should not trigger when disabled', async () => {
		const user = userEvent.setup()
		
		render(
			<TestComponent 
				hotkey={{ key: 'ctrl+k', action: mockAction, enabled: false }} 
				onAction={mockAction}
			/>
		)

		await user.keyboard('{Control>}k{/Control}')
		expect(mockAction).not.toHaveBeenCalled()
	})

	it('should handle multiple hotkeys', async () => {
		const user = userEvent.setup()
		const mockAction2 = vi.fn()
		
		render(
			<TestComponent 
				hotkey={[
					{ key: 'ctrl+k', action: mockAction },
					{ key: 'alt+t', action: mockAction2 }
				]} 
				onAction={mockAction}
			/>
		)

		await user.keyboard('{Control>}k{/Control}')
		expect(mockAction).toHaveBeenCalledTimes(1)
		
		await user.keyboard('{Alt>}t{/Alt}')
		expect(mockAction2).toHaveBeenCalledTimes(1)
	})

	it('should handle string shortcut format', async () => {
		const user = userEvent.setup()
		
		function StringTestComponent() {
			useHotkey({ key: 'enter', action: mockAction })
			return <div data-testid="test-component">Test Component</div>
		}
		
		render(<StringTestComponent />)

		await user.keyboard('{Enter}')
		expect(mockAction).toHaveBeenCalledTimes(1)
	})
})

describe('formatHotkey', () => {
	it('should format hotkey combinations correctly', () => {
		expect(formatHotkey('ctrl+k')).toBe('Ctrl+K')
		expect(formatHotkey('alt+shift+t')).toBe('Alt+Shift+T')
		expect(formatHotkey('cmd+enter')).toBe('Cmd+Enter')
		expect(formatHotkey('escape')).toBe('Esc')
		expect(formatHotkey('space')).toBe('Space')
	})

	it('should handle single keys', () => {
		expect(formatHotkey('enter')).toBe('Enter')
		expect(formatHotkey('tab')).toBe('Tab')
		expect(formatHotkey('backspace')).toBe('Backspace')
		expect(formatHotkey('delete')).toBe('Delete')
	})

	it('should handle letter keys', () => {
		expect(formatHotkey('a')).toBe('A')
		expect(formatHotkey('z')).toBe('Z')
		expect(formatHotkey('ctrl+a')).toBe('Ctrl+A')
	})
})
