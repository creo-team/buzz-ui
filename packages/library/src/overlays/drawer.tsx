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

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom'
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface DrawerProps {
	children: React.ReactNode
	open: boolean
	onOpenChange: (open: boolean) => void
	side?: DrawerSide
	size?: DrawerSize
	title?: React.ReactNode
	description?: React.ReactNode
	showCloseButton?: boolean
	/** Additional hotkeys active while the drawer is open. */
	hotkeys?: HotkeyConfig[]
	className?: string
}

/**
 * Sliding panel from any edge. Same accessibility contract as Modal (portal,
 * focus trap, scroll lock, layered dismissal) with CSS-driven slide
 * animations for both enter and exit.
 */
export function Drawer({
	children,
	open,
	onOpenChange,
	side = 'right',
	size = 'md',
	title,
	description,
	showCloseButton = true,
	hotkeys = [],
	className,
}: DrawerProps) {
	const titleId = React.useId()
	const descriptionId = React.useId()
	const panelRef = React.useRef<HTMLDivElement>(null)
	const mounted = usePresence(open, 240)

	const requestClose = React.useCallback(() => onOpenChange(false), [onOpenChange])

	useScrollLock(mounted)
	useFocusTrap(panelRef, open)
	useDismissableLayer({
		enabled: open,
		onDismiss: requestClose,
		refs: [panelRef],
		outsidePress: false,
	})

	useHotkey(
		hotkeys.map(hotkey => ({
			...hotkey,
			enabled: open && (hotkey.enabled ?? true),
		}))
	)

	if (!mounted) return null
	const state = open ? 'open' : 'closed'

	return (
		<Portal>
			<div className="bz-drawer" data-state={state}>
				<div className="bz-drawer__backdrop" data-state={state} onClick={requestClose} />
				<div
					ref={panelRef}
					role="dialog"
					aria-modal="true"
					aria-labelledby={title != null ? titleId : undefined}
					aria-describedby={description != null ? descriptionId : undefined}
					className={cx('bz-drawer__panel', className)}
					data-side={side}
					data-size={size}
					data-state={state}
				>
					{(title != null || description != null || showCloseButton) && (
						<div className="bz-drawer__header">
							<div className="bz-drawer__titles">
								{title != null && (
									<h2 id={titleId} className="bz-drawer__title">
										{title}
									</h2>
								)}
								{description != null && (
									<p id={descriptionId} className="bz-drawer__description">
										{description}
									</p>
								)}
							</div>
							{showCloseButton && (
								<button
									type="button"
									className="bz-drawer__close"
									aria-label="Close drawer"
									onClick={requestClose}
								>
									<IconX />
								</button>
							)}
						</div>
					)}
					<div className="bz-drawer__body">{children}</div>
				</div>
			</div>
		</Portal>
	)
}
