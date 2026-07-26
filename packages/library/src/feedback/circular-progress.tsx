import * as React from 'react'
import { cx } from '../internal/cx.js'

export enum CircularProgressVariant {
	Primary = 'primary',
	Success = 'success',
	Warning = 'warning',
	Danger = 'danger',
	Info = 'info',
}

export interface CircularProgressProps {
	/** Percentage 0–100. */
	value?: number
	/** Diameter in pixels. */
	size?: number
	strokeWidth?: number
	variant?: CircularProgressVariant | `${CircularProgressVariant}`
	/** Show the percentage in the center. */
	showLabel?: boolean
	/** Indeterminate (loading) state — spinning arc. */
	indeterminate?: boolean
	/** Accessible label. */
	label?: string
	className?: string
}

/**
 * Circular progress ring. CSS-animated when indeterminate; honors
 * `prefers-reduced-motion`. Server-component safe.
 */
export function CircularProgress({
	value = 0,
	size = 48,
	strokeWidth = 4,
	variant = CircularProgressVariant.Primary,
	showLabel = false,
	indeterminate = false,
	label = 'Progress',
	className,
}: CircularProgressProps) {
	const clamped = Math.max(0, Math.min(100, value))
	const radius = (size - strokeWidth) / 2
	const circumference = radius * 2 * Math.PI
	const strokeDashoffset = circumference - (clamped / 100) * circumference

	return (
		<div
			className={cx('bz-circular-progress', className)}
			role="progressbar"
			aria-valuenow={indeterminate ? undefined : clamped}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-label={label}
		>
			<svg width={size} height={size} data-indeterminate={indeterminate || undefined} className="bz-circular-progress__svg">
				<circle
					className="bz-circular-progress__track"
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					strokeWidth={strokeWidth}
				/>
				<circle
					className="bz-circular-progress__bar"
					data-variant={variant as string}
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					strokeWidth={strokeWidth}
					strokeDasharray={circumference}
					strokeDashoffset={indeterminate ? circumference * 0.75 : strokeDashoffset}
					strokeLinecap="round"
					transform={`rotate(-90 ${size / 2} ${size / 2})`}
				/>
			</svg>
			{showLabel && !indeterminate && (
				<span className="bz-circular-progress__label">{Math.round(clamped)}%</span>
			)}
		</div>
	)
}
