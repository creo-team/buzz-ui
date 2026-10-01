"use client"

import * as React from 'react'
import { Portal } from '../internal/portal.js'
import { cx } from '../internal/cx.js'
import { usePosition, type Side } from '../internal/use-position.js'
import { usePresence } from '../internal/use-presence.js'
import { useControllableState } from '../internal/use-controllable-state.js'
import { useDismissableLayer } from '../internal/use-dismissable-layer.js'

/** Preferred side of the trigger the tooltip appears on. */
export enum TooltipDirection {
	Top = 'TOP',
	Bottom = 'BOTTOM',
	Left = 'LEFT',
	Right = 'RIGHT',
}

/** Bubble size presets — font size, padding and max width scale together. */
export enum TooltipSize {
	Compact = 'COMPACT',
	Comfortable = 'COMFORTABLE',
	Spacious = 'SPACIOUS',
	ExtraLarge = 'EXTRA_LARGE',
}

type LegacySize = 'sm' | 'md' | 'lg' | 'xl'

/** Grace period before hiding, so the pointer can travel from the trigger into the bubble. */
const HIDE_DELAY_MS = 100
const TOUCH_POINTER = 'touch'

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

/** Props for {@link Tooltip}. */
export interface TooltipProps {
	/** Trigger the tooltip describes — a single element child gets `aria-describedby` wired while visible. */
	children: React.ReactNode
	/** Bubble content. */
	content: React.ReactNode
	/** Preferred side — enum or plain 'top' | 'bottom' | 'left' | 'right'. */
	direction?: TooltipDirection | Side
	/** Bubble size preset — enum or legacy 'sm' | 'md' | 'lg' | 'xl'. */
	size?: TooltipSize | LegacySize
	/** Hover delay before showing, in ms. Default 400. */
	delayMs?: number
	/** Optional bold heading above the content. */
	title?: string
	/** Controlled visibility. Hover, focus, touch, Escape and outside presses still request changes through `onOpenChange`; the parent decides. */
	open?: boolean
	/** Called whenever the tooltip requests to open or close, in controlled and uncontrolled mode. */
	onOpenChange?: (open: boolean) => void
	/** Merge the bubble's id into the trigger's `aria-describedby` while open. Set false when the trigger already carries a stable description, so it is read once. @default true */
	describeTrigger?: boolean
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
 * - shows on hover *and* keyboard focus; opens on tap for touch and closes on an outside tap
 * - registers on the overlay layer stack while open, so Escape closes the tooltip alone and never
 *   the dialog beneath it (WCAG 1.4.13)
 * - rendered in a portal with collision-aware positioning (never clipped by
 *   `overflow: hidden` ancestors)
 * - wires `aria-describedby` onto the trigger element while visible (see `describeTrigger`)
 * - hoverable content (pointer can travel into the bubble)
 *
 * @example
 * <Tooltip content="Archive this project">
 *   <button type="button" aria-label="Archive"><IconArchive /></button>
 * </Tooltip>
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
	describeTrigger = true,
}: TooltipProps) {
	const tooltipId = React.useId()
	const anchorRef = React.useRef<HTMLSpanElement>(null)
	const floatingRef = React.useRef<HTMLDivElement>(null)
	const showTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
	const hideTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
	// A touch press on the trigger: ignore the focus it causes (Android) and open on its click.
	const touchPressRef = React.useRef(false)
	// A press inside the bubble (e.g. to select failure text) must not close it through the blur it causes.
	const floatingPressRef = React.useRef(false)

	const [open, setOpen] = useControllableState({ value: openProp, defaultValue: false, onChange: onOpenChange })

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
		clearTimers()
		showTimer.current = setTimeout(() => setOpen(true), delayMs)
	}

	const scheduleHide = () => {
		clearTimers()
		hideTimer.current = setTimeout(() => setOpen(false), HIDE_DELAY_MS)
	}

	React.useEffect(() => clearTimers, [])

	// Escape and outside presses go through the layer stack: only the topmost layer closes, and
	// Escape is consumed, so a tooltip inside a Modal closes first and the Modal stays open.
	useDismissableLayer({
		enabled: open,
		refs: [anchorRef, floatingRef],
		onDismiss: () => {
			clearTimers()
			setOpen(false)
		},
	})

	// Attach aria-describedby to a single element child while visible.
	let trigger: React.ReactNode = children
	if (describeTrigger && React.isValidElement(children)) {
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
				onPointerEnter={event => {
					if (event.pointerType !== TOUCH_POINTER) scheduleShow()
				}}
				onPointerLeave={event => {
					if (event.pointerType !== TOUCH_POINTER) scheduleHide()
				}}
				onPointerDown={event => {
					touchPressRef.current = event.pointerType === TOUCH_POINTER
				}}
				onPointerCancel={() => {
					touchPressRef.current = false
				}}
				onFocus={() => {
					floatingPressRef.current = false
					if (!touchPressRef.current) setOpen(true)
				}}
				onBlur={() => {
					touchPressRef.current = false
					if (floatingPressRef.current) {
						floatingPressRef.current = false
						return
					}
					setOpen(false)
				}}
				onClick={() => {
					if (!touchPressRef.current) return
					touchPressRef.current = false
					if (!open) setOpen(true)
				}}
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
						onPointerLeave={event => {
							if (event.pointerType !== TOUCH_POINTER) scheduleHide()
						}}
						onPointerDown={() => {
							floatingPressRef.current = true
						}}
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
