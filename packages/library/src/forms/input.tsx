import * as React from 'react'

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string
	error?: string
	helpText?: string
	warningText?: string | null
}

/**
 * TextInput component inspired by Umbro's clean form design
 * Features proper labeling, validation states, and accessibility
 */
export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
	{ label, error, helpText, warningText, className = '', id, ...props },
	ref
) {
	const inputId = id || React.useId()
	const hasError = Boolean(error)
	const hasWarning = Boolean(warningText)

	return (
		<div className="space-y-1">
			{label && (
				<label 
					htmlFor={inputId} 
					className="block text-sm font-medium text-[var(--c-text)]"
				>
					{label}
				</label>
			)}
			<input
				ref={ref}
				id={inputId}
				className={[
					'w-full rounded-[var(--radius-lg)] border px-3 py-2 text-[var(--c-text)] placeholder:text-[var(--c-text-muted)] transition-colors focus:outline-none focus:ring-1',
					hasError 
						? 'border-[var(--c-danger)] bg-[var(--c-danger-light)] focus:border-[var(--c-danger)] focus:ring-[var(--c-danger)]/20' 
						: hasWarning
						? 'border-[var(--c-warning)] bg-[var(--c-warning-light)] focus:border-[var(--c-warning)] focus:ring-[var(--c-warning)]/20'
						: 'border-[var(--c-border-strong)] bg-[var(--c-surface)] focus:border-[var(--c-primary)] focus:ring-[var(--c-primary-ring)]',
					'disabled:cursor-not-allowed disabled:opacity-50',
					className,
				].join(' ')}
				aria-invalid={hasError}
				aria-describedby={
					[
						error && `${inputId}-error`,
						helpText && `${inputId}-help`,
						warningText && `${inputId}-warning`
					].filter(Boolean).join(' ') || undefined
				}
				{...props}
			/>
			{warningText && (
				<div 
					id={`${inputId}-warning`}
					className="text-xs text-[var(--c-warning)] bg-[var(--c-warning-light)] border border-[var(--c-warning)]/20 rounded-[var(--radius-md)] p-2"
				>
					{warningText}
				</div>
			)}
			{error && (
				<div 
					id={`${inputId}-error`}
					className="text-xs text-[var(--c-danger)]"
				>
					{error}
				</div>
			)}
			{helpText && !error && !warningText && (
				<div 
					id={`${inputId}-help`}
					className="text-xs text-[var(--c-text-muted)]"
				>
					{helpText}
				</div>
			)}
		</div>
	)
})

