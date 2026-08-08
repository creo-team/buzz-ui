"use client"

import * as React from 'react'
import { cx } from '../internal/cx.js'
import { Button, type ButtonProps } from './button.js'

/** Screen corner (or top/bottom edge center) the Fab floats in. */
export type FabPosition = 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left'

export interface FabProps extends ButtonProps {
	/** Corner (or edge-center) to float in. Default 'bottom-right'. */
	position?: FabPosition
	/** Distance from the viewport edge, in px. Default 24. */
	offset?: number
}

/**
 * A Button pinned to a screen corner via `position: fixed` — the same
 * variants, sizes, hotkeys and `asChild` polymorphism as Button, just
 * floating above page content instead of sitting in flow.
 *
 * Pair with `iconOnly` for the classic circular FAB, or icon + label
 * children for an extended pill. Composes with the Style system (radius,
 * shadow and motion follow `data-style` like every other surface) and sits
 * below every overlay (modal, popover, tooltip, toast) in the z-index scale,
 * so it never floats over content that should take priority.
 */
export const Fab = React.forwardRef<HTMLButtonElement, FabProps>(function Fab(
	{ className, style, position = 'bottom-right', offset = 24, ...props },
	ref
) {
	return (
		<Button
			ref={ref}
			className={cx('bz-fab', className)}
			data-position={position}
			style={{ ...style, '--bz-fab-offset': `${offset}px` } as React.CSSProperties}
			{...props}
		/>
	)
})
