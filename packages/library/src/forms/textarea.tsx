import * as React from 'react'
import { cx } from '../internal/cx.js'
import { Field, fieldDescribedBy } from './field.js'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: React.ReactNode
	error?: string
	helpText?: React.ReactNode
	/**
	 * Grow with content via CSS `field-sizing: content` — zero JavaScript.
	 * Browsers without support keep the fixed size (progressive enhancement).
	 */
	autoResize?: boolean
	/** className for the outer field wrapper. */
	wrapperClassName?: string
}

/** Multiline text input with label and validation states. Server-component safe. */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
	{ label, error, helpText, autoResize, className, wrapperClassName, id, required, ...props },
	ref
) {
	const autoId = React.useId()
	const textareaId = id ?? autoId

	return (
		<Field
			htmlFor={textareaId}
			label={label}
			required={required}
			error={error}
			helpText={helpText}
			className={wrapperClassName}
		>
			<textarea
				ref={ref}
				id={textareaId}
				className={cx('bz-textarea', className)}
				data-tone={error ? 'error' : undefined}
				data-auto-resize={autoResize || undefined}
				aria-invalid={error ? true : undefined}
				aria-describedby={fieldDescribedBy(textareaId, { error, helpText })}
				required={required}
				{...props}
			/>
		</Field>
	)
})
