import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../../src/primitives/button'
import { vi, describe, it, expect, beforeEach } from 'vitest'

describe('Button with hotkey', () => {
	const mockClick = vi.fn()
	
	beforeEach(() => {
		mockClick.mockClear()
	})

	it('should trigger onClick when hotkey is pressed', async () => {
		const user = userEvent.setup()
		
		render(
			<Button hotkey="ctrl+k" onClick={mockClick}>
				Save
			</Button>
		)

		await user.keyboard('{Control>}k{/Control}')
		expect(mockClick).toHaveBeenCalledTimes(1)
	})

	it('should not trigger when button is disabled', async () => {
		const user = userEvent.setup()
		
		render(
			<Button hotkey="ctrl+k" onClick={mockClick} disabled>
				Save
			</Button>
		)

		await user.keyboard('{Control>}k{/Control}')
		expect(mockClick).not.toHaveBeenCalled()
	})

	it('should not trigger when button is loading', async () => {
		const user = userEvent.setup()
		
		render(
			<Button hotkey="ctrl+k" onClick={mockClick} loading>
				Save
			</Button>
		)

		await user.keyboard('{Control>}k{/Control}')
		expect(mockClick).not.toHaveBeenCalled()
	})

	it('should work with HotkeyConfig object', async () => {
		const user = userEvent.setup()
		
		render(
			<Button 
				hotkey={{ key: 'enter', description: 'Submit form' }} 
				onClick={mockClick}
			>
				Submit
			</Button>
		)

		await user.keyboard('{Enter}')
		expect(mockClick).toHaveBeenCalledTimes(1)
	})

	it('should add hotkey hint to title attribute', () => {
		render(
			<Button hotkey="ctrl+s" onClick={mockClick}>
				Save
			</Button>
		)

		const button = screen.getByRole('button', { name: 'Save' })
		expect(button).toHaveAttribute('title', 'Press Ctrl+S')
	})

	it('should not override existing title', () => {
		render(
			<Button hotkey="ctrl+s" onClick={mockClick} title="Custom title">
				Save
			</Button>
		)

		const button = screen.getByRole('button', { name: 'Save' })
		expect(button).toHaveAttribute('title', 'Custom title')
	})

	it('should not register hotkey without onClick', async () => {
		const user = userEvent.setup()
		
		render(
			<Button hotkey="ctrl+k">
				No Action
			</Button>
		)

		// Should not throw error and should not trigger anything
		await user.keyboard('{Control>}k{/Control}')
		// No assertions needed - just ensuring no errors
	})
})
