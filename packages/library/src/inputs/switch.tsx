"use client"
import * as React from 'react'
import { cx } from '../internal/cx.js'
import { useControllableState } from '../internal/use-controllable-state.js'

export type SwitchSize = 'sm' | 'md' | 'lg'

export interface SwitchProps
	extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'> {
	/** Controlled checked state. */
	checked?: boolean
	/** Initial state for uncontrolled usage. */
	defaultChecked?: boolean
	onChange?: (checked: boolean) => void
	size?: SwitchSize
	label?: React.ReactNode
	/** Secondary line under the label. */
	description?: React.ReactNode
	/** Submit this value with forms via a hidden input. */
	name?: string
	value?: string
}

/**
 * Toggle switch (WAI-ARIA `switch` pattern). Works controlled or
 * uncontrolled; posts a hidden input when `name` is given so it behaves in
 * plain forms and server actions.
 */
export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
	{
		checked,
		defaultChecked = false,
		onChange,
		size = 'md',
		label,
		description,
		name,
		value = 'on',
		className,
		disabled,
		id,
		...props
	},
	ref
) {
	const autoId = React.useId()
	const switchId = id ?? autoId
	const [isChecked, setChecked] = useControllableState({
		value: checked,
		defaultValue: defaultChecked,
		onChange,
	})

	const control = (
		<button
			ref={ref}
			id={switchId}
			type="button"
			role="switch"
			aria-checked={isChecked}
			aria-describedby={description != null ? `${switchId}-description` : undefined}
			disabled={disabled}
			className={cx('bz-switch', label == null ? className : undefined)}
			data-size={size}
			data-state={isChecked ? 'checked' : 'unchecked'}
			onClick={event => {
				props.onClick?.(event)
				if (!event.defaultPrevented) setChecked(!isChecked)
			}}
			{...props}
		>
			<span className="bz-switch__thumb" aria-hidden="true" />
			{name && isChecked && <input type="hidden" name={name} value={value} />}
		</button>
	)

	if (label == null && description == null) return control

	return (
		<div className={cx('bz-switch-field', className)} data-disabled={disabled || undefined}>
			{control}
			<span className="bz-switch-field__text">
				<label htmlFor={switchId} className="bz-switch-field__label">
					{label}
				</label>
				{description != null && (
					<span id={`${switchId}-description`} className="bz-switch-field__description">
						{description}
					</span>
				)}
			</span>
		</div>
	)
})
