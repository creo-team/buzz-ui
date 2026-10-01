import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CodeBox } from '../src/data/code-box'

// Mock clipboard API
Object.assign(navigator, {
	clipboard: {
		writeText: vi.fn().mockImplementation(() => Promise.resolve()),
	},
})

describe('CodeBox', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should render code content', () => {
		const code = 'console.log("Hello World")'
		render(<CodeBox code={code} />)

		expect(screen.getByText(code)).toBeInTheDocument()
	})

	it('should show label when provided', () => {
		const code = 'const x = 1'
		const label = 'Example Code'
		
		render(<CodeBox code={code} label={label} />)

		expect(screen.getByText(label)).toBeInTheDocument()
	})

	it('should show language when provided', () => {
		const code = 'const x = 1'
		const language = 'typescript'
		
		render(<CodeBox code={code} language={language} label="Test" />)

		expect(screen.getByText(language)).toBeInTheDocument()
	})

	it('should render line numbers when enabled', () => {
		const code = 'line 1\nline 2\nline 3'
		
		render(<CodeBox code={code} showLineNumbers={true} />)

		const numbers = screen.getAllByText(/^\d+$/)
		expect(numbers.length).toBeGreaterThanOrEqual(3)
	})

	it('should copy code to clipboard when copy button is clicked', async () => {
		const code = 'console.log("test")'
		
		render(<CodeBox code={code} copyable={true} />)

		const copyButton = screen.getByRole('button', { name: 'Copy code' })
		fireEvent.click(copyButton)

		await waitFor(() => {
			expect(navigator.clipboard.writeText).toHaveBeenCalledWith(code)
		})
	})

	it('should show copied state after successful copy', async () => {
		const code = 'test code'
		
		render(<CodeBox code={code} copyable={true} />)

		const copyButton = screen.getByRole('button', { name: 'Copy code' })
		fireEvent.click(copyButton)

		await waitFor(() => {
			expect(copyButton).toHaveAttribute('data-copy-status', 'copied')
		})
		await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent('Copied'))
	})

	it('positions the tooltip anchor, not the button, so the tooltip sits on the button', () => {
		render(<CodeBox code="const x = 1" copyable={true} />)
		const button = screen.getByRole('button', { name: 'Copy code' })
		const anchor = button.parentElement
		expect(anchor).toHaveClass('bz-tooltip-anchor')
		expect(button).not.toHaveClass('bz-code-box__copy')
		expect(anchor?.parentElement).toHaveClass('bz-code-box__copy')
		expect(anchor?.children).toHaveLength(1)
	})

	it('should not show copy button when copyable is false', () => {
		const code = 'test code'
		
		render(<CodeBox code={code} copyable={false} />)

		expect(screen.queryByRole('button', { name: 'Copy code' })).not.toBeInTheDocument()
	})

	it('should handle copy errors gracefully', async () => {
		vi.mocked(navigator.clipboard.writeText).mockRejectedValue(new Error('Copy failed'))
		
		const code = 'test code'
		render(<CodeBox code={code} copyable={true} />)

		const copyButton = screen.getByRole('button', { name: 'Copy code' })
		fireEvent.click(copyButton)

		// Failure is shown, never swallowed: the button reports it and the tooltip offers the text
		await waitFor(() => {
			expect(copyButton).toHaveAttribute('data-copy-status', 'failed')
		})
		expect(navigator.clipboard.writeText).toHaveBeenCalledWith(code)
	})

	it('should apply custom className', () => {
		const code = 'test'
		const customClass = 'custom-class'
		
		render(<CodeBox code={code} className={customClass} />)

		const container = screen.getByText(code).closest('.custom-class')
		expect(container).toBeInTheDocument()
	})

	it('should use theme-aware CSS variables', () => {
		const code = 'test code'
		render(<CodeBox code={code} label="Test" />)

		const pre = screen.getByText(code).closest('pre')
		expect(pre).toHaveClass('bz-code-box__pre')
	})

	it('should handle empty code', () => {
		render(<CodeBox code="" />)
		
		const generics = screen.getAllByRole('generic')
		expect(generics.length).toBeGreaterThanOrEqual(1)
	})

	it('should handle multiline code correctly', () => {
		const multilineCode = `function test() {\n  console.log("line 1")\n  console.log("line 2")\n}`
		
		render(<CodeBox code={multilineCode} showLineNumbers={true} />)

		expect(screen.getByText(/function test\(\) \{/)).toBeInTheDocument()
		expect(screen.getByText(/console\.log\("line 1"\)/)).toBeInTheDocument()
		expect(screen.getByText(/\}/)).toBeInTheDocument()
	})
})
