"use client"
import * as React from 'react'
import { cx } from '../internal/cx.js'
import { useControllableState } from '../internal/use-controllable-state.js'

export type SliderSize = 'sm' | 'md' | 'lg'

export interface SliderMark {
	value: number
	label?: React.ReactNode
}

export interface SliderProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'size' | 'type'> {
	/** Controlled value. */
	value?: number
	/** Initial value for uncontrolled usage. Defaults to the midpoint. */
	defaultValue?: number
	onChange?: (value: number) => void
	/** Fires once when the user releases the thumb (commit). */
	onChangeEnd?: (value: number) => void
	min?: number
	max?: number
	step?: number
	label?: React.ReactNode
	/** Show the current value beside the label. Default true when label is set. */
	showValue?: boolean
	/** Format the displayed/announced value (e.g. v => `${v}%`). */
	formatValue?: (value: number) => string
	/** Tick marks rendered under the track. */
	marks?: SliderMark[]
	size?: SliderSize
	/** className for the outer wrapper (className styles the input itself). */
	wrapperClassName?: string
}

/**
 * Range slider built on the native `<input type="range">` — full keyboard
 * interaction (arrows, Home/End, PageUp/PageDown), form submission and
 * screen-reader semantics come from the platform; the library adds the
 * themed track/thumb, a filled progress track, marks and value display.
 */
export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(function Slider(
	{
		value: valueProp,
		defaultValue,
		onChange,
		onChangeEnd,
		min = 0,
		max = 100,
		step = 1,
		label,
		showValue,
		formatValue = v => String(v),
		marks,
		size = 'md',
		className,
		wrapperClassName,
		id,
		disabled,
		...props
	},
	ref
) {
	const autoId = React.useId()
	const sliderId = id ?? autoId
	const [value, setValue] = useControllableState({
		value: valueProp,
		defaultValue: defaultValue ?? (min + max) / 2,
		onChange,
	})

	const clamped = Math.min(Math.max(value, min), max)
	const percent = max === min ? 0 : ((clamped - min) / (max - min)) * 100
	const displayValue = showValue ?? label != null

	// Commit only after an actual change, exactly once per gesture — pointerup
	// followed by blur (or keyup then blur) must not double-fire onChangeEnd.
	const dirty = React.useRef(false)
	const commit = () => {
		if (!dirty.current) return
		dirty.current = false
		onChangeEnd?.(clamped)
	}

	return (
		<div
			className={cx('bz-slider', wrapperClassName)}
			data-size={size}
			data-disabled={disabled || undefined}
		>
			{(label != null || displayValue) && (
				<div className="bz-slider__header">
					{label != null && (
						<label htmlFor={sliderId} className="bz-slider__label">
							{label}
						</label>
					)}
					{displayValue && (
						<output htmlFor={sliderId} className="bz-slider__value" aria-hidden="true">
							{formatValue(clamped)}
						</output>
					)}
				</div>
			)}
			<div className="bz-slider__control">
				<input
					ref={ref}
					id={sliderId}
					type="range"
					className={cx('bz-slider__input', className)}
					min={min}
					max={max}
					step={step}
					value={clamped}
					disabled={disabled}
					aria-valuetext={formatValue(clamped)}
					{...props}
					style={{ ...props.style, '--bz-slider-fill': `${percent}%` } as React.CSSProperties}
					onChange={event => {
						dirty.current = true
						setValue(Number(event.target.value))
					}}
					onPointerUp={event => {
						props.onPointerUp?.(event)
						commit()
					}}
					onKeyUp={event => {
						props.onKeyUp?.(event)
						if (event.key.startsWith('Arrow') || ['Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) {
							commit()
						}
					}}
					onBlur={event => {
						props.onBlur?.(event)
						commit()
					}}
				/>
				{marks && marks.length > 0 && (
					<div className="bz-slider__marks" aria-hidden="true">
						{marks.map(mark => {
							const markValue = Math.min(Math.max(mark.value, min), max)
							const markPercent = max === min ? 0 : ((markValue - min) / (max - min)) * 100
							return (
								<span
									key={mark.value}
									className="bz-slider__mark"
									data-active={markValue <= clamped || undefined}
									style={{ left: `${markPercent}%` }}
								>
									<span className="bz-slider__mark-dot" />
									{mark.label != null && <span className="bz-slider__mark-label">{mark.label}</span>}
								</span>
							)
						})}
					</div>
				)}
			</div>
		</div>
	)
})
