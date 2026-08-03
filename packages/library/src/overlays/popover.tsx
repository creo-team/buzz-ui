"use client"
import * as React from 'react'
import { Portal } from '../internal/portal.js'
import { cx } from '../internal/cx.js'
import { Slot } from '../internal/slot.js'
import { usePosition, type Side, type Align } from '../internal/use-position.js'
import { useDismissableLayer } from '../internal/use-dismissable-layer.js'
import { useControllableState } from '../internal/use-controllable-state.js'
import { useComposedRefs } from '../internal/compose-refs.js'
import { usePresence } from '../internal/use-presence.js'

interface PopoverContextValue {
	open: boolean
	setOpen: (open: boolean) => void
	contentId: string
	anchorRef: React.RefObject<HTMLElement | null>
	floatingRef: React.RefObject<HTMLDivElement | null>
	side: Side
	align: Align
	sideOffset: number
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null)

function usePopoverContext(part: string): PopoverContextValue {
	const context = React.useContext(PopoverContext)
	if (!context) throw new Error(`<${part}> must be used within <Popover>`)
	return context
}

export interface PopoverProps {
	children: React.ReactNode
	/** Controlled open state. */
	open?: boolean
	defaultOpen?: boolean
	onOpenChange?: (open: boolean) => void
	side?: Side
	align?: Align
	sideOffset?: number
}

/**
 * Anchored floating panel — the general-purpose building block behind menus,
 * date pickers and rich hovers. Composable:
 *
 *   <Popover>
 *     <PopoverTrigger asChild><Button>Open</Button></PopoverTrigger>
 *     <PopoverContent>…</PopoverContent>
 *   </Popover>
 */
export function Popover({
	children,
	open: openProp,
	defaultOpen = false,
	onOpenChange,
	side = 'bottom',
	align = 'center',
	sideOffset = 8,
}: PopoverProps) {
	const [open, setOpen] = useControllableState({
		value: openProp,
		defaultValue: defaultOpen,
		onChange: onOpenChange,
	})
	const contentId = React.useId()
	const anchorRef = React.useRef<HTMLElement | null>(null)
	const floatingRef = React.useRef<HTMLDivElement | null>(null)

	const context = React.useMemo(
		() => ({ open, setOpen, contentId, anchorRef, floatingRef, side, align, sideOffset }),
		[open, setOpen, contentId, side, align, sideOffset]
	)

	return <PopoverContext.Provider value={context}>{children}</PopoverContext.Provider>
}

export interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Merge onto the child element instead of rendering a button. */
	asChild?: boolean
}

export const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
	function PopoverTrigger({ asChild, children, onClick, ...props }, forwardedRef) {
		const context = usePopoverContext('PopoverTrigger')
		const ref = useComposedRefs<HTMLButtonElement>(
			forwardedRef,
			context.anchorRef as React.RefObject<HTMLButtonElement>
		)

		const triggerProps = {
			'aria-haspopup': 'dialog' as const,
			'aria-expanded': context.open,
			'aria-controls': context.open ? context.contentId : undefined,
			'data-state': context.open ? 'open' : 'closed',
			onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
				onClick?.(event)
				if (!event.defaultPrevented) context.setOpen(!context.open)
			},
			...props,
		}

		if (asChild) {
			return (
				<Slot ref={ref as unknown as React.Ref<HTMLElement>} {...triggerProps}>
					{children}
				</Slot>
			)
		}
		return (
			<button ref={ref} type="button" {...triggerProps}>
				{children}
			</button>
		)
	}
)

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
	children?: React.ReactNode
}

export const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
	function PopoverContent({ className, children, ...props }, forwardedRef) {
		const context = usePopoverContext('PopoverContent')
		const { open, setOpen, floatingRef, anchorRef } = context
		const mounted = usePresence(open)
		const ref = useComposedRefs(forwardedRef, floatingRef)

		const { x, y, side, ready } = usePosition(anchorRef, floatingRef, {
			open: mounted,
			side: context.side,
			align: context.align,
			sideOffset: context.sideOffset,
		})

		useDismissableLayer({
			enabled: open,
			onDismiss: () => setOpen(false),
			refs: [floatingRef, anchorRef],
		})

		// Move focus into the panel on open; on close return it to the trigger
		// (APG popover pattern) — unless the user moved focus elsewhere, e.g.
		// by clicking outside. `wasOpen` guards the close branch so the initial
		// mount never steals focus from the page.
		const previouslyFocused = React.useRef<HTMLElement | null>(null)
		const wasOpen = React.useRef(false)
		React.useEffect(() => {
			if (open) {
				wasOpen.current = true
				previouslyFocused.current = document.activeElement as HTMLElement
				const frame = requestAnimationFrame(() => floatingRef.current?.focus({ preventScroll: true }))
				return () => cancelAnimationFrame(frame)
			}
			if (!wasOpen.current) return
			wasOpen.current = false
			const active = document.activeElement
			const focusIsLost = !active || active === document.body || floatingRef.current?.contains(active)
			if (focusIsLost) {
				const target = (context.anchorRef.current as HTMLElement | null) ?? previouslyFocused.current
				target?.focus?.({ preventScroll: true })
			}
		}, [open, floatingRef, context.anchorRef])

		if (!mounted) return null

		return (
			<Portal>
				<div
					ref={ref}
					id={context.contentId}
					role="dialog"
					tabIndex={-1}
					className={cx('bz-popover', className)}
					data-side={side}
					data-state={open ? 'open' : 'closed'}
					style={{ position: 'fixed', left: x, top: y, visibility: ready ? undefined : 'hidden' }}
					{...props}
				>
					{children}
				</div>
			</Portal>
		)
	}
)
