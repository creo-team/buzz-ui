import * as React from 'react'
import { cx } from '../internal/cx.js'

export enum ProgressVariant {
	Primary = 'primary',
	Success = 'success',
	Warning = 'warning',
	Danger = 'danger',
	Info = 'info',
	Glass = 'glass',
}

export enum ProgressSize {
	ExtraSmall = 'xs',
	Small = 'sm',
	Medium = 'md',
	Large = 'lg',
	ExtraLarge = 'xl',
}

export enum ProgressShape {
	Rounded = 'rounded',
	Square = 'square',
	Pill = 'pill',
}

export interface ProgressProps {
	/** Percentage 0–100. */
	value?: number
	size?: ProgressSize | `${ProgressSize}`
	variant?: ProgressVariant | `${ProgressVariant}`
	/** Show label row with percentage. */
	showLabel?: boolean
	/** Animated shine on the filled bar. */
	animated?: boolean
	/** Striped pattern. */
	striped?: boolean
	/** Indeterminate (loading) state with a sweeping bar. */
	indeterminate?: boolean
	/** Custom label text. */
	label?: string
	shape?: ProgressShape | `${ProgressShape}`
	className?: string
}

/**
 * Linear progress bar. All motion is CSS-driven and honors
 * `prefers-reduced-motion`. Server-component safe.
 */
export function Progress({
	value = 0,
	size = ProgressSize.Medium,
	variant = ProgressVariant.Primary,
	showLabel = false,
	animated = false,
	striped = false,
	indeterminate = false,
	label,
	shape = ProgressShape.Rounded,
	className,
}: ProgressProps) {
	const clamped = Math.max(0, Math.min(100, value))
	const labelId = React.useId()

	return (
		<div className={cx('bz-progress', className)} data-size={size as string} data-shape={shape as string}>
			{showLabel && (
				<div className="bz-progress__labels">
					<span id={labelId} className="bz-progress__label">
						{label ?? 'Progress'}
					</span>
					{!indeterminate && <span className="bz-progress__value">{Math.round(clamped)}%</span>}
				</div>
			)}
			<div
				className="bz-progress__track"
				role="progressbar"
				aria-valuenow={indeterminate ? undefined : clamped}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-labelledby={showLabel ? labelId : undefined}
				aria-label={!showLabel ? label ?? 'Progress' : undefined}
			>
				<div
					className="bz-progress__bar"
					data-variant={variant as string}
					data-striped={striped || undefined}
					data-animated={animated || undefined}
					data-indeterminate={indeterminate || undefined}
					style={indeterminate ? undefined : { width: `${clamped}%` }}
				/>
			</div>
		</div>
	)
}
