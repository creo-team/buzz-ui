"use client"
import * as React from 'react'
import { cx } from '../internal/cx.js'
import { announcePolite } from '../internal/announcer.js'
import { CopyFallback } from '../internal/copy-fallback.js'
import { IconCheck, IconCopy, IconX } from '../internal/icons.js'
import { CopyStatus, useCopyToClipboard } from '../hooks/use-copy-to-clipboard.js'
import { formatHotkey } from '../hooks/use-hotkey.js'
import { Tooltip } from '../overlays/tooltip.js'

const COPIED_MESSAGE = 'Copied'
const COPY_HOTKEY = 'mod+c'
const TOUCH_POINTER = 'touch'

const COPY_STATUS_DATA: Record<CopyStatus, string> = {
	[CopyStatus.Idle]: 'idle',
	[CopyStatus.Copied]: 'copied',
	[CopyStatus.Failed]: 'failed',
}

function getFailureHint(touch: boolean): string {
	if (touch) return "Couldn't copy. Press and hold the text to copy it."
	return `Couldn't copy. Press ${formatHotkey(COPY_HOTKEY)} to copy the selected text.`
}

/** Props for {@link CopyButton}. */
export interface CopyButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
	/** Text written to the clipboard. */
	value: string
	/** What is being copied, used in the tooltip and label, e.g. "link" → "Copy link". @default 'content' */
	label?: string
	/** How long the "Copied" state lasts, in ms. @default 1500 */
	timeout?: number
	/** Called with the copied text after a successful copy. */
	onCopied?: (text: string) => void
	/** Called when the clipboard refuses the write or is unavailable; wire it to the app's logger. */
	onCopyError?: (error: unknown) => void
}

/**
 * Icon button that copies `value` to the clipboard. The shared Tooltip says `Copy {label}` on hover
 * and focus and `Copied` after success, announced politely. A failed copy is shown, never swallowed:
 * `data-copy-status="failed"`, an ✕ icon, and the value selected in the tooltip with a shortcut hint.
 *
 * @example
 * <CopyButton value={shareUrl} label="link" onCopyError={error => logger.warn({ error }, 'copy failed')} />
 */
export function CopyButton({
	value,
	label = 'content',
	timeout,
	onCopied,
	onCopyError,
	className,
	...props
}: CopyButtonProps) {
	const buttonRef = React.useRef<HTMLButtonElement>(null)
	const touchRef = React.useRef(false)
	const [open, setOpen] = React.useState(false)
	const actionLabel = `Copy ${label.toLowerCase()}`

	const { copy, status, reset } = useCopyToClipboard({
		resetMs: timeout,
		onCopied: text => {
			announcePolite(COPIED_MESSAGE, buttonRef.current)
			onCopied?.(text)
		},
		onCopyError: error => {
			announcePolite(getFailureHint(touchRef.current), buttonRef.current)
			onCopyError?.(error)
		},
	})

	const handleOpenChange = (next: boolean) => {
		setOpen(next)
		if (!next && status === CopyStatus.Failed) reset()
	}

	let content: React.ReactNode = actionLabel
	if (status === CopyStatus.Copied) content = COPIED_MESSAGE
	if (status === CopyStatus.Failed) content = <CopyFallback text={value} hint={getFailureHint(touchRef.current)} />

	let icon = <IconCopy className="bz-copy-button__icon" />
	if (status === CopyStatus.Copied) icon = <IconCheck className="bz-copy-button__icon" />
	if (status === CopyStatus.Failed) icon = <IconX className="bz-copy-button__icon" />

	return (
		<Tooltip content={content} open={open} onOpenChange={handleOpenChange} describeTrigger={false}>
			<button
				ref={buttonRef}
				type="button"
				aria-label={actionLabel}
				className={cx('bz-copy-button', className)}
				data-copy-status={COPY_STATUS_DATA[status]}
				data-copied={status === CopyStatus.Copied || undefined}
				{...props}
				onPointerDown={event => {
					touchRef.current = event.pointerType === TOUCH_POINTER
					props.onPointerDown?.(event)
				}}
				onClick={event => {
					props.onClick?.(event)
					if (event.defaultPrevented) return
					void copy(value)
					setOpen(true)
				}}
			>
				{icon}
			</button>
		</Tooltip>
	)
}
