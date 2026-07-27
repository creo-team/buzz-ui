import * as React from 'react'
import { cx } from '../internal/cx.js'
import { Field, fieldDescribedBy } from './field.js'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	label?: React.ReactNode
	error?: string
	helpText?: React.ReactNode
	/** className for the outer field wrapper. */
	wrapperClassName?: string
}

/**
 * Native select with consistent styling and validation states. Uses the
 * platform picker — the most accessible and mobile-friendly select there is.
 * Server-component safe.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
	{ label, error, helpText, className, wrapperClassName, children, id, required, ...props },
	ref
) {
	const autoId = React.useId()
	const selectId = id ?? autoId

	return (
		<Field
			htmlFor={selectId}
			label={label}
			required={required}
			error={error}
			helpText={helpText}
			className={wrapperClassName}
		>
			<span className="bz-select-wrap">
				<select
					ref={ref}
					id={selectId}
					className={cx('bz-select', className)}
					data-tone={error ? 'error' : undefined}
					aria-invalid={error ? true : undefined}
					aria-describedby={fieldDescribedBy(selectId, { error, helpText })}
					required={required}
					{...props}
				>
					{children}
				</select>
				<svg
					className="bz-select-wrap__chevron"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<path d="m6 9 6 6 6-6" />
				</svg>
			</span>
		</Field>
	)
})
