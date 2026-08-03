"use client"
import * as React from 'react'
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js'

export type Side = 'top' | 'right' | 'bottom' | 'left'
export type Align = 'start' | 'center' | 'end'

export interface PositionOptions {
	/** Whether the floating element is currently rendered. */
	open: boolean
	/** Preferred side of the anchor. Default 'bottom'. */
	side?: Side
	/** Alignment along the anchor. Default 'center'. */
	align?: Align
	/** Gap between anchor and floating element in px. Default 8. */
	sideOffset?: number
	/** Offset along the alignment axis in px. Default 0. */
	alignOffset?: number
	/** Flip to the opposite side when there is not enough room. Default true. */
	flip?: boolean
	/** Minimum distance from the viewport edge in px. Default 8. */
	viewportPadding?: number
}

export interface PositionResult {
	/** Viewport (fixed-position) coordinates for the floating element. */
	x: number
	y: number
	/** The side actually used after collision handling. */
	side: Side
	align: Align
	/** Arrow position relative to the floating element, on the cross axis. */
	arrowX?: number
	arrowY?: number
	/** False until the first measurement to avoid a visible jump. */
	ready: boolean
	/** Force a re-measure (e.g. after content changes). */
	update: () => void
}

const OPPOSITE: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }

/**
 * Lean floating-element positioning: measures anchor + floating rects and
 * computes fixed-position coordinates with flip and shift collision handling.
 * Updates on open, scroll (capture), resize, and floating-element resize.
 * Combined with `Portal`, overlays escape `overflow: hidden` ancestors.
 */
export function usePosition(
	anchorRef: React.RefObject<Element | null>,
	floatingRef: React.RefObject<HTMLElement | null>,
	{
		open,
		side = 'bottom',
		align = 'center',
		sideOffset = 8,
		alignOffset = 0,
		flip = true,
		viewportPadding = 8,
	}: PositionOptions
): PositionResult {
	const [result, setResult] = React.useState<Omit<PositionResult, 'update'>>({
		x: 0,
		y: 0,
		side,
		align,
		ready: false,
	})

	const compute = React.useCallback(() => {
		const anchor = anchorRef.current
		const floating = floatingRef.current
		if (!anchor || !floating) return

		const a = anchor.getBoundingClientRect()
		const f = floating.getBoundingClientRect()
		const vw = window.innerWidth
		const vh = window.innerHeight

		const room: Record<Side, number> = {
			top: a.top - viewportPadding,
			bottom: vh - a.bottom - viewportPadding,
			left: a.left - viewportPadding,
			right: vw - a.right - viewportPadding,
		}

		let actualSide = side
		if (flip) {
			const needed = (s: Side) => (s === 'top' || s === 'bottom' ? f.height : f.width) + sideOffset
			if (room[side] < needed(side) && room[OPPOSITE[side]] > room[side]) {
				actualSide = OPPOSITE[side]
			}
		}

		let x = 0
		let y = 0
		const isVertical = actualSide === 'top' || actualSide === 'bottom'

		if (isVertical) {
			y = actualSide === 'top' ? a.top - f.height - sideOffset : a.bottom + sideOffset
			if (align === 'start') x = a.left + alignOffset
			else if (align === 'end') x = a.right - f.width - alignOffset
			else x = a.left + a.width / 2 - f.width / 2 + alignOffset
		} else {
			x = actualSide === 'left' ? a.left - f.width - sideOffset : a.right + sideOffset
			if (align === 'start') y = a.top + alignOffset
			else if (align === 'end') y = a.bottom - f.height - alignOffset
			else y = a.top + a.height / 2 - f.height / 2 + alignOffset
		}

		// Shift: clamp within the viewport on the cross axis.
		if (isVertical) {
			x = Math.min(Math.max(x, viewportPadding), Math.max(viewportPadding, vw - f.width - viewportPadding))
		} else {
			y = Math.min(Math.max(y, viewportPadding), Math.max(viewportPadding, vh - f.height - viewportPadding))
		}

		// Arrow: anchor center projected onto the floating element, clamped so
		// it never pokes past rounded corners.
		const ARROW_INSET = 12
		let arrowX: number | undefined
		let arrowY: number | undefined
		if (isVertical) {
			arrowX = Math.min(Math.max(a.left + a.width / 2 - x, ARROW_INSET), f.width - ARROW_INSET)
		} else {
			arrowY = Math.min(Math.max(a.top + a.height / 2 - y, ARROW_INSET), f.height - ARROW_INSET)
		}

		setResult(prev => {
			const next = { x, y, side: actualSide, align, arrowX, arrowY, ready: true }
			return prev.x === next.x &&
				prev.y === next.y &&
				prev.side === next.side &&
				prev.arrowX === next.arrowX &&
				prev.arrowY === next.arrowY &&
				prev.ready
				? prev
				: next
		})
	}, [anchorRef, floatingRef, side, align, sideOffset, alignOffset, flip, viewportPadding])

	useIsomorphicLayoutEffect(() => {
		if (!open) {
			setResult(prev => (prev.ready ? { ...prev, ready: false } : prev))
			return
		}
		let disposed = false
		let observer: ResizeObserver | undefined
		let attempts = 0

		// The floating element often mounts a frame after `open` flips (portals
		// defer to a client effect), so retry measuring until it exists —
		// bounded so a never-mounting ref can't spin rAF forever.
		const start = () => {
			if (disposed) return
			if (!floatingRef.current || !anchorRef.current) {
				if (++attempts <= 150) requestAnimationFrame(start)
				return
			}
			compute()
			if (typeof ResizeObserver !== 'undefined') {
				observer = new ResizeObserver(compute)
				observer.observe(floatingRef.current)
				if (anchorRef.current instanceof Element) observer.observe(anchorRef.current)
			}
		}
		start()

		window.addEventListener('scroll', compute, { capture: true, passive: true })
		window.addEventListener('resize', compute)
		return () => {
			disposed = true
			window.removeEventListener('scroll', compute, { capture: true })
			window.removeEventListener('resize', compute)
			observer?.disconnect()
		}
	}, [open, compute])

	return { ...result, update: compute }
}
