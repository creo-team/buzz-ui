import * as React from 'react'
import { cx } from '../internal/cx.js'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Shape preset. Default 'rect'. */
	variant?: 'rect' | 'text' | 'circle'
	/** Convenience size props (any CSS length). */
	width?: number | string
	height?: number | string
	/** Render several stacked lines (text variant). */
	lines?: number
}

/**
 * Loading placeholder with a theme-aware shimmer. Marked `aria-hidden` —
 * pair with proper loading announcements at the container level.
 * Server-component safe.
 */
export function Skeleton({ variant = 'rect', width, height, lines, className, style, ...props }: SkeletonProps) {
	const inline: React.CSSProperties = { ...style }
	if (width !== undefined) inline.width = width
	if (height !== undefined) inline.height = height

	if (lines && lines > 1) {
		return (
			<div className={cx('bz-skeleton-lines', className)} aria-hidden="true" {...props}>
				{Array.from({ length: lines }, (_, i) => (
					<div key={i} className="bz-skeleton" data-variant="text" style={i === lines - 1 ? { width: '60%' } : undefined} />
				))}
			</div>
		)
	}

	return (
		<div className={cx('bz-skeleton', className)} data-variant={variant} style={inline} aria-hidden="true" {...props} />
	)
}
