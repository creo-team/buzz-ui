"use client"
import * as React from 'react'
import { toast } from '../overlays/toast.js'
import { Shape, type ShapeConfig, setShapeCookie, getShapeFromCookie } from './shape-types.js'

export interface UseShapeSwitcherOptions {
	shapes: ShapeConfig[]
	defaultShape?: Shape | string
	/** Server-read shape for flicker-free SSR (pass from `getServerShape`). */
	initialShape?: string
	/** Announce changes with a toast. Default true. */
	showToast?: boolean
}

/**
 * Shared engine behind `ShapeSwitcher`: SSR-safe mounting, cookie
 * persistence, and DOM application via `data-shape` on `<html>`. Mirrors
 * `useThemeSwitcher`'s contract so the two feel like one system — color and
 * shape simply persist to separate cookies and apply to separate attributes.
 */
export function useShapeSwitcher({
	shapes,
	defaultShape = Shape.Soft,
	initialShape,
	showToast = true,
}: UseShapeSwitcherOptions) {
	const [shape, setShapeState] = React.useState(initialShape || defaultShape.toString())
	const [mounted, setMounted] = React.useState(Boolean(initialShape))

	const apply = React.useCallback((value: string) => {
		document.documentElement.setAttribute('data-shape', value)
	}, [])

	React.useEffect(() => {
		setMounted(true)
		if (!initialShape) {
			const saved = getShapeFromCookie(defaultShape)
			setShapeState(saved)
			apply(saved)
			return
		}
		apply(initialShape)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [defaultShape, initialShape])

	const setShape = React.useCallback(
		(value: string, options?: { silent?: boolean }) => {
			setShapeState(value)
			apply(value)
			setShapeCookie(value)
			if (showToast && !options?.silent) {
				const config = shapes.find(s => s.value === value)
				if (config) {
					toast(`${config.label} corners enabled`, {
						id: 'bz-shape-toast',
						duration: 1500,
						position: 'top-center',
					})
				}
			}
		},
		[apply, shapes, showToast]
	)

	const cycle = React.useCallback(() => {
		const index = shapes.findIndex(s => s.value === shape)
		const next = shapes[(index + 1) % shapes.length]?.value
		if (next) setShape(next.toString())
	}, [shape, shapes, setShape])

	return { shape, mounted, setShape, cycle }
}
