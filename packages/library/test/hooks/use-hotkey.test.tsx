import { render, screen } from '../setup'
import { useHotkey, formatHotkey } from '../../src/hooks/use-hotkey'
import { vi } from 'vitest'

function TestComponent({ hotkey }: { hotkey: any }) {
	useHotkey(hotkey)
	return <div>Test</div>
}

describe('useHotkey', () => {
	it('should trigger action when hotkey is pressed', async () => {
		const mockAction = vi.fn()
		
		render(<TestComponent hotkey={{ key: 'ctrl+k', action: mockAction }} />)
		
		// Trigger the hotkey using our mocked system
		global.triggerHotkey('ctrl+k')
		
		expect(mockAction).toHaveBeenCalledTimes(1)
	})

	it('should not trigger when disabled', () => {
		const mockAction = vi.fn()
		
		render(<TestComponent hotkey={{ key: 'ctrl+k', action: mockAction, enabled: false }} />)
		
		global.triggerHotkey('ctrl+k')
		
		expect(mockAction).not.toHaveBeenCalled()
	})

	it('should handle multiple hotkeys', async () => {
		const mockAction = vi.fn()
		
		render(
			<TestComponent 
				hotkey={[
					{ key: 'ctrl+k', action: mockAction },
					{ key: 'alt+t', action: mockAction }
				]} 
			/>
		)
		
		global.triggerHotkey('ctrl+k')
		expect(mockAction).toHaveBeenCalledTimes(1)
		
		global.triggerHotkey('alt+t')
		expect(mockAction).toHaveBeenCalledTimes(2)
	})

	it('should handle string shortcut format', async () => {
		const mockAction = vi.fn()
		
		render(<TestComponent hotkey={{ key: 'enter', action: mockAction }} />)
		
		global.triggerHotkey('enter')
		expect(mockAction).toHaveBeenCalledTimes(1)
	})
})

describe('formatHotkey', () => {
	it('should format hotkey combinations correctly', () => {
		expect(formatHotkey('ctrl+k')).toBe('Ctrl+K')
		expect(formatHotkey('alt+t')).toBe('Alt+T')
		expect(formatHotkey('shift+enter')).toBe('Shift+Enter')
	})

	it('should handle single keys', () => {
		expect(formatHotkey('enter')).toBe('Enter')
		expect(formatHotkey('escape')).toBe('Esc')
		expect(formatHotkey('space')).toBe('Space')
	})

	it('should handle letter keys', () => {
		expect(formatHotkey('k')).toBe('K')
		expect(formatHotkey('t')).toBe('T')
	})
})
