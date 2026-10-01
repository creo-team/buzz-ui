"use client"
import * as React from 'react'

/** Result of the last copy attempt. */
export enum CopyStatus {
	/** No copy yet, or the feedback window has passed. */
	Idle = 'IDLE',
	/** The last write succeeded; returns to IDLE after `resetMs`. */
	Copied = 'COPIED',
	/** The last write failed; persists until `reset()` or the next copy. */
	Failed = 'FAILED',
}

/** Options for {@link useCopyToClipboard}. */
export interface UseCopyToClipboardOptions {
	/** How long COPIED lasts before returning to IDLE, in ms. @default 1500 */
	resetMs?: number
	/** Called with the text after a successful write. */
	onCopied?: (text: string) => void
	/** Called when the write fails or the API is unavailable. */
	onCopyError?: (error: unknown) => void
}

/** What {@link useCopyToClipboard} returns. */
export interface CopyToClipboard {
	/** Writes `text`. Call it directly in the click or keydown handler with no await before it (Safari consumes the gesture on the first await). Resolves true on success; never throws. */
	copy: (text: string) => Promise<boolean>
	/** Result of the last attempt. */
	status: CopyStatus
	/** The last failure, or null. */
	error: unknown
	/** Returns to IDLE and clears the error. */
	reset: () => void
}

/** How long "Copied" feedback lasts, in ms. */
const COPY_FEEDBACK_MS = 1500

/**
 * Copies text to the clipboard and tracks the result. The write happens synchronously inside
 * `copy`, so the browser still sees the user's gesture. Failures (no secure context, a missing API,
 * a refused permission) set FAILED and call `onCopyError`; they are never thrown or swallowed. The
 * hook renders nothing and announces nothing: the component shows and announces the outcome.
 *
 * @example
 * const { copy, status } = useCopyToClipboard({ onCopyError: error => logger.warn({ error }, 'copy failed') })
 * <button onClick={() => void copy(url)}>{status === CopyStatus.Copied ? 'Copied' : 'Copy link'}</button>
 */
export function useCopyToClipboard(options: UseCopyToClipboardOptions = {}): CopyToClipboard {
	const { resetMs = COPY_FEEDBACK_MS } = options
	const [status, setStatus] = React.useState<CopyStatus>(CopyStatus.Idle)
	const [error, setError] = React.useState<unknown>(null)
	const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
	const optionsRef = React.useRef(options)
	optionsRef.current = options
	const resetMsRef = React.useRef(resetMs)
	resetMsRef.current = resetMs

	const clearTimer = React.useCallback(() => {
		if (timerRef.current !== null) clearTimeout(timerRef.current)
		timerRef.current = null
	}, [])

	React.useEffect(() => clearTimer, [clearTimer])

	const fail = React.useCallback((failure: unknown) => {
		setStatus(CopyStatus.Failed)
		setError(failure)
		optionsRef.current.onCopyError?.(failure)
		return false
	}, [])

	const copy = React.useCallback(
		(text: string): Promise<boolean> => {
			clearTimer()
			const clipboard = typeof window !== 'undefined' && window.isSecureContext ? navigator.clipboard : undefined
			if (typeof clipboard?.writeText !== 'function') {
				return Promise.resolve(fail(new Error('Clipboard unavailable: requires a secure context')))
			}
			let write: Promise<void>
			try {
				write = clipboard.writeText(text)
			} catch (failure) {
				return Promise.resolve(fail(failure))
			}
			return write.then(
				() => {
					setStatus(CopyStatus.Copied)
					setError(null)
					optionsRef.current.onCopied?.(text)
					clearTimer()
					timerRef.current = setTimeout(() => {
						timerRef.current = null
						setStatus(CopyStatus.Idle)
					}, resetMsRef.current)
					return true
				},
				(failure: unknown) => fail(failure)
			)
		},
		[clearTimer, fail]
	)

	const reset = React.useCallback(() => {
		clearTimer()
		setStatus(CopyStatus.Idle)
		setError(null)
	}, [clearTimer])

	return { copy, status, error, reset }
}
