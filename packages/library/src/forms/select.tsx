import * as React from 'react'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	label?: string
	error?: string
	helpText?: string
}

/**
 * Select component inspired by Umbro's clean form design
 * Native select element with consistent styling and validation states
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
	{ label, error, helpText, className = '', children, id, ...props },
	ref
) {
	const selectId = id || React.useId()
	const hasError = Boolean(error)

	return (
		<div className="space-y-1">
			{label && (
				<label 
					htmlFor={selectId} 
					className="block text-sm font-medium text-[var(--c-text)]"
				>
					{label}
				</label>
			)}
			<select
				ref={ref}
				id={selectId}
				className={[
					'w-full rounded-[var(--radius-lg)] border px-3 py-2 text-[var(--c-text)] transition-colors focus:outline-none focus:ring-1 appearance-none bg-[var(--c-surface)]',
					'bg-[url("data:svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")] bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10',
					hasError 
						? 'border-[var(--c-danger)] focus:border-[var(--c-danger)] focus:ring-[var(--c-danger)]/20' 
						: 'border-[var(--c-border-strong)] focus:border-[var(--c-primary)] focus:ring-[var(--c-primary-ring)]',
					'disabled:cursor-not-allowed disabled:opacity-50',
					className,
				].join(' ')}
				aria-invalid={hasError}
				aria-describedby={
					[
						error && `${selectId}-error`,
						helpText && `${selectId}-help`
					].filter(Boolean).join(' ') || undefined
				}
				{...props}
			>
				{children}
			</select>
			{error && (
				<div 
					id={`${selectId}-error`}
					className="text-xs text-[var(--c-danger)]"
				>
					{error}
				</div>
			)}
			{helpText && !error && (
				<div 
					id={`${selectId}-help`}
					className="text-xs text-[var(--c-text-muted)]"
				>
					{helpText}
				</div>
			)}
		</div>
	)
})

