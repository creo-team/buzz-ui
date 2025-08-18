import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '../../src/overlays/modal'
import { vi, describe, it, expect, beforeEach } from 'vitest'

describe('Modal with hotkeys', () => {
	const mockClose = vi.fn()
	const mockCustomAction = vi.fn()
	
	beforeEach(() => {
		mockClose.mockClear()
		mockCustomAction.mockClear()
	})

	it('should close modal when escape is pressed', async () => {
		const user = userEvent.setup()
		
		render(
			<Modal isOpen onClose={mockClose}>
				<p>Modal content</p>
			</Modal>
		)

		await user.keyboard('{Escape}')
		expect(mockClose).toHaveBeenCalledTimes(1)
	})

	it('should not close modal when closed', async () => {
		const user = userEvent.setup()
		
		render(
			<Modal isOpen={false} onClose={mockClose}>
				<p>Modal content</p>
			</Modal>
		)

		await user.keyboard('{Escape}')
		expect(mockClose).not.toHaveBeenCalled()
	})

	it('should handle custom hotkeys when modal is open', async () => {
		const user = userEvent.setup()
		
		render(
			<Modal 
				isOpen 
				onClose={mockClose}
				hotkeys={[
					{ key: 'ctrl+s', action: mockCustomAction, description: 'Save' }
				]}
			>
				<p>Modal content</p>
			</Modal>
		)

		await user.keyboard('{Control>}s{/Control}')
		expect(mockCustomAction).toHaveBeenCalledTimes(1)
	})

	it('should not trigger custom hotkeys when modal is closed', async () => {
		const user = userEvent.setup()
		
		render(
			<Modal 
				isOpen={false}
				onClose={mockClose}
				hotkeys={[
					{ key: 'ctrl+s', action: mockCustomAction, description: 'Save' }
				]}
			>
				<p>Modal content</p>
			</Modal>
		)

		await user.keyboard('{Control>}s{/Control}')
		expect(mockCustomAction).not.toHaveBeenCalled()
	})

	it('should respect enabled state of custom hotkeys', async () => {
		const user = userEvent.setup()
		
		render(
			<Modal 
				isOpen 
				onClose={mockClose}
				hotkeys={[
					{ key: 'ctrl+s', action: mockCustomAction, enabled: false }
				]}
			>
				<p>Modal content</p>
			</Modal>
		)

		await user.keyboard('{Control>}s{/Control}')
		expect(mockCustomAction).not.toHaveBeenCalled()
	})

	it('should handle multiple custom hotkeys', async () => {
		const user = userEvent.setup()
		const mockAction2 = vi.fn()
		
		render(
			<Modal 
				isOpen 
				onClose={mockClose}
				hotkeys={[
					{ key: 'ctrl+s', action: mockCustomAction },
					{ key: 'ctrl+enter', action: mockAction2 }
				]}
			>
				<p>Modal content</p>
			</Modal>
		)

		await user.keyboard('{Control>}s{/Control}')
		expect(mockCustomAction).toHaveBeenCalledTimes(1)
		
		await user.keyboard('{Control>}{Enter}{/Control}')
		expect(mockAction2).toHaveBeenCalledTimes(1)
	})
})
