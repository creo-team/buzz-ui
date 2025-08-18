import * as React from 'react'

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger'

const styles: Record<AlertVariant, string> = {
	danger: 'border-[var(--c-danger)]/20 bg-[var(--c-danger-light)] text-[var(--c-danger)]',
	info: 'border-[var(--c-info)]/20 bg-[var(--c-info-light)] text-[var(--c-info)]',
	success: 'border-[var(--c-success)]/20 bg-[var(--c-success-light)] text-[var(--c-success)]',
	warning: 'border-[var(--c-warning)]/20 bg-[var(--c-warning-light)] text-[var(--c-warning)]',
}

const icons: Record<AlertVariant, React.ReactNode> = {
	danger: (
		<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	),
	info: (
		<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	),
	success: (
		<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	),
	warning: (
		<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	),
}

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
	variant?: AlertVariant
	header?: React.ReactNode
}

export function Alert({ variant = 'info', header, className = '', children, ...props }: AlertProps) {
	return (
		<div 
			className={[
				'rounded-[var(--radius-lg)] border p-4 text-sm', 
				styles[variant], 
				className
			].join(' ')} 
			role={variant === 'danger' ? 'alert' : 'status'}
			{...props}
		>
			<div className="flex gap-3">
				<div className="flex-shrink-0 mt-0.5">
					{icons[variant]}
				</div>
				<div className="flex-1">
					{header && <div className="mb-2 font-semibold">{header}</div>}
					<div>{children}</div>
				</div>
			</div>
		</div>
	)
}

