import * as React from 'react'
import { cx } from '../internal/cx.js'

export interface FieldMessages {
	error?: React.ReactNode
	warningText?: React.ReactNode
	helpText?: React.ReactNode
}

/** Compute the aria-describedby id list for a control wrapped in a Field. */
export function fieldDescribedBy(id: string, { error, warningText, helpText }: FieldMessages): string | undefined {
	const ids = [
		error ? `${id}-error` : null,
		warningText ? `${id}-warning` : null,
		helpText && !error && !warningText ? `${id}-help` : null,
	].filter(Boolean)
	return ids.length ? ids.join(' ') : undefined
}

export interface FieldProps extends FieldMessages {
	/** id of the control this field labels. */
	htmlFor: string
	label?: React.ReactNode
	/** Marks the label with a required indicator. */
	required?: boolean
	className?: string
	children: React.ReactNode
}

/**
 * Shared form-field chrome: label, control slot, and validation messages with
 * correct id wiring. All Buzz UI form controls use it internally; use it
 * directly to give custom controls the same look and accessibility.
 *
 * Renders in Server Components — no client JavaScript.
 */
export function Field({ htmlFor, label, required, error, warningText, helpText, className, children }: FieldProps) {
	return (
		<div className={cx('bz-field', className)}>
			{label != null && (
				<label htmlFor={htmlFor} className="bz-field__label">
					{label}
					{required && (
						<span className="bz-field__required" aria-hidden="true">
							*
						</span>
					)}
				</label>
			)}
			{children}
			{warningText != null && (
				<div id={`${htmlFor}-warning`} className="bz-field__message" data-tone="warning">
					{warningText}
				</div>
			)}
			{error != null && (
				<div id={`${htmlFor}-error`} className="bz-field__message" data-tone="error" role="alert">
					{error}
				</div>
			)}
			{helpText != null && error == null && warningText == null && (
				<div id={`${htmlFor}-help`} className="bz-field__message" data-tone="help">
					{helpText}
				</div>
			)}
		</div>
	)
}
