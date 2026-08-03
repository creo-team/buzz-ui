"use client"

import * as React from 'react'
import { Portal } from '../internal/portal.js'
import { cx } from '../internal/cx.js'
import { usePosition, type Side } from '../internal/use-position.js'
import { usePresence } from '../internal/use-presence.js'

export enum TooltipDirection {
	Top = 'TOP',
	Bottom = 'BOTTOM',
	Left = 'LEFT',
	Right = 'RIGHT',
}

export enum TooltipSize {
	Compact = 'COMPACT',
	Comfortable = 'COMFORTABLE',
	Spacious = 'SPACIOUS',
	ExtraLarge = 'EXTRA_LARGE',
}

type LegacySize = 'sm' | 'md' | 'lg' | 'xl'

const DIRECTION_TO_SIDE: Record<TooltipDirection, Side> = {
	[TooltipDirection.Top]: 'top',
	[TooltipDirection.Bottom]: 'bottom',
	[TooltipDirection.Left]: 'left',
	[TooltipDirection.Right]: 'right',
}

const SIZE_TO_DATA: Record<string, string> = {
	[TooltipSize.Compact]: 'compact',
	[TooltipSize.Comfortable]: 'comfortable',
	[TooltipSize.Spacious]: 'spacious',
	[TooltipSize.ExtraLarge]: 'xl',
	sm: 'compact',
	md: 'comfortable',
	lg: 'spacious',
	xl: 'xl',
}

export interface TooltipProps {
	children: React.ReactNode
	content: React.ReactNode
	/** Preferred side — enum or plain 'top' | 'bottom' | 'left' | 'right'. */
	direction?: TooltipDirection | Side
	size?: TooltipSize | LegacySize
	/** Hover delay before showing, in ms. Default 400. */
	delayMs?: number
	/** Optional bold heading above the content. */
	title?: string
	/** Controlled visibility. */
	open?: boolean
	onOpenChange?: (open: boolean) => void
	/** Extra classes for the tooltip bubble. */
	contentClassName?: string
	/** Width constraint override for the bubble (e.g. 'max-w-xs'). */
	widthClassName?: string
	/** @deprecated Legacy alias for `direction`. */
	placement?: 'top' | 'right' | 'bottom' | 'left'
	/** @deprecated Animations are CSS-driven now; this prop is ignored. */
	animationVariants?: unknown
}

/**
 * Accessible tooltip:
 * - shows on hover *and* keyboard focus, hides on Escape (WCAG 1.4.13)
 * - rendered in a portal with collision-aware positioning (never clipped by
 *   `overflow: hidden` ancestors)
 * - wires `aria-describedby` onto the trigger element while visible
 * - hoverable content (pointer can travel into the bubble)
 */
export function Tooltip({
	children,
	content,
	direction = TooltipDirection.Bottom,
	size = TooltipSize.Compact,
	delayMs = 400,
	title,
	open: openProp,
	onOpenChange,
	contentClassName,
	widthClassName,
	placement,
}: TooltipProps) {
	const tooltipId = React.useId()
	const anchorRef = React.useRef<HTMLSpanElement>(null)
	const floatingRef = React.useRef<HTMLDivElement>(null)
	const showTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
	const hideTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

	const [internalOpen, setInternalOpen] = React.useState(false)
	const isControlled = openProp !== undefined
	const open = isControlled ? openProp : internalOpen

	const setOpen = React.useCallback(
		(next: boolean) => {
			if (!isControlled) setInternalOpen(next)
			onOpenChange?.(next)
		},
		[isControlled, onOpenChange]
	)

	const preferredSide: Side =
		placement ?? DIRECTION_TO_SIDE[direction as TooltipDirection] ?? (direction as Side)
	const mounted = usePresence(Boolean(open), 120)
	const { x, y, side, ready, arrowX, arrowY } = usePosition(anchorRef, floatingRef, {
		open: mounted,
		side: preferredSide,
		sideOffset: 8,
	})

	const clearTimers = () => {
		if (showTimer.current) clearTimeout(showTimer.current)
		if (hideTimer.current) clearTimeout(hideTimer.current)
	}

	const scheduleShow = () => {
		if (isControlled) return
		clearTimers()
		showTimer.current = setTimeout(() => setOpen(true), delayMs)
	}

	const scheduleHide = () => {
		if (isControlled) return
		clearTimers()
		hideTimer.current = setTimeout(() => setOpen(false), 100)
	}

	React.useEffect(() => clearTimers, [])

	// WCAG 1.4.13: Escape dismisses without consuming the event.
	React.useEffect(() => {
		if (!open) return
		const onKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setOpen(false)
		}
		document.addEventListener('keydown', onKeydown)
		return () => document.removeEventListener('keydown', onKeydown)
	}, [open, setOpen])

	// Attach aria-describedby to a single element child while visible.
	let trigger: React.ReactNode = children
	if (React.isValidElement(children)) {
		trigger = React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
			'aria-describedby': open
				? cx(tooltipId, (children.props as Record<string, string>)['aria-describedby'])
				: (children.props as Record<string, string>)['aria-describedby'],
		})
	}

	return (
		<>
			<span
				ref={anchorRef}
				className="bz-tooltip-anchor"
				onMouseEnter={scheduleShow}
				onMouseLeave={scheduleHide}
				onFocus={() => !isControlled && setOpen(true)}
				onBlur={() => !isControlled && setOpen(false)}
			>
				{trigger}
			</span>
			{mounted && (
				<Portal>
					<div
						ref={floatingRef}
						id={tooltipId}
						role="tooltip"
						className={cx('bz-tooltip', widthClassName, contentClassName)}
						data-side={side}
						data-size={SIZE_TO_DATA[size as string] ?? 'compact'}
						data-state={open ? 'open' : 'closed'}
						// Tooltips float above every overlay without belonging to any
						// dismissal layer — pressing inside one must not close the
						// modal/drawer underneath.
						data-bz-layer-branch=""
						style={{
							position: 'fixed',
							left: x,
							top: y,
							visibility: ready ? undefined : 'hidden',
						}}
						onPointerEnter={() => {
							if (hideTimer.current) clearTimeout(hideTimer.current)
						}}
						onPointerLeave={scheduleHide}
					>
						{title && <div className="bz-tooltip__title">{title}</div>}
						<div className="bz-tooltip__content">{content}</div>
						<span
							className="bz-tooltip__arrow"
							data-side={side}
							style={{ left: arrowX, top: arrowY }}
							aria-hidden="true"
						/>
					</div>
				</Portal>
			)}
		</>
	)
}
