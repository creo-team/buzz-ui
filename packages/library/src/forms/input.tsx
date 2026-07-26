import * as React from 'react'
import { cx } from '../internal/cx.js'
import { Field, fieldDescribedBy } from './field.js'

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: React.ReactNode
	error?: string
	helpText?: React.ReactNode
	warningText?: string | null
	/** Element rendered inside the field, before the input (e.g. an icon). */
	startAdornment?: React.ReactNode
	/** Element rendered inside the field, after the input. */
	endAdornment?: React.ReactNode
	/** className for the outer field wrapper (className styles the input itself). */
	wrapperClassName?: string
}

/**
 * Text input with label, validation states and help text. Server-component
 * safe — renders with zero client JavaScript when uncontrolled.
 */
export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
	{
		label,
		error,
		helpText,
		warningText,
		startAdornment,
		endAdornment,
		className,
		wrapperClassName,
		id,
		required,
		...props
	},
	ref
) {
	const autoId = React.useId()
	const inputId = id ?? autoId
	const tone = error ? 'error' : warningText ? 'warning' : undefined

	const input = (
		<input
			ref={ref}
			id={inputId}
			className={cx('bz-input', className)}
			data-tone={tone}
			aria-invalid={error ? true : undefined}
			aria-describedby={fieldDescribedBy(inputId, { error, warningText, helpText })}
			required={required}
			{...props}
		/>
	)

	return (
		<Field
			htmlFor={inputId}
			label={label}
			required={required}
			error={error}
			warningText={warningText}
			helpText={helpText}
			className={wrapperClassName}
		>
			{startAdornment || endAdornment ? (
				<div className="bz-input-group" data-tone={tone}>
					{startAdornment && (
						<span className="bz-input-group__adornment" data-side="start">
							{startAdornment}
						</span>
					)}
					{input}
					{endAdornment && (
						<span className="bz-input-group__adornment" data-side="end">
							{endAdornment}
						</span>
					)}
				</div>
			) : (
				input
			)}
		</Field>
	)
})

/** Modern alias for TextInput. */
export const Input = TextInput
export type InputProps = TextInputProps
