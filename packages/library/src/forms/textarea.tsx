import * as React from 'react'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string
	error?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
	{ label, error, className = '', ...props },
	ref
) {
	return (
		<label className="block text-sm text-[var(--c-text)]">
			{label && <span className="mb-1 block text-[var(--c-text-secondary)]">{label}</span>}
			<textarea
				ref={ref}
				className={[
					'block w-full rounded-xl border bg-[var(--c-surface)] px-3 py-2 text-[var(--c-text)] placeholder:text-[var(--c-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--c-primary-ring)]',
					error ? 'border-[var(--c-danger)]' : 'border-[var(--c-border)]',
					className,
				].join(' ')}
				{...props}
			/>
			{error && <span className="mt-1 block text-xs text-[var(--c-danger)]">{error}</span>}
		</label>
	)
})

