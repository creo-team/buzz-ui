import * as React from 'react'

export enum AlertVariant {
	Info = 'info',
	Success = 'success',
	Warning = 'warning',
	Danger = 'danger'
}

// Accept both enum and its string literal values for DX
type AlertVariantInput = AlertVariant | `${AlertVariant}`

const styles: Record<AlertVariant, string> = {
	[AlertVariant.Danger]: 'border-[var(--c-danger)]/20 bg-[var(--c-danger-light)] text-[var(--c-danger)]',
	[AlertVariant.Info]: 'border-[var(--c-info)]/20 bg-[var(--c-info-light)] text-[var(--c-info)]',
	[AlertVariant.Success]: 'border-[var(--c-success)]/20 bg-[var(--c-success-light)] text-[var(--c-success)]',
	[AlertVariant.Warning]: 'border-[var(--c-warning)]/20 bg-[var(--c-warning-light)] text-[var(--c-warning)]',
}

const icons: Record<AlertVariant, React.ReactNode> = {
	[AlertVariant.Danger]: (
		<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	),
	[AlertVariant.Info]: (
		<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	),
	[AlertVariant.Success]: (
		<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	),
	[AlertVariant.Warning]: (
		<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	),
}

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
	variant?: AlertVariantInput
	header?: React.ReactNode
}

export function Alert({ variant = AlertVariant.Info, header, className = '', children, ...props }: AlertProps) {
	const resolvedVariant = variant as AlertVariant
	return (
		<div 
			className={[
				'rounded-[var(--radius-lg)] border p-4 text-sm', 
				styles[resolvedVariant], 
				className
			].join(' ')} 
			role={resolvedVariant === AlertVariant.Danger ? 'alert' : 'status'}
			{...props}
		>
			<div className="flex gap-3">
				<div className="flex-shrink-0 mt-0.5">
					{icons[resolvedVariant]}
				</div>
				<div className="flex-1">
					{header && <div className="mb-2 font-semibold">{header}</div>}
					<div>{children}</div>
				</div>
			</div>
		</div>
	)
}

