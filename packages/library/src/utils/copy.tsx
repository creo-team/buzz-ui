"use client"
import * as React from 'react'
import { cx } from '../internal/cx.js'
import { IconCheck, IconCopy } from '../internal/icons.js'

export interface CopyButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
	/** Text written to the clipboard. */
	value: string
	/** What is being copied — used in the tooltip/label, e.g. "link" → "Copy link". */
	label?: string
	/** Feedback duration in ms. Default 1500. */
	timeout?: number
	/** Called after a successful copy. */
	onCopied?: () => void
}

/** Icon button that copies `value` to the clipboard with themed feedback. */
export function CopyButton({
	value,
	label = 'content',
	timeout = 1500,
	onCopied,
	className,
	...props
}: CopyButtonProps) {
	const [copied, setCopied] = React.useState(false)
	const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

	React.useEffect(() => {
		return () => {
			if (timer.current) clearTimeout(timer.current)
		}
	}, [])

	async function onCopy() {
		try {
			await navigator.clipboard.writeText(value)
			setCopied(true)
			onCopied?.()
			if (timer.current) clearTimeout(timer.current)
			timer.current = setTimeout(() => setCopied(false), timeout)
		} catch {
			// Clipboard unavailable (permissions/insecure context) — stay silent.
		}
	}

	return (
		<button
			type="button"
			title={copied ? 'Copied!' : `Copy ${label.toLowerCase()}`}
			aria-label={`Copy ${label.toLowerCase()}`}
			className={cx('bz-copy-button', className)}
			data-copied={copied || undefined}
			{...props}
			onClick={event => {
				props.onClick?.(event)
				if (!event.defaultPrevented) void onCopy()
			}}
		>
			{copied ? <IconCheck className="bz-copy-button__icon" /> : <IconCopy className="bz-copy-button__icon" />}
			<span className="bz-visually-hidden" role="status" aria-live="polite">
				{copied ? 'Copied to clipboard' : ''}
			</span>
		</button>
	)
}
