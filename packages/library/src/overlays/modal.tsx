"use client"
import * as React from 'react'
import { Portal } from '../internal/portal.js'
import { cx } from '../internal/cx.js'
import { useScrollLock } from '../internal/use-scroll-lock.js'
import { useFocusTrap } from '../internal/use-focus-trap.js'
import { useDismissableLayer } from '../internal/use-dismissable-layer.js'
import { usePresence } from '../internal/use-presence.js'
import { useHotkey, type HotkeyConfig } from '../hooks/use-hotkey.js'
import { IconX } from '../internal/icons.js'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ModalProps {
	/** Open state (preferred). `isOpen` remains supported. */
	open?: boolean
	onOpenChange?: (open: boolean) => void
	/** @deprecated Use `open`. */
	isOpen?: boolean
	/** Called when the modal requests to close (Escape, backdrop, close button). */
	onClose?: () => void
	children: React.ReactNode
	/** Width preset. Default 'md'. */
	size?: ModalSize
	/** @deprecated Pass a `size` or `className` instead; still applied for compatibility. */
	maxWidthClassName?: string
	/** Swap the document title while open (restored on close). */
	documentTitle?: string
	header?: React.ReactNode
	actions?: React.ReactNode
	/** Additional hotkeys active while the modal is open. */
	hotkeys?: HotkeyConfig[]
	/** Show an ✕ button in the top-right corner. */
	showCloseButton?: boolean
	/** Prevent closing via Escape / backdrop (confirmation flows). The ✕
	 * button and programmatic closing keep working. */
	dismissible?: boolean
	/** Use `alertdialog` semantics for destructive confirmations. */
	role?: 'dialog' | 'alertdialog'
	/** Accessible name when no `header` is rendered. */
	'aria-label'?: string
	className?: string
}

/**
 * Accessible dialog:
 * - SSR-safe portal (no `document` access during render)
 * - focus is trapped inside and restored on close
 * - Escape and backdrop dismiss through the shared layer stack, so nested
 *   overlays close one at a time
 * - body scroll locked (scrollbar-shift compensated)
 * - labelled by its header automatically
 */
export function Modal({
	open: openProp,
	isOpen,
	onOpenChange,
	onClose,
	children,
	size = 'md',
	maxWidthClassName,
	documentTitle,
	header,
	actions,
	hotkeys = [],
	showCloseButton = false,
	dismissible = true,
	role = 'dialog',
	'aria-label': ariaLabel,
	className,
}: ModalProps) {
	const open = openProp ?? isOpen ?? false
	const titleId = React.useId()
	const panelRef = React.useRef<HTMLDivElement>(null)
	const mounted = usePresence(open)

	// Explicit closes (✕ button, consumer code) always work; `dismissible`
	// only gates light dismissal (Escape / outside press).
	const close = React.useCallback(() => {
		onClose?.()
		onOpenChange?.(false)
	}, [onClose, onOpenChange])

	useScrollLock(mounted)
	useFocusTrap(panelRef, open)
	useDismissableLayer({
		enabled: open,
		onDismiss: close,
		refs: [panelRef],
		// Layer-based outside press is stack-aware: with a menu or popover
		// open above this modal, the first press closes only that layer.
		outsidePress: dismissible,
		escapeKey: dismissible,
	})

	useHotkey(
		hotkeys.map(hotkey => ({
			...hotkey,
			enabled: open && (hotkey.enabled ?? true),
		}))
	)

	// Swap the document title while open, restore afterwards.
	const previousTitleRef = React.useRef<string | null>(null)
	React.useEffect(() => {
		if (!open || !documentTitle) return
		if (previousTitleRef.current == null) previousTitleRef.current = document.title
		document.title = documentTitle
		return () => {
			if (previousTitleRef.current != null) {
				document.title = previousTitleRef.current
				previousTitleRef.current = null
			}
		}
	}, [open, documentTitle])

	if (!mounted) return null
	const state = open ? 'open' : 'closed'

	return (
		<Portal>
			<div className="bz-modal" data-state={state}>
				<div className="bz-modal__backdrop" data-state={state} data-testid="modal-backdrop" />
				<div className="bz-modal__positioner">
					<div
						ref={panelRef}
						role={role}
						aria-modal="true"
						aria-labelledby={header != null ? titleId : undefined}
						aria-label={header == null ? ariaLabel : undefined}
						className={cx('bz-modal__panel', maxWidthClassName, className)}
						data-size={size}
						data-state={state}
						data-testid="modal-panel"
					>
						{showCloseButton && (
							<button
								type="button"
								className="bz-modal__close"
								aria-label="Close dialog"
								onClick={close}
							>
								<IconX />
							</button>
						)}
						{header != null && (
							<div className="bz-modal__header">
								<h2 id={titleId} className="bz-modal__title">
									{header}
								</h2>
							</div>
						)}
						<div className="bz-modal__body">{children}</div>
						{actions != null && (
							<div className="bz-modal__footer">
								<div className="bz-modal__actions">{actions}</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</Portal>
	)
}
