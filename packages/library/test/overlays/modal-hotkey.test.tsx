import { render, screen, fireEvent } from '../setup'
import { Modal } from '../../src/overlays/modal'
import { vi } from 'vitest'

describe('Modal with hotkeys', () => {
	it('should close modal when escape is pressed', () => {
		const mockClose = vi.fn()
		
		render(
			<Modal isOpen={true} onClose={mockClose}>
				<div>Modal content</div>
			</Modal>
		)
		
		global.triggerHotkey('escape')
		expect(mockClose).toHaveBeenCalledTimes(1)
	})

	it('should not close modal when closed', () => {
		const mockClose = vi.fn()
		
		render(
			<Modal isOpen={false} onClose={mockClose}>
				<div>Modal content</div>
			</Modal>
		)
		
		global.triggerHotkey('escape')
		expect(mockClose).not.toHaveBeenCalled()
	})

	it('should handle custom hotkeys when modal is open', () => {
		const mockClose = vi.fn()
		const mockCustomAction = vi.fn()
		
		render(
			<Modal 
				isOpen={true} 
				onClose={mockClose}
				hotkeys={[
					{ key: 'ctrl+s', action: mockCustomAction, description: 'Save' }
				]}
			>
				<div>Modal content</div>
			</Modal>
		)
		
		global.triggerHotkey('ctrl+s')
		expect(mockCustomAction).toHaveBeenCalledTimes(1)
	})

	it('should not trigger custom hotkeys when modal is closed', () => {
		const mockClose = vi.fn()
		const mockCustomAction = vi.fn()
		
		render(
			<Modal 
				isOpen={false} 
				onClose={mockClose}
				hotkeys={[
					{ key: 'ctrl+s', action: mockCustomAction, description: 'Save' }
				]}
			>
				<div>Modal content</div>
			</Modal>
		)
		
		global.triggerHotkey('ctrl+s')
		expect(mockCustomAction).not.toHaveBeenCalled()
	})

	it('should respect enabled state of custom hotkeys', () => {
		const mockClose = vi.fn()
		const mockCustomAction = vi.fn()
		
		render(
			<Modal 
				isOpen={true} 
				onClose={mockClose}
				hotkeys={[
					{ key: 'ctrl+s', action: mockCustomAction, description: 'Save', enabled: false }
				]}
			>
				<div>Modal content</div>
			</Modal>
		)
		
		global.triggerHotkey('ctrl+s')
		expect(mockCustomAction).not.toHaveBeenCalled()
	})

	it('should handle multiple custom hotkeys', () => {
		const mockClose = vi.fn()
		const mockCustomAction = vi.fn()
		
		render(
			<Modal 
				isOpen={true} 
				onClose={mockClose}
				hotkeys={[
					{ key: 'ctrl+s', action: mockCustomAction, description: 'Save' },
					{ key: 'ctrl+enter', action: mockCustomAction, description: 'Submit' }
				]}
			>
				<div>Modal content</div>
			</Modal>
		)
		
		global.triggerHotkey('ctrl+s')
		expect(mockCustomAction).toHaveBeenCalledTimes(1)
		
		global.triggerHotkey('ctrl+enter')
		expect(mockCustomAction).toHaveBeenCalledTimes(2)
	})
})
