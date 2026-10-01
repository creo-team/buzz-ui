import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CopyStatus, useCopyToClipboard } from '../../src/hooks/use-copy-to-clipboard'

const writeText = vi.fn<(text: string) => Promise<void>>()

function notAllowed(): DOMException {
	return new DOMException('Write permission denied.', 'NotAllowedError')
}

beforeEach(() => {
	vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] })
	writeText.mockReset().mockResolvedValue(undefined)
	Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
	Object.defineProperty(window, 'isSecureContext', { configurable: true, writable: true, value: true })
})

afterEach(() => {
	vi.useRealTimers()
	Object.defineProperty(window, 'isSecureContext', { configurable: true, writable: true, value: true })
})

describe('useCopyToClipboard', () => {
	it('calls writeText synchronously, before any await', () => {
		const { result } = renderHook(() => useCopyToClipboard())
		let pending: Promise<boolean> | undefined
		act(() => {
			pending = result.current.copy('hello')
		})
		expect(writeText).toHaveBeenCalledWith('hello')
		expect(pending).toBeInstanceOf(Promise)
	})

	it('reports COPIED, then IDLE after 1500 ms, and passes the text to onCopied', async () => {
		const onCopied = vi.fn()
		const { result } = renderHook(() => useCopyToClipboard({ onCopied }))
		await act(async () => {
			expect(await result.current.copy('hello')).toBe(true)
		})
		expect(result.current.status).toBe(CopyStatus.Copied)
		expect(onCopied).toHaveBeenCalledWith('hello')
		act(() => vi.advanceTimersByTime(1499))
		expect(result.current.status).toBe(CopyStatus.Copied)
		act(() => vi.advanceTimersByTime(1))
		expect(result.current.status).toBe(CopyStatus.Idle)
	})

	it('reports FAILED on NotAllowedError until reset, and calls onCopyError', async () => {
		const failure = notAllowed()
		writeText.mockRejectedValue(failure)
		const onCopyError = vi.fn()
		const { result } = renderHook(() => useCopyToClipboard({ onCopyError }))
		await act(async () => {
			expect(await result.current.copy('hello')).toBe(false)
		})
		expect(result.current.status).toBe(CopyStatus.Failed)
		expect(result.current.error).toBe(failure)
		expect(onCopyError).toHaveBeenCalledWith(failure)
		act(() => vi.advanceTimersByTime(10_000))
		expect(result.current.status).toBe(CopyStatus.Failed)
		act(() => result.current.reset())
		expect(result.current.status).toBe(CopyStatus.Idle)
		expect(result.current.error).toBeNull()
	})

	it('fails without throwing outside a secure context', async () => {
		Object.defineProperty(window, 'isSecureContext', { configurable: true, writable: true, value: false })
		const onCopyError = vi.fn()
		const { result } = renderHook(() => useCopyToClipboard({ onCopyError }))
		await act(async () => {
			expect(await result.current.copy('hello')).toBe(false)
		})
		expect(writeText).not.toHaveBeenCalled()
		expect(result.current.status).toBe(CopyStatus.Failed)
		expect(onCopyError).toHaveBeenCalledWith(expect.objectContaining({ message: 'Clipboard unavailable: requires a secure context' }))
		act(() => vi.advanceTimersByTime(10_000))
		expect(result.current.status).toBe(CopyStatus.Failed)
	})

	it('fails without throwing when the Clipboard API is missing', async () => {
		Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined })
		const { result } = renderHook(() => useCopyToClipboard())
		await act(async () => {
			expect(await result.current.copy('hello')).toBe(false)
		})
		expect(result.current.status).toBe(CopyStatus.Failed)
	})

	it('clears its timer on unmount', async () => {
		const { result, unmount } = renderHook(() => useCopyToClipboard())
		await act(async () => {
			await result.current.copy('hello')
		})
		expect(vi.getTimerCount()).toBe(1)
		unmount()
		expect(vi.getTimerCount()).toBe(0)
	})
})
