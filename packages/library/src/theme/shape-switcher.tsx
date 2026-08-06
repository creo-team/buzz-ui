"use client"

import * as React from 'react'
import { cx } from '../internal/cx.js'
import { Tooltip } from '../overlays/tooltip.js'
import { ALL_SHAPES, Shape, type ShapeConfig } from './shape-types.js'
import { useShapeSwitcher } from './use-shape-switcher.js'

export interface ShapeSwitcherProps {
	shapes?: ShapeConfig[]
	defaultShape?: Shape | string
	/** Server-read shape for flicker-free SSR (pass from `getServerShape`). */
	initialShape?: string
	className?: string
}

/**
 * Segmented pill switcher for the shape system (corner radius, elevation and
 * motion — orthogonal to color theme). Each option's glyph is a literal
 * miniature of that shape's corner radius, so the picker previews itself.
 *
 * Pairs naturally with `ThemeSwitcher`: mount both, and visitors can combine
 * any of the 6 color themes with any of the 3 shapes.
 */
export function ShapeSwitcher({
	shapes = ALL_SHAPES,
	defaultShape = Shape.Soft,
	initialShape,
	className,
}: ShapeSwitcherProps) {
	const { shape, mounted, setShape, cycle } = useShapeSwitcher({
		shapes,
		defaultShape,
		initialShape,
	})

	return (
		<div className={cx('bz-theme-switcher', className)} role="group" aria-label="Shape">
			{shapes.map(option => {
				const isActive = shape === option.value
				const label = option.description ? `${option.label} — ${option.description}` : option.label
				return (
					<Tooltip key={option.value} content={label}>
						<button
							type="button"
							className="bz-theme-switcher__option"
							data-active={isActive || undefined}
							aria-label={`Switch to ${option.value} corners`}
							aria-pressed={isActive}
							disabled={!mounted}
							onClick={() => (isActive ? cycle() : setShape(option.value.toString()))}
						>
							<span className="bz-shape-switcher__swatch" data-shape-preview={option.value} aria-hidden="true" />
						</button>
					</Tooltip>
				)
			})}
		</div>
	)
}
