import * as React from 'react'
import { cx } from '../internal/cx.js'
import { CheckboxIndeterminate } from './checkbox-indeterminate.js'

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: React.ReactNode
	/** Secondary line under the label. */
	description?: React.ReactNode
	/** Validation error shown under the control. */
	error?: string
	/** Mixed state (e.g. a parent of partially selected children). */
	indeterminate?: boolean
}

/**
 * Themed checkbox with label and description. The box is a styled native
 * input — full keyboard and form semantics for free. Server-component safe;
 * `indeterminate` hydrates through a tiny client island.
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
	{ label, description, error, indeterminate, className, id, ...props },
	ref
) {
	const autoId = React.useId()
	const inputId = id ?? autoId
	const describedBy =
		[description ? `${inputId}-description` : null, error ? `${inputId}-error` : null]
			.filter(Boolean)
			.join(' ') || undefined

	return (
		<div className={cx('bz-checkbox', className)} data-disabled={props.disabled || undefined}>
			<span className="bz-checkbox__control">
				<input
					ref={ref}
					id={inputId}
					type="checkbox"
					className="bz-checkbox__input"
					data-indeterminate={indeterminate || undefined}
					aria-describedby={describedBy}
					aria-invalid={error ? true : undefined}
					{...props}
				/>
				<svg className="bz-checkbox__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
					<path d="M20 6 9 17l-5-5" />
				</svg>
				<svg className="bz-checkbox__dash" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" aria-hidden="true">
					<path d="M5 12h14" />
				</svg>
			</span>
			{(label != null || description != null || error != null) && (
				<span className="bz-checkbox__text">
					{label != null && (
						<label htmlFor={inputId} className="bz-checkbox__label">
							{label}
						</label>
					)}
					{description != null && (
						<span id={`${inputId}-description`} className="bz-checkbox__description">
							{description}
						</span>
					)}
					{error && (
						<span id={`${inputId}-error`} className="bz-checkbox__error" role="alert">
							{error}
						</span>
					)}
				</span>
			)}
			{indeterminate !== undefined && <CheckboxIndeterminate htmlFor={inputId} value={indeterminate} />}
		</div>
	)
})
