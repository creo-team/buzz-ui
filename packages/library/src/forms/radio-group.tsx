import * as React from 'react'
import { cx } from '../internal/cx.js'
import { FormFieldError } from './form.js'

/** One option in a {@link RadioGroup}. */
export interface RadioOption {
	/** Submitted form value; unique within the group. */
	value: string
	label: React.ReactNode
	/** Secondary line under the option label. */
	description?: React.ReactNode
	disabled?: boolean
}

/** Props for {@link RadioGroup}. */
export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLFieldSetElement>, 'onChange'> {
	/** Group label rendered as the `<legend>`. */
	label?: React.ReactNode
	/** Shared input `name` — also the key form-level errors are reported under. */
	name: string
	options: RadioOption[]
	/** Controlled selected value. */
	value?: string
	/** Initial value for uncontrolled usage (e.g. server-action forms). */
	defaultValue?: string
	/** Fires with the selected option's value. The group is controlled only when both `value` and `onChange` are set. */
	onChange?: (value: string) => void
	/** Stack direction. Default 'horizontal'. */
	orientation?: 'horizontal' | 'vertical'
	error?: string
	helpText?: React.ReactNode
	disabled?: boolean
}

/**
 * Radio group with real `<fieldset>`/`<legend>` semantics and themed radios.
 * Server-component safe when used uncontrolled (no `onChange`).
 */
export function RadioGroup({
	label,
	name,
	options,
	value,
	defaultValue,
	onChange,
	orientation = 'horizontal',
	error,
	helpText,
	disabled,
	className,
	...props
}: RadioGroupProps) {
	const groupId = React.useId()
	const describedBy =
		[error ? `${groupId}-error` : null, helpText && !error ? `${groupId}-help` : null]
			.filter(Boolean)
			.join(' ') || undefined

	return (
		<fieldset
			id={groupId}
			className={cx('bz-radio-group', className)}
			disabled={disabled}
			aria-describedby={describedBy}
			aria-invalid={error ? true : undefined}
			{...props}
		>
			{label != null && <legend className="bz-radio-group__legend">{label}</legend>}
			<div className="bz-radio-group__options" data-orientation={orientation}>
				{options.map(opt => {
					const optionId = `${groupId}-${opt.value}`
					return (
						<div key={opt.value} className="bz-radio" data-disabled={opt.disabled || disabled || undefined}>
							<span className="bz-radio__control">
								<input
									id={optionId}
									type="radio"
									className="bz-radio__input"
									name={name}
									value={opt.value}
									disabled={opt.disabled}
									aria-describedby={opt.description != null ? `${optionId}-description` : undefined}
									{...(value !== undefined && onChange
										? { checked: value === opt.value, onChange: () => onChange(opt.value) }
										: { defaultChecked: (defaultValue ?? value) === opt.value })}
								/>
								<span className="bz-radio__dot" aria-hidden="true" />
							</span>
							<span className="bz-radio__text">
								<label htmlFor={optionId} className="bz-radio__label">
									{opt.label}
								</label>
								{opt.description != null && (
									<span id={`${optionId}-description`} className="bz-radio__description">
										{opt.description}
									</span>
								)}
							</span>
						</div>
					)
				})}
			</div>
			{error && (
				<div id={`${groupId}-error`} className="bz-field__message" data-tone="error" role="alert">
					{error}
				</div>
			)}
			{error == null && <FormFieldError name={name} htmlFor={groupId} />}
			{helpText != null && !error && (
				<div id={`${groupId}-help`} className="bz-field__message" data-tone="help">
					{helpText}
				</div>
			)}
		</fieldset>
	)
}
